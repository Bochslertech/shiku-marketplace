import { useCallback, useEffect, useMemo, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer, message } from 'antd';
import { Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useConnect } from '@connect2ic/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { shallow } from 'zustand/shallow';
import { SupportedLedgerTokenSymbol } from '@/01_types/canisters/ledgers';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { exponentNumber, isValidNumber, thousandCommaOnlyInteger } from '@/02_common/data/numbers';
import { shrinkAccount, shrinkPrincipal } from '@/02_common/data/text';
import { isAccountHex, principal2account } from '@/02_common/ic/account';
import { isPrincipalText } from '@/02_common/ic/principals';
import { bigint2string } from '@/02_common/types/bigint';
import { writeLastConnectType } from '@/05_utils/app/storage';
import { getTokenDecimals } from '@/05_utils/canisters/ledgers/special';
import { useDeviceStore } from '@/07_stores/device';
import { useIdentityStore } from '@/07_stores/identity';
import { useTransfer } from '@/08_hooks/ledger/transfer';
import YumiIcon from '@/09_components/ui/yumi-icon';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../data/form';
import TokenPrice from '../../../data/price';
import { IconKyc, IconLogoLedgerIcp, IconLogoLedgerOgy } from '../../../icons';
import { Button } from '../../../ui/button';
import CloseIcon from '../../../ui/close-icon';
import { Input } from '../../../ui/input';
import SkeletonTW from '../../../ui/skeleton';
import Tooltip from '../../../ui/tooltip';
import Credit from '../../../user/credit';
import { DepositModal } from './deposit';
import './index.less';

// deposit money to icp
const getFormSchema = (
    balance: string,
    fee: string,
    decimals: number,
    symbol: SupportedLedgerTokenSymbol,
) => {
    return z.object({
        amount: z
            .string()
            .nonempty({
                message: 'Please enter the amount to transfer',
            }) // 必须有内容
            .refine(
                (amount) => !isNaN(Number(amount)) && isValidNumber(amount, 8), // 最大支持 8 位小数的数字
                {
                    message: 'Expected a valid number',
                },
            )
            .refine(
                (amount) => {
                    return (
                        !isNaN(Number(amount)) &&
                        isValidNumber(amount, 8) &&
                        BigInt(exponentNumber(amount, decimals)) + BigInt(fee) <= BigInt(balance)
                    ); // 余额限制
                },
                {
                    message: 'Not sufficient funds',
                },
            )
            .refine(
                (amount) => {
                    const n = Number(amount);
                    return symbol === 'ICP'
                        ? 0.0002 <= n && n < 100000
                        : 0.003 <= n && n < 10000000; // 范围限制
                },
                {
                    message:
                        symbol === 'ICP'
                            ? "Transaction amount can't be lower than 0.0002 or exceed 100000"
                            : "Transaction amount can't be lower than 0.003 or exceed 10000000",
                },
            ),
        principal: z
            .string()
            .nonempty({
                message: 'Please enter a principal or account id',
            })
            .refine(
                (target) => isPrincipalText(target) || isAccountHex(target), // 最大支持 8 位小数的数字
                {
                    message: 'Expected a principal or account id',
                },
            ),
    });
};
function SideBarWrapper({
    children,
    onClose,
    open,
}: {
    children?;
    onClose: () => void;
    open: boolean;
}) {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);
    return (
        <>
            {!isMobile ? (
                <Modal
                    open={open}
                    footer={null}
                    //onOk={onConfirm}
                    width={415}
                    closeIcon={null}
                    onCancel={onClose}
                    styles={{
                        mask: { backgroundColor: 'transparent' },
                    }}
                    maskClosable={true}
                    className="sidebar-modal-wrap"
                >
                    {children}
                </Modal>
            ) : (
                <Drawer
                    open={open}
                    closeIcon={<CloseIcon className="ml-auto" onClick={onClose} />}
                    contentWrapperStyle={{ height: '100vh' }}
                    placement="top"
                    styles={{
                        body: { padding: 0 },
                    }}
                    closable={true}
                    className="sidebar-drawer-wrapper"
                >
                    {children}
                </Drawer>
            )}
        </>
    );
}
export default function SideBar() {
    const navigate = useNavigate();
    const {
        connectedIdentity,
        kycResult,
        principal,
        identityProfile,
        reloadIcpBalance,
        reloadOgyBalance,
        isUserSidebarOpen,
        toggleIsUserSidebarIdOpen,
        toggleAddFundsOpen,
    } = useIdentityStore(
        (s) => ({
            connectedIdentity: s.connectedIdentity,
            kycResult: s.kycResult,
            principal: s.connectedIdentity?.principal,
            identityProfile: s.identityProfile,
            reloadIcpBalance: s.reloadIcpBalance,
            reloadOgyBalance: s.reloadOgyBalance,
            creditPoints: s.creditPoints,
            isUserSidebarOpen: s.isUserSidebarOpen,
            toggleIsUserSidebarIdOpen: s.toggleIsUserSidebarIdOpen,
            toggleAddFundsOpen: s.toggleAddFundsOpen,
        }),
        shallow,
    );

    const { disconnect } = useConnect(); // 可以断开登录

    // memoized
    const account = principal ? principal2account(principal) : '';

    const [copied, setCopied] = useState(false);

    const nftOptions = useMemo(() => {
        return [
            { key: 'Collected', label: 'Collected', path: `/profile/${principal}/collected` },
            { key: 'Created', label: 'Created', path: `/profile/${principal}/created` },
            { key: 'Favorited', label: 'Favorited', path: `/profile/${principal}/favorite` },
            { key: 'Activity', label: 'Activity', path: `/profile/${principal}/activity` },
        ];
    }, [principal]);

    // 刷新钱包余额
    const [balanceLoading, setBalanceLoading] = useState(false); // 防止重复点击

    const reloadBalance = () => {
        if (connectedIdentity === undefined) return; // 未登录,不理会
        if (balanceLoading) return; // 防止重复点击
        setBalanceLoading(true);
        Promise.all([reloadIcpBalance(), reloadOgyBalance()])
            .catch((e) => message.error(`${e}`))
            .finally(() => setBalanceLoading(false));
    };
    // 初始加载更新余额
    useEffect(() => {
        isUserSidebarOpen && reloadBalance();
    }, [isUserSidebarOpen]);

    // 监听点击下拉菜单
    const handleOption = ({ path }: { path: string }) => {
        if (path) {
            toggleIsUserSidebarIdOpen();
            navigate(path);
        }
    };

    // useInterval(() => {
    //     reloadBalance();
    // }, 10000);

    // symbol
    const [symbol, setSymbol] = useState<SupportedLedgerTokenSymbol>('ICP');
    const { balance, fee, decimals, transfer, transferring } = useTransfer(symbol);
    const e8s = balance?.e8s;

    const form = useForm<{ amount: string; principal: string }>({
        resolver: zodResolver(getFormSchema(e8s ?? '0', fee ?? '0', decimals ?? 8, symbol)),
    });

    const onSubmit = useCallback(
        (data: { amount: string; principal: string }) => {
            if (transferring) {
                return;
            }
            const { principal } = data;
            const amount = exponentNumber(data.amount, getTokenDecimals(symbol));
            transfer({
                to: isPrincipalText(principal) ? principal2account(principal) : principal,
                amount,
            })
                .then((height) => {
                    if (height) {
                        message.success(`Transfer successful.`);
                        form.reset({
                            amount: '',
                            principal: '',
                        });
                    }
                })
                .catch((e) => message.error(`${e}`));
        },
        [symbol, transfer],
    );

    // 设置最大
    const setMax = useCallback(() => {
        const max = Number(
            exponentNumber(bigint2string(BigInt(e8s ?? '0') - BigInt(fee)), -decimals),
        );
        form.setValue('amount', max > 0 ? max.toString() : '0');
        form.trigger();
    }, [symbol, fee, e8s, decimals]);

    // 设置是否为addFunds
    const [isAddFunds, setIsAddFunds] = useState<boolean>(true);

    // deposit modal 开启
    const [depositOpen, setDepositOpen] = useState<boolean>(false);
    return (
        <SideBarWrapper
            open={isUserSidebarOpen}
            onClose={() => {
                toggleIsUserSidebarIdOpen();
                // 关闭时清空form
                form.reset(undefined, { keepDefaultValues: true });
                form.setValue('amount', '');
                form.setValue('principal', '');
            }}
        >
            <div className="flex h-full flex-col items-center justify-center p-[30px] pt-[25px]">
                <div className="mb-[10px] flex w-full items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center overflow-hidden">
                            {identityProfile ? (
                                <img
                                    className="h-[50px] w-[50px] rounded-[50%]"
                                    src={cdn(identityProfile.avatar)}
                                    alt=""
                                />
                            ) : (
                                <img
                                    className="rounded-1/2 h-[50px] w-[50px]"
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/loading-gif.gif',
                                    )}
                                    alt=""
                                />
                            )}
                            <div className="ml-[14px] flex h-[50px] flex-col items-start justify-between ">
                                <div className="flex">
                                    {' '}
                                    {identityProfile ? (
                                        <div className="max-w-[200px] font-inter-bold text-[18px]  leading-tight text-[#000]">
                                            {shrinkPrincipal(
                                                identityProfile?.username ??
                                                    connectedIdentity?.principal ??
                                                    '',
                                            )}
                                        </div>
                                    ) : (
                                        <SkeletonTW className="!h-[20px] !w-[110px]" />
                                    )}
                                    <div
                                        className="relative ml-1 cursor-pointer rounded-md bg-cover bg-no-repeat text-xs font-bold text-white"
                                        onClick={() =>
                                            handleOption({
                                                path: '/kyc/introduction',
                                            })
                                        }
                                    >
                                        {kycResult?.level === 'NA' &&
                                        kycResult?.status === 'pending' ? (
                                            <div className="rounded-[6px] bg-black px-[6px] py-[4px]">
                                                Pending
                                            </div>
                                        ) : (
                                            <IconKyc
                                                level={(kycResult?.level ?? 'na').toLowerCase()}
                                                className="h-[22px] w-[22px]"
                                            />
                                        )}
                                    </div>
                                </div>
                                <Credit account={identityProfile?.account || ''} hasLabel={false} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-x-[15px]">
                        <Link
                            to="/profile/settings"
                            onClick={() => {
                                toggleIsUserSidebarIdOpen(); // 关闭侧边栏
                            }}
                        >
                            <img
                                className="h-[24px] w-[24px] cursor-pointer  rounded-full hover:border-black"
                                src={'/img/sidebar/setting.svg'}
                            ></img>
                        </Link>
                        <img
                            className="h-[24px] w-[24px] cursor-pointer rounded-full  hover:border-black"
                            src={'/img/sidebar/logout.svg'}
                            onClick={() => {
                                writeLastConnectType('');
                                disconnect(); // 断开登录
                                toggleIsUserSidebarIdOpen(); // 关闭侧边栏
                                navigate('/'); // 回到首页
                            }}
                        ></img>
                    </div>
                </div>

                <div className="flex w-full items-center justify-between">
                    <div
                        className="relative flex h-5 shrink-0 cursor-pointer items-center text-sm leading-4 "
                        onMouseLeave={() => setCopied(false)}
                    >
                        <div className="peer text-[12px] leading-tight">
                            <span className="font-inter-medium  text-symbol">Principal ID:</span>
                            <CopyToClipboard text={principal} onCopy={() => setCopied(true)}>
                                <Tooltip
                                    title={copied ? 'Copied' : 'Copy'}
                                    overlayInnerStyle={{ width: '80px', textAlign: 'center' }}
                                    placement="bottom"
                                    className="pl-[3px] text-left font-inter-semibold text-stress"
                                >
                                    {shrinkPrincipal(principal)}
                                </Tooltip>
                            </CopyToClipboard>
                        </div>
                    </div>

                    <div className="h-[16px] w-[2px] bg-[#f6f6f6]"></div>

                    <div
                        className="relative flex h-5 shrink-0 cursor-pointer items-center text-sm"
                        onMouseLeave={() => setCopied(false)}
                    >
                        <div className="peer relative flex h-full items-center text-[12px] leading-tight text-symbol">
                            <span className="font-inter-medium ">Account ID:</span>
                            <CopyToClipboard text={account} onCopy={() => setCopied(true)}>
                                <Tooltip
                                    title={copied ? 'Copied' : 'Copy'}
                                    placement="bottom"
                                    overlayInnerStyle={{ width: '80px', textAlign: 'center' }}
                                    className="pl-[3px] text-left font-inter-semibold text-stress"
                                >
                                    {shrinkAccount(account)}
                                </Tooltip>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
                <div className="mt-[40px] flex w-full flex-col items-center justify-between">
                    <div className="flex w-full justify-between">
                        <div className="font-inter-semibold text-[18px] text-stress">My NFTs</div>
                        <Link
                            to={`/profile/${principal}/collected`}
                            onClick={toggleIsUserSidebarIdOpen}
                        >
                            <img
                                src="/img/sidebar/right-arrow.svg"
                                className="cursor-pointer"
                                alt=""
                            />
                        </Link>
                    </div>

                    <div className="mt-[20px] flex w-full justify-between">
                        {nftOptions.map((item) => {
                            return (
                                <div
                                    key={item.key}
                                    className="flex cursor-pointer flex-col items-center   justify-between  gap-y-[10px] font-inter-semibold text-[15px] leading-[20px] text-[#000]"
                                    onClick={() => handleOption(item)}
                                >
                                    <YumiIcon
                                        name={`profile-${item.key.toLowerCase()}`}
                                        size={44}
                                        color="black"
                                    />
                                    <span className="font-inter-semibold text-[15px] tracking-wide">
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="relative mt-[40px] flex w-full flex-1 flex-col items-center justify-between ">
                    <div className="flex w-full items-center justify-between">
                        <div className="font-inter-semibold text-[18px] text-stress">My Wallet</div>
                        <Link
                            className="flex cursor-pointer justify-between"
                            to={'/kyc/introduction'}
                            onClick={toggleIsUserSidebarIdOpen}
                        >
                            <div className="flex h-full items-center justify-between ">
                                <img
                                    src="/img/profile/kyc-link.svg"
                                    className="h-[14px] w-[14px]"
                                    alt=""
                                />
                                <div className="ml-[5px] font-inter-semibold text-[16px] leading-none text-yumi">
                                    Identification
                                </div>
                                <img
                                    src="/img/profile/arrow-purple.svg"
                                    className="ml-[4px] mt-auto h-[14px] w-[14px]"
                                    alt=""
                                />
                            </div>
                        </Link>
                    </div>

                    <div className="relative mt-[22px] flex w-full flex-1 flex-col justify-start rounded-[8px] border border-[#EAEAEA] p-[20px]">
                        <DepositModal
                            open={depositOpen}
                            setOpen={setDepositOpen}
                            principal={identityProfile?.principal}
                            account={identityProfile?.account}
                            symbol={symbol}
                        />

                        <div className="flex h-fit w-full cursor-pointer items-end gap-x-[40px] border-b border-[#EFEFEF] pb-[20px]">
                            <div
                                className="relative flex items-center gap-x-[14px]"
                                onClick={() => {
                                    if (symbol === 'ICP') {
                                        return;
                                    }
                                    !transferring && setSymbol('ICP');
                                    // 关闭时清空form
                                    form.reset(undefined, { keepDefaultValues: true });
                                    form.setValue('amount', '');
                                    form.setValue('principal', '');
                                }}
                            >
                                <IconLogoLedgerIcp className="h-[22px] w-[22px]" />
                                <div className="font-inter-semibold text-[16px] leading-[18px] text-stress">
                                    ICP
                                </div>
                                {symbol === 'ICP' && (
                                    <div className="absolute -bottom-[20px] left-0 right-0 h-[4px] rounded-[2px] bg-[#3C2396]"></div>
                                )}
                            </div>
                            <div
                                className="relative flex items-center gap-x-[14px]"
                                onClick={() => {
                                    if (symbol === 'OGY') {
                                        return;
                                    }
                                    !transferring && setSymbol('OGY');
                                    // 关闭时清空form
                                    form.reset(undefined, { keepDefaultValues: true });
                                    form.setValue('amount', '');
                                    form.setValue('principal', '');
                                }}
                            >
                                <IconLogoLedgerOgy className="h-[18px] w-[18px]" />
                                <div className="font-inter-semibold text-[16px] leading-[18px] text-stress">
                                    OGY
                                </div>
                                {symbol === 'OGY' && (
                                    <div className="absolute -bottom-[20px] left-0 right-0 h-[4px] rounded-[2px] bg-[#3C2396]"></div>
                                )}
                            </div>
                        </div>
                        <div className="flex w-full flex-col gap-y-[15px]">
                            <div className="mt-[15px] flex justify-between">
                                <Button
                                    onClick={() => {
                                        setDepositOpen(true);
                                    }}
                                    className="h-fit rounded-[6px] border border-[#666] px-[8px] py-[7px] font-inter-semibold text-[14px] leading-[14px] "
                                >
                                    Deposit
                                </Button>

                                <div className="flex items-center gap-x-[10px] font-inter-semibold text-[12px] leading-tight text-[#666666] ">
                                    <div>Balance:</div>
                                    <div className="flex items-end space-x-1 font-inter-bold text-[22px]">
                                        {e8s ? (
                                            <TokenPrice
                                                className="font-inter-bold text-[14px] leading-tight text-black md:text-[14px]"
                                                value={{
                                                    value: e8s,
                                                    decimals: { type: 'exponent', value: decimals },
                                                    scale: 4,
                                                    paddingEnd: 4,
                                                    thousand: {
                                                        comma: true,
                                                        commaFunc: thousandCommaOnlyInteger,
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <SkeletonTW className="!h-[16px] !w-[70px]" />
                                        )}

                                        <span className="font-inter-bold text-[14px]">
                                            {symbol}
                                        </span>
                                    </div>
                                    <YumiIcon
                                        name="action-refresh"
                                        color="#8D8D8D"
                                        className={cn(
                                            'cursor-pointer',
                                            balanceLoading && 'animate-spin',
                                        )}
                                        onClick={reloadBalance}
                                    />
                                </div>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                                    <FormField
                                        control={form.control}
                                        name="principal"
                                        render={({ field }) => (
                                            <FormItem>
                                                <span className="flex items-center justify-between">
                                                    <FormControl className="">
                                                        <Input
                                                            className=" h-[42px] rounded-[8px] border-[#DCDCDC] px-[11px] py-[4px] font-inter-medium text-[14px] placeholder:text-[#DCDCDC]  focus-visible:ring-white "
                                                            placeholder={
                                                                'Principal ID or Account ID'
                                                            }
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </span>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <span className="mt-[20px] flex h-[42px] items-center justify-between">
                                                    <FormControl className="w-full">
                                                        <Input
                                                            placeholder="Amount"
                                                            className="rounded-[8px] rounded-r-none border-r-0 border-[#DCDCDC] px-[11px] py-[4px] font-inter-medium text-[14px] placeholder:text-[#DCDCDC]  focus-visible:ring-white "
                                                            {...field}
                                                            defaultValue={''}
                                                        />
                                                    </FormControl>
                                                    <div className="flex h-[40px] items-center rounded-[8px] rounded-l-none border border-l-0 border-[#DCDCDC] font-inter-medium text-[14px]">
                                                        <div className="px-[8px] text-symbol">
                                                            {symbol}
                                                        </div>
                                                        <div className="h-full w-[1px] bg-[#DCDCDC]"></div>
                                                        <div
                                                            className="cursor-pointer px-[8px] text-[#6440E4]"
                                                            onClick={setMax}
                                                        >
                                                            Max
                                                        </div>
                                                    </div>
                                                </span>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className={cn(
                                            'mt-[20px] flex w-full items-center justify-center rounded-[8px] bg-black py-[13px] font-inter-bold text-[14px] font-bold text-white',
                                            transferring &&
                                                'cursor-not-allowed opacity-40 hover:bg-black',
                                        )}
                                    >
                                        Transfer
                                        {!!transferring && (
                                            <LoadingOutlined className="ml-[10px]"></LoadingOutlined>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                            <div className="relative flex">
                                <Button
                                    onClick={() => {
                                        toggleAddFundsOpen();
                                    }}
                                    className="flex w-full items-center justify-center rounded-[8px] bg-black py-[13px] font-inter-bold text-[14px] text-white"
                                >
                                    {isAddFunds ? 'Add Funds' : 'Sell'}
                                </Button>
                                <div
                                    onClick={() => {
                                        setIsAddFunds((prev) => !prev);
                                    }}
                                    className={cn(
                                        'absolute right-0 top-0 flex h-full w-[40px] cursor-pointer rounded-r-[8px] border-l border-[#FFFFFF99]   hover:bg-[#333]',
                                        !isAddFunds &&
                                            'left-0 rounded-none rounded-l-[8px] border-r',
                                    )}
                                >
                                    <img
                                        src="/img/sidebar/add-funds-icon.svg"
                                        className="m-auto h-[20px] w-[20px]"
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center gap-x-[25.5px]">
                                <img src="/img/sidebar/pay-mastercard.svg" alt="" />
                                <img src="/img/sidebar/pay-visa.svg" alt="" />
                                <img src="/img/sidebar/pay-apple.svg" alt="" />
                                <img src="/img/sidebar/pay-google.svg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SideBarWrapper>
    );
}

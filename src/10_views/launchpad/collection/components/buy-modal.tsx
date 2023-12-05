import { useState } from 'react';
import { Link } from 'react-router-dom';
import { message, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import shallow from 'zustand/shallow';
import { NftIdentifier } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { exponentNumber } from '@/02_common/data/numbers';
import { uniqueKey } from '@/02_common/nft/identifier';
import { bigint2string, string2bigint } from '@/02_common/types/bigint';
import { useAppStore } from '@/07_stores/app';
import { useIdentityStore } from '@/07_stores/identity';
import { useCheckKyc } from '@/08_hooks/common/kyc';
import { MarkAction } from '@/08_hooks/exchange/steps';
import { BuyLaunchpadNftExecutor, LaunchpadBuyAction } from '@/08_hooks/views/launchpad';
import TokenPrice from '@/09_components/data/price';
import Usd from '@/09_components/data/usd';
import { IconLaunchpadFailed, IconLogoLedgerIcp } from '@/09_components/icons';
import { get_usd_with_fee } from '@/09_components/layout/components/user-sidebar/funds';
import { ActionStepsModal } from '@/09_components/modal/action-steps';
import {
    AddFundsModal,
    BuyWithFiatModal,
    MAX_FIAT_AMOUNT,
    MIN_FIAT_AMOUNT,
} from '@/09_components/nft-card/components/buy';
import NftName from '@/09_components/nft/name';
import NftThumbnail from '@/09_components/nft/thumbnail';
import { Button } from '@/09_components/ui/button';
import CloseIcon from '@/09_components/ui/close-icon';
import BalanceInsufficient from '@/09_components/user/balance/balance-insufficient';
import BalanceRefresh from '@/09_components/user/balance/balance-refresh';
import {
    getLedgerIcpDecimals,
    getLedgerIcpFee,
} from '../../../../05_utils/canisters/ledgers/special';

type LaunchpadBuyModalInfo = {
    amount: number;
    price: string;
    featured: string;
    name: string;
};

export const LaunchpadResult = ({
    success_list,
    total_buy,
    onClose,
}: {
    success_list: NftIdentifier[];
    total_buy: number;
    onClose: () => void;
}) => {
    return (
        <Modal
            zIndex={10001}
            open={true}
            closeIcon={null}
            footer={null}
            onCancel={onClose}
            centered={true}
            className=""
        >
            <div className="relative flex min-h-[400px] flex-col items-center justify-center">
                <CloseIcon className="absolute right-0 top-0" onClick={onClose}></CloseIcon>
                <div className={cn('flex h-full flex-col justify-between')}>
                    {(!success_list || (success_list && success_list.length === 0)) && (
                        <div className="flex min-h-[400px] flex-col justify-between">
                            <span className="mb-[20px] font-inter-bold text-[20px] text-black">
                                Purchase Failed
                            </span>
                            <div className="flex flex-col items-center">
                                <IconLaunchpadFailed className="h-[142.3px] w-[179px]" />
                                <p className="mt-[30px] font-inter text-[14px] leading-[20px] ">
                                    Sorry, your purchase has failed. The paid funds have been
                                    returned to your account, please check and try the purchase
                                    again!
                                </p>

                                <div className="mt-[15px] flex justify-center">
                                    <Link to={'/profile'}>
                                        <Button className="!hover:text-white h-[48px] w-[160px] cursor-pointer rounded-[8px] bg-[#060606] text-center text-[16px] leading-[48px] text-[#fff]">
                                            View NFT
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                    {success_list && success_list.length !== 0 && (
                        <>
                            <div className="">
                                <div className="m-auto mb-[8px] flex h-[65px] w-[65px] items-center justify-center rounded-[50%] border border-solid border-black bg-white">
                                    <img
                                        className="h-[44px] w-[44px]"
                                        src={cdn(
                                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1692432873065_Frame.svg',
                                        )}
                                        alt=""
                                    />
                                </div>
                                <div className="mb-[19px] text-center font-inter-bold text-[14px] text-black md:mb-[25px]">
                                    Purchase successfully!
                                </div>
                            </div>
                            <div className="grid w-full grid-cols-3 flex-wrap items-center gap-x-[24px]  gap-y-[20px] md:grid-cols-5">
                                {success_list &&
                                    success_list.map((item, index) => (
                                        <div
                                            key={uniqueKey(item) + index}
                                            className="flex h-full w-full cursor-pointer flex-col justify-between"
                                        >
                                            <NftThumbnail
                                                token_id={item}
                                                cdn_width={100}
                                                width="w-full"
                                            />
                                            <div className="mt-[9px] h-[14px] text-center text-[12px] leading-[14px]">
                                                <NftName token_id={item}></NftName>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="font-inter-normal mt-[30px] w-full text-left  text-[14px] text-black">
                                You claimed {total_buy} NFTS and the result is:
                                <span className="text-[#7355FF]">
                                    {success_list?.length} successes,{' '}
                                    {success_list && total_buy - success_list.length} failures
                                </span>
                            </div>
                            <div className="font-inter-normal m-auto hidden  text-left text-[14px] text-black">
                                In the failed claim, the paid funds have been returned to your
                                account, please check and try the purchase again!
                            </div>
                            <div className="font-inter-normal m-auto  text-left text-[14px] text-black">
                                Sorry for the inconvenience, you will get your refund in your
                                account for failed order, please check and try to purchase again!
                            </div>
                            <div className="mt-[30px]">
                                <div className="font-inter-normal mb-[19px] text-center text-[12px] text-black md:mb-[15px]">
                                    Check your NFT in the profile page
                                </div>
                                <Link to="/profile" onClick={onClose}>
                                    <Button className="m-auto block !h-[40px] !w-[134px] rounded-[8px] bg-[#060606] text-center font-inter-bold text-[16px] text-white md:!h-[48px] md:!w-[160px]">
                                        View
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

const actions: MarkAction<LaunchpadBuyAction>[] = [
    {
        title: 'Check order status and check wallet balance',
        actions: ['DOING', 'CHECKING_KYC', 'CHECKING_PURCHASE', 'CHECKING_BALANCE'],
    },
    { title: 'Calling Ledger to validate transactions', actions: ['PAY'] },
    { title: 'Transferring item', actions: ['CLAIMING'] },
];
export const LaunchpadBuyModal = ({
    onClose,
    info,
    buy,
    action,
    update,
}: {
    onClose: () => void;
    info: LaunchpadBuyModalInfo;
    buy: BuyLaunchpadNftExecutor;
    update: Function;
    action: LaunchpadBuyAction;
}) => {
    const { amount, price, featured, name } = info;

    const [tokenIdList, setTokenIdList] = useState<NftIdentifier[]>([]);

    const setBuyingNft = useIdentityStore((s) => s.setBuyingNft);
    const { e8sIcp, identity } = useIdentityStore(
        (s) => ({
            e8sIcp: s.icpBalance?.e8s,
            identity: s.connectedIdentity,
        }),
        shallow,
    );
    const checkKyc = useCheckKyc();
    const e8s = e8sIcp || '0';

    const needed = BigInt(amount) * BigInt(price) + BigInt(getLedgerIcpFee());
    const [addFundsOpen, setAddFundsOpen] = useState<boolean>(false);
    const [buyWithFiatOpen, setBuyWithFiatOpen] = useState<boolean>();
    const [resultOpen, setResultOpen] = useState<boolean>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const onConfirm = async () => {
        setBuyingNft(true);
        try {
            const passed = await checkKyc({ requirement: false });
            if (!passed) {
                onClose();
                return;
            }
        } catch (e) {
            console.error(`🚀 ~ file: index.tsx:281 ~ onConfirm ~ e:`, e);
            return;
        }
        // 防止重复点击
        if (!action) {
            setConfirmLoading(true);
            buy(amount)
                .then((token_id_list) => {
                    if (token_id_list !== undefined) {
                        setTokenIdList(token_id_list);
                        update();
                        setResultOpen(true);
                    }
                })
                .catch((e) => message.error(`buy failed ${e}`))
                .finally(() => setConfirmLoading(false));
        }
    };

    // icp 价格
    const icp_usd = useAppStore((s) => s.icp_usd);
    // 还需补充多少币
    const lack =
        needed - string2bigint(e8s) > string2bigint('0')
            ? needed - string2bigint(e8s)
            : string2bigint('0');

    // 对应的传入usd数
    const lack_with_alchemy_fee = get_usd_with_fee(
        Number(exponentNumber(bigint2string(lack), -getLedgerIcpDecimals())) * Number(icp_usd),
    );
    const price_needed_with_alchemy_fee = get_usd_with_fee(
        Number(exponentNumber(bigint2string(needed), -getLedgerIcpDecimals())) * Number(icp_usd),
    );
    // icp差值是否符合最低购买额
    const larger_than_min = lack_with_alchemy_fee > MIN_FIAT_AMOUNT || lack_with_alchemy_fee === 0;
    // icp总价是否符合最低购买额
    const price_larger_than_min = price_needed_with_alchemy_fee > MIN_FIAT_AMOUNT;

    const price_less_than_max = price_needed_with_alchemy_fee < MAX_FIAT_AMOUNT;

    // 余额是否充足
    const balance_enough = string2bigint(e8s) >= needed;

    const onBuyWithFiat = async () => {
        setBuyingNft(true);
        try {
            const passed = await checkKyc({ requirement: false });
            if (passed) {
                setBuyWithFiatOpen(true);
            }
        } catch (e) {
            console.debug('🚀 ~ file: buy-modal.tsx:261 ~ onBuyWithFiat ~ e:', e);
            return;
        }
    };
    return (
        <>
            <AddFundsModal
                open={addFundsOpen}
                show_or={larger_than_min}
                onClose={() => {
                    setAddFundsOpen(false);
                }}
                args={{
                    principal: identity?.principal,
                    symbol: 'ICP',
                    need_amount: bigint2string(lack),
                }}
            ></AddFundsModal>
            {buyWithFiatOpen && (
                <BuyWithFiatModal
                    onClose={() => {
                        setBuyWithFiatOpen(false);
                    }}
                    onBuy={onConfirm}
                    needed={needed}
                    confirmLoading={confirmLoading}
                />
            )}
            {action && (
                <ActionStepsModal<LaunchpadBuyAction>
                    title={''}
                    actions={actions}
                    action={action}
                ></ActionStepsModal>
            )}
            {resultOpen && (
                <LaunchpadResult
                    success_list={tokenIdList}
                    total_buy={amount}
                    onClose={() => {
                        setResultOpen(false);
                    }}
                ></LaunchpadResult>
            )}
            <Modal
                open={true}
                footer={null}
                closeIcon={null}
                onCancel={onClose}
                width={550}
                centered={true}
                className="buy-modal"
            >
                <div className="mb-[30px] flex w-full items-center justify-between p-[20px] pb-0 md:p-[30px] md:pb-0">
                    <div className="font-inter-bold text-[20px] leading-none text-title">
                        Checkout
                    </div>
                    <CloseIcon className="w-[14px]" onClick={onClose} />
                </div>
                {/* pc端 ui */}
                <div className="hidden w-full flex-col gap-x-[24px] md:flex">
                    <div className="px-[30px]">
                        <div className="flex justify-between">
                            <div className="flex flex-1 flex-col justify-between">
                                <div className="mb-[10px] font-inter-medium text-[14px] text-name">
                                    {name}
                                </div>
                                <div className="mb-auto font-inter-medium text-[14px] leading-none">
                                    Amount:&nbsp;{amount}
                                </div>
                                <div className="flex items-center leading-none">
                                    {<IconLogoLedgerIcp className="mr-[7px] w-[18px]" />}
                                    <TokenPrice
                                        value={{
                                            value: price,
                                            decimals: { type: 'exponent', value: 8 },
                                            scale: 2,
                                        }}
                                        className="mr-[10px] font-inter-bold text-[26px] text-black"
                                    />
                                    <Usd
                                        value={{
                                            value: price,
                                            decimals: {
                                                type: 'exponent',
                                                value: getLedgerIcpDecimals(),
                                            },
                                            symbol: 'ICP',
                                            scale: 2,
                                        }}
                                        className="font-inter-medium text-[16px] text-black/40"
                                    />
                                </div>
                            </div>
                            <img
                                className="mr-[24px] block h-[90px] w-[90px] rounded-[8px]"
                                src={cdn(featured)}
                            />
                        </div>

                        <div className="mt-[30px] flex justify-between">
                            <span className=" font-inter-semibold text-[20px] text-title ">
                                Total
                            </span>

                            <div className="flex items-center leading-none">
                                {<IconLogoLedgerIcp className="mr-[7px] w-[18px]" />}
                                <TokenPrice
                                    value={{
                                        value: (BigInt(amount) * BigInt(price)).toString(),
                                        decimals: { type: 'exponent', value: 8 },
                                        scale: 2,
                                    }}
                                    className="mr-[10px] font-inter-bold text-[26px] text-black"
                                />
                                <Usd
                                    value={{
                                        value: `${Number(price) * Number(amount)}`,
                                        decimals: {
                                            type: 'exponent',
                                            value: getLedgerIcpDecimals(),
                                        },
                                        symbol: 'ICP',
                                        scale: 2,
                                    }}
                                    className="font-inter-medium text-[16px] text-black/40"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-[15px] flex cursor-pointer justify-between border-t border-common p-[30px]">
                        <div className="my-auto flex h-full flex-col justify-between gap-y-[5px]">
                            <div className="font-inter-semibold text-[14px]">
                                <span
                                    onClick={() => setAddFundsOpen(true)}
                                    className={cn('text-yumi hover:opacity-80')}
                                >
                                    Add Funds
                                </span>

                                {price_larger_than_min && price_less_than_max && (
                                    <>
                                        &nbsp;/&nbsp;
                                        <span onClick={onBuyWithFiat} className="hover:opacity-60">
                                            Pay with fiat
                                        </span>
                                    </>
                                )}
                            </div>

                            <BalanceRefresh symbol={'ICP'} />
                        </div>
                        <div className="flex items-center gap-x-[27px]">
                            {' '}
                            <Button
                                onClick={onClose}
                                variant={'outline'}
                                className="h-[36px] w-[86px] flex-shrink-0 rounded-[8px] border border-solid border-black/60 bg-white text-center font-inter-bold text-[16px] leading-[36px]  text-black"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={onConfirm}
                                disabled={!balance_enough}
                                className={cn(
                                    'h-[36px] flex-shrink-0 rounded-[8px] bg-black text-center font-inter-bold text-[16px] leading-[36px] text-white',
                                )}
                            >
                                Confirm {confirmLoading && <LoadingOutlined className="ml-2" />}
                            </Button>
                        </div>
                    </div>
                    <BalanceInsufficient
                        balance={e8s}
                        need={bigint2string(needed)}
                        setAddFundsOpen={setAddFundsOpen}
                    />
                </div>
                <div className="flex w-full flex-col gap-x-[24px] md:hidden">
                    <div className="px-[20px]">
                        <div className="flex justify-between">
                            <div className="flex flex-1 flex-col justify-between">
                                <div className="mb-[5px] font-inter-medium text-[14px] text-name">
                                    {name}
                                </div>
                                <div className="mb-auto font-inter-medium text-[14px] leading-none">
                                    Amount:&nbsp;{amount}
                                </div>
                                <div className="flex items-center leading-none">
                                    {<IconLogoLedgerIcp className="mr-[7px] w-[18px]" />}
                                    <TokenPrice
                                        value={{
                                            value: (BigInt(amount) * BigInt(price)).toString(),
                                            decimals: { type: 'exponent', value: 8 },
                                            scale: 2,
                                        }}
                                        className="mr-[10px] font-inter-bold text-[26px] text-black"
                                    />
                                    <Usd
                                        value={{
                                            value: `${Number(price) * Number(amount)}`,
                                            decimals: {
                                                type: 'exponent',
                                                value: getLedgerIcpDecimals(),
                                            },
                                            symbol: 'ICP',
                                            scale: 2,
                                        }}
                                        className="font-inter-medium text-[16px] text-black/40"
                                    />
                                </div>
                            </div>
                            <img
                                className="mr-[24px] block h-[90px] w-[90px] rounded-[8px]"
                                src={cdn(featured)}
                            />
                        </div>

                        <div className="mt-[30px] flex justify-between">
                            <span className=" font-inter-semibold text-[20px] text-title ">
                                Total
                            </span>

                            <div className="flex items-center leading-none">
                                {<IconLogoLedgerIcp className="mr-[7px] w-[18px]" />}
                                <TokenPrice
                                    value={{
                                        value: (BigInt(amount) * BigInt(price)).toString(),
                                        decimals: { type: 'exponent', value: 8 },
                                        scale: 2,
                                    }}
                                    className="mr-[10px] font-inter-bold text-[26px] text-black"
                                />
                                <Usd
                                    value={{
                                        value: `${Number(price) * Number(amount)}`,
                                        decimals: {
                                            type: 'exponent',
                                            value: getLedgerIcpDecimals(),
                                        },
                                        symbol: 'ICP',
                                        scale: 2,
                                    }}
                                    className="font-inter-medium text-[16px] text-black/40"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-[15px] border-t border-common p-[20px]">
                        <BalanceRefresh symbol={'ICP'} />
                        <div className=" flex cursor-pointer justify-between">
                            <div className="my-auto flex h-full flex-col justify-between gap-y-[5px]">
                                <div className="font-inter-semibold text-[14px]">
                                    <span
                                        onClick={() => setAddFundsOpen(true)}
                                        className={cn('text-yumi hover:opacity-80')}
                                    >
                                        Add Funds
                                    </span>

                                    {price_larger_than_min && price_less_than_max && (
                                        <>
                                            &nbsp;/&nbsp;
                                            <span
                                                onClick={onBuyWithFiat}
                                                className="hover:opacity-60"
                                            >
                                                Pay with fiat
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-[15px] flex items-center justify-between gap-x-[27px]">
                            {' '}
                            <Button
                                onClick={onClose}
                                variant={'outline'}
                                className="h-[36px] w-[86px] flex-shrink-0 rounded-[8px] border border-solid border-black/60 bg-white text-center font-inter-bold text-[16px] leading-[36px]  text-black"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={onConfirm}
                                // disabled={string2bigint(e8s) < needed}
                                className={cn(
                                    'h-[36px] flex-shrink-0 rounded-[8px] bg-black text-center font-inter-bold text-[16px] leading-[36px] text-white',
                                    false && '!cursor-not-allowed',
                                )}
                            >
                                Confirm {confirmLoading && <LoadingOutlined className="ml-2" />}
                            </Button>
                        </div>
                    </div>
                    <BalanceInsufficient
                        balance={e8s}
                        need={bigint2string(needed)}
                        setAddFundsOpen={setAddFundsOpen}
                    />
                </div>
            </Modal>
        </>
    );
};

import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Drawer, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { shallow } from 'zustand/shallow';
import { NftListingListing } from '@/01_types/listing';
import { NftIdentifier, NftMetadata } from '@/01_types/nft';
import { ShoppingCartItem } from '@/01_types/yumi';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { exponentNumber } from '@/02_common/data/numbers';
import { uniqueKey } from '@/02_common/nft/identifier';
import { getYumiOgyBroker } from '@/02_common/nft/ogy';
import { justPreventLink } from '@/02_common/react/link';
import { bigint2string, string2bigint } from '@/02_common/types/bigint';
import { unwrapVariantKey } from '@/02_common/types/variant';
import {
    getLedgerIcpDecimals,
    getLedgerIcpFee,
    getLedgerOgyDecimals,
    getTokenDecimals,
} from '@/05_utils/canisters/ledgers/special';
import { getOgyGoldCanisterId } from '@/05_utils/canisters/nft/special';
import { getThumbnailByNftTokenMetadata } from '@/05_utils/nft/metadata';
import { useAppStore } from '@/07_stores/app';
import { useIdentityStore } from '@/07_stores/identity';
import { useCheckKyc } from '@/08_hooks/common/kyc';
import { useBatchBuyNftByTransaction } from '@/08_hooks/exchange/batch/buy';
import { useBatchBuyGoldNftByTransaction } from '@/08_hooks/exchange/batch/buy-gold';
import ShowNumber from '@/09_components/data/number';
import Usd from '@/09_components/data/usd';
import { IconLogoLedgerIcp, IconLogoLedgerOgy } from '@/09_components/icons';
import { autoListGoldShoppingCartItems } from '@/09_components/layout/components/cart';
import { get_usd_with_fee } from '@/09_components/layout/components/user-sidebar/funds';
import {
    AddFundsModal,
    BuyWithFiatModal,
    MAX_FIAT_AMOUNT,
    MIN_FIAT_AMOUNT,
} from '@/09_components/nft-card/components/buy';
import { Input } from '@/09_components/ui/input';
import BalanceInsufficient from '@/09_components/user/balance/balance-insufficient';
import BalanceRefresh from '@/09_components/user/balance/balance-refresh';
import TokenPrice from '../../data/price';
import message from '../../message';
import NftMedia from '../../nft/media';
import NftName from '../../nft/name';
import { Button } from '../../ui/button';
import CloseIcon from '../../ui/close-icon';
import { Slider } from '../../ui/slider';
import { Switch } from '../../ui/switch';
import NftThumbnail from '../thumbnail';
import './index.less';

export const SweepConfirm = ({
    items,
    goldAutoSelling,
    isGold,
    needed,
    onConfirm,
    onClose,
    confirmLoading,
}: {
    items: ShoppingCartItem[];
    goldAutoSelling: boolean; // 是否在自动上架gold
    isGold: boolean;
    needed: { icp: string; ogy: string };
    onConfirm: () => Promise<NftIdentifier[] | void>;
    confirmLoading: boolean;
    onClose: () => void;
}) => {
    const { e8sIcp, e8sOgy, identity } = useIdentityStore(
        (s) => ({
            kycResult: s.kycResult,
            e8sIcp: s.icpBalance?.e8s,
            e8sOgy: s.ogyBalance?.e8s,
            identity: s.connectedIdentity,
        }),
        shallow,
    );

    const [addFundsOpen, setAddFundsOpen] = useState(false);

    const [buyWithFiatOpen, setBuyWithFiatOpen] = useState(false);

    // 购买按钮是否可点击
    const balance_insufficient =
        string2bigint(e8sIcp || '0') < string2bigint(needed.icp) ||
        string2bigint(e8sOgy || '0') < string2bigint(needed.ogy);

    // 是否只需要icp
    const onlyIcp = needed.ogy === '0';

    // modal关闭
    const onModalClose = () => {
        onClose();
    };

    // modal确认
    const onModalConfirm = () => {
        onConfirm().then(() => {
            isGold && onModalClose();
        });

        // 如果不是gold则直接关闭
        !isGold && onModalClose();
    };

    // 还需补充多少币
    const lack =
        string2bigint(needed.icp) - string2bigint(e8sIcp || '0') > string2bigint('0')
            ? string2bigint(needed.icp) - string2bigint(e8sIcp || '0')
            : string2bigint('0');

    // icp 价格
    const icp_usd = useAppStore((s) => s.icp_usd);

    // ramp还有一个network fee
    const ramp_network_fee =
        Number(exponentNumber(getLedgerIcpFee(), -getLedgerIcpDecimals())) * Number(icp_usd);

    // 对应的传入usd数
    const lack_with_alchemy_fee = get_usd_with_fee(
        Number(exponentNumber(bigint2string(lack), -getLedgerIcpDecimals())) * Number(icp_usd) +
            ramp_network_fee,
    );
    const price_needed_with_alchemy_fee = get_usd_with_fee(
        Number(exponentNumber(needed.icp, -getLedgerIcpDecimals())) * Number(icp_usd) +
            ramp_network_fee,
    );
    // icp差值是否符合最低购买额
    const larger_than_min = lack_with_alchemy_fee > MIN_FIAT_AMOUNT || lack_with_alchemy_fee === 0;
    // icp总价是否符合最低购买额
    const price_larger_than_min = price_needed_with_alchemy_fee > MIN_FIAT_AMOUNT;

    const price_less_than_max = price_needed_with_alchemy_fee < MAX_FIAT_AMOUNT;

    const setBuyingNft = useIdentityStore((s) => s.setBuyingNft);
    const checkKyc = useCheckKyc();

    const onBuyWithFiat = async () => {
        setBuyingNft(true);
        try {
            const passed = await checkKyc({ requirement: false });
            if (passed) {
                setBuyWithFiatOpen(true);
            } else {
                onModalClose;
            }
        } catch (e) {
            console.debug('🚀 ~ file: index.tsx:149 ~ onBuyWithFiat ~ e:', e);
            return;
        }
    };
    return (
        <div onClick={justPreventLink}>
            <AddFundsModal
                open={addFundsOpen}
                show_or={larger_than_min}
                onClose={() => {
                    setAddFundsOpen(false);
                }}
                args={{
                    principal: identity?.principal,
                    symbol: 'ICP',
                    need_amount: bigint2string(string2bigint(needed.icp) - BigInt(e8sIcp || '0')),
                }}
            />
            {buyWithFiatOpen && (
                <BuyWithFiatModal
                    onClose={() => {
                        setBuyWithFiatOpen(false);
                    }}
                    onBuy={onConfirm}
                    needed={string2bigint(needed.icp)}
                    confirmLoading={confirmLoading}
                />
            )}
            <Modal
                open={true}
                footer={null}
                closeIcon={null}
                onCancel={onModalClose}
                width={550}
                centered={true}
                className="buy-modal"
            >
                <div className="mb-[25px] flex w-full items-center justify-between p-[20px] pb-0 md:p-[30px] md:pb-0">
                    <div className="font-inter-bold text-[20px] leading-none text-title">Sweep</div>
                    <CloseIcon className="w-[14px]" onClick={onModalClose} />
                </div>
                {/* pc端 ui */}
                <div>
                    <div className="flex justify-between px-[30px] font-inter-semibold text-[14px] text-symbol opacity-60">
                        <span>Item</span>
                        <span>Price</span>
                    </div>
                    <div className="flex h-[258px] overflow-scroll px-[30px] py-[10px]">
                        <div className="flex h-fit w-full  flex-col gap-y-[8px] pb-[10px]">
                            {items
                                .filter((i) => !!i.card)
                                .map((item) => {
                                    const isGoldNft = getOgyGoldCanisterId().includes(
                                        item.token_id.collection,
                                    );
                                    if (!item.card) {
                                        return;
                                    }
                                    return (
                                        <Link
                                            to={
                                                isGoldNft
                                                    ? `/gold/${item.token_id.collection}/${item.card.metadata.metadata.name}`
                                                    : `/market/${item.token_id.collection}/${item.card.metadata.token_id.token_identifier}`
                                            }
                                            className="flex cursor-pointer items-center justify-between"
                                            key={uniqueKey(item.card.metadata.token_id)}
                                        >
                                            <div className="flex items-center gap-x-[10px]">
                                                <NftThumbnail
                                                    token_id={item.token_id}
                                                    cdn_width={100}
                                                    width="w-[34px]"
                                                />

                                                <NftName
                                                    token_id={item.card.metadata.token_id}
                                                    metadata={item.card}
                                                />
                                            </div>
                                            <div>
                                                <TokenPrice
                                                    value={{
                                                        value: (item.listing as NftListingListing)
                                                            .price,
                                                        decimals: {
                                                            type: 'exponent',
                                                            value: getTokenDecimals(),
                                                        },
                                                        scale: (v) => (v < 0.01 ? 4 : 2),
                                                    }}
                                                    className="font-inter-semibold text-[14px] text-title md:text-[14px]"
                                                />
                                                <span className="ml-[3px] font-inter-semibold text-[14px] text-title">
                                                    {(
                                                        item.listing as NftListingListing
                                                    ).token.symbol.toLocaleUpperCase()}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                </div>
                <div className="hidden w-full flex-col gap-x-[24px]  md:flex">
                    <div className="px-[30px]">
                        <div className="mt-[22px] flex items-center justify-between">
                            <span className=" font-inter-semibold text-[20px] text-title ">
                                Total
                            </span>
                            <div className="flex flex-col items-end justify-center gap-y-[10px]">
                                {string2bigint(needed.icp) > 0 && (
                                    <div className="flex items-center leading-none">
                                        <IconLogoLedgerIcp className="mr-[7px] w-[18px]" />
                                        <ShowNumber
                                            className="mr-[5px] font-inter-semibold text-[20px] text-black md:text-[20px]"
                                            value={{
                                                value: exponentNumber(
                                                    needed.icp,
                                                    -getLedgerIcpDecimals(),
                                                ),
                                                scale: 2,
                                                paddingEnd: 2,
                                            }}
                                        />
                                        <Usd
                                            className="font-inter-medium text-[14px] text-symbol"
                                            value={{
                                                value: exponentNumber(
                                                    needed.icp,
                                                    -getLedgerIcpDecimals(),
                                                ),
                                                symbol: 'ICP',
                                                scale: 2,
                                            }}
                                        />
                                    </div>
                                )}
                                {string2bigint(needed.ogy) > 0 && (
                                    <div className="flex items-center font-inter-medium leading-none">
                                        <IconLogoLedgerOgy className="mr-[7px] w-[18px]" />
                                        <ShowNumber
                                            className="mr-[5px] font-inter-semibold text-[20px] text-black md:text-[20px]"
                                            value={{
                                                value: exponentNumber(
                                                    needed.ogy,
                                                    -getLedgerOgyDecimals(),
                                                ),
                                                scale: 2,
                                                paddingEnd: 2,
                                            }}
                                        />
                                        <Usd
                                            className="text-[14px] text-symbol"
                                            value={{
                                                value: exponentNumber(
                                                    needed.ogy,
                                                    -getLedgerOgyDecimals(),
                                                ),
                                                symbol: 'OGY',
                                                scale: 2,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-[15px] flex flex-col border-t border-common  p-[30px]">
                        <BalanceRefresh />
                        <div className="mt-[16px] flex cursor-pointer justify-between ">
                            <div className="my-auto flex h-full items-center justify-between gap-y-[2px]">
                                <span
                                    onClick={() => setAddFundsOpen(true)}
                                    className=" cursor-pointer font-inter-semibold leading-none text-yumi hover:opacity-80"
                                >
                                    Add Funds
                                </span>
                                <div className="font-inter-semibold text-[14px]">
                                    {onlyIcp && price_larger_than_min && price_less_than_max && (
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
                            <div className="flex items-center gap-x-[27px]">
                                <Button
                                    onClick={onModalClose}
                                    variant={'outline'}
                                    className="h-[36px] w-[86px] flex-shrink-0 rounded-[8px] border border-solid border-black/60 bg-white text-center font-inter-bold text-[16px] leading-[36px]  text-black"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onModalConfirm}
                                    disabled={balance_insufficient}
                                    className={cn(
                                        'h-[36px] flex-shrink-0 rounded-[8px] bg-black text-center font-inter-bold text-[16px] leading-[36px] text-white',
                                        balance_insufficient && '!cursor-not-allowed',
                                    )}
                                >
                                    Confirm
                                    {isGold && goldAutoSelling && (
                                        <LoadingOutlined className="ml-[10px]"></LoadingOutlined>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                    {balance_insufficient && (
                        <BalanceInsufficient
                            balance={'0'} // TODO:优化
                            need={'1'}
                            setAddFundsOpen={setAddFundsOpen}
                        />
                    )}
                </div>
                {/* 手机端ui */}
                <div className="flex w-full flex-col gap-x-[24px]  md:hidden">
                    <div className="px-[30px]">
                        <div className="mt-[22px] flex items-center justify-between">
                            <span className=" font-inter-semibold text-[20px] text-title ">
                                Total
                            </span>
                            <div className="flex flex-col items-end justify-center gap-y-[10px]">
                                {string2bigint(needed.icp) > 0 && (
                                    <div className="flex items-center leading-none">
                                        <IconLogoLedgerIcp className="mr-[7px] w-[18px]" />
                                        <ShowNumber
                                            className="mr-[5px] font-inter-semibold text-[20px] text-black md:text-[20px]"
                                            value={{
                                                value: exponentNumber(
                                                    needed.icp,
                                                    -getLedgerIcpDecimals(),
                                                ),
                                                scale: 2,
                                                paddingEnd: 2,
                                            }}
                                        />
                                        <Usd
                                            className="font-inter-medium text-[14px] text-symbol"
                                            value={{
                                                value: exponentNumber(
                                                    needed.icp,
                                                    -getLedgerIcpDecimals(),
                                                ),
                                                symbol: 'ICP',
                                                scale: 2,
                                            }}
                                        />
                                    </div>
                                )}
                                {string2bigint(needed.ogy) > 0 && (
                                    <div className="flex items-center font-inter-medium leading-none">
                                        <IconLogoLedgerOgy className="mr-[7px] w-[18px]" />
                                        <ShowNumber
                                            className="mr-[5px] font-inter-semibold text-[20px] text-black md:text-[20px]"
                                            value={{
                                                value: exponentNumber(
                                                    needed.ogy,
                                                    -getLedgerOgyDecimals(),
                                                ),
                                                scale: 2,
                                                paddingEnd: 2,
                                            }}
                                        />
                                        <Usd
                                            className="text-[14px] text-symbol"
                                            value={{
                                                value: exponentNumber(
                                                    needed.ogy,
                                                    -getLedgerOgyDecimals(),
                                                ),
                                                symbol: 'OGY',
                                                scale: 2,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-[15px] flex flex-col border-t border-common  p-[30px]">
                        <div className="my-auto  mb-[16px] flex h-full items-center justify-start gap-y-[2px]">
                            <span
                                onClick={() => setAddFundsOpen(true)}
                                className=" cursor-pointer font-inter-semibold leading-none text-yumi hover:opacity-80"
                            >
                                Add Funds
                            </span>
                            <div className="font-inter-semibold text-[14px]">
                                <div className="font-inter-semibold text-[14px]">
                                    {onlyIcp && price_larger_than_min && price_less_than_max && (
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

                        <BalanceRefresh />
                        <div className="mt-[16px] flex cursor-pointer flex-col justify-between ">
                            <div className="flex w-full items-center justify-between gap-x-[27px]">
                                <Button
                                    onClick={onModalClose}
                                    variant={'outline'}
                                    className="h-[36px] w-[86px] flex-shrink-0 rounded-[8px] border border-solid border-black/60 bg-white text-center font-inter-bold text-[16px] leading-[36px]  text-black"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onModalConfirm}
                                    disabled={balance_insufficient}
                                    className={cn(
                                        'h-[36px] flex-shrink-0 rounded-[8px] bg-black text-center font-inter-bold text-[16px] leading-[36px] text-white',
                                        balance_insufficient && '!cursor-not-allowed',
                                    )}
                                >
                                    Confirm
                                    {isGold && goldAutoSelling && (
                                        <LoadingOutlined className="ml-[10px]"></LoadingOutlined>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                    {balance_insufficient && (
                        <BalanceInsufficient
                            balance={'0'} // TODO:优化
                            need={'1'}
                            setAddFundsOpen={setAddFundsOpen}
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
};
// 最大sweep数量
const MAX_SWEEP = 50;

export default function Sweep({
    list,
    refresh,
    update,
}: {
    list: NftMetadata[] | undefined;
    isGold?: boolean;
    update?: () => void; //上级的数据优势不自动更新
    refresh: (() => Promise<void>) | (() => void);
}) {
    const { collection } = useParams();
    const {
        sweepMode,
        sweepItems,
        sweepGoldItems,
        identity,
        toggleSweepMode,
        setSweepItems,
        setBuyingNft,
    } = useIdentityStore(
        (s) => ({
            sweepMode: s.sweepMode,
            toggleSweepMode: s.toggleSweepMode,
            sweepGold: s.sweepGold,
            sweepItems: s.sweepItems,
            setSweepGold: s.setSweepGold,
            setSweepItems: s.setSweepItems,
            sweepGoldItems: s.sweepGoldItems,
            identity: s.connectedIdentity,
            setBuyingNft: s.setBuyingNft,
        }),
        shallow,
    );
    // !TODO skeleton
    const { pathname } = useLocation();
    // 是否是gold
    const isGold = ['/gold/market', '/gold'].includes(pathname);

    // view list是否打开
    const [viewOpen, setViewOpen] = useState<boolean>(false);

    // gold 或 market list
    const items = isGold ? sweepGoldItems : sweepItems[collection!] ?? [];

    // kyc
    const checkKyc = useCheckKyc();
    //总价
    const totalPrice = items.reduce(
        (sum, item) =>
            bigint2string(BigInt(sum) + string2bigint((item.listing as NftListingListing).price)),
        '0',
    );
    // 确认页面
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const total_icp = items
        .filter((t) => t.listing?.type === 'listing')
        .map((t) => ({
            symbol: (t.listing as NftListingListing).token.symbol,
            decimals: (t.listing as NftListingListing).token.decimals,
            fee: (t.listing as NftListingListing).token.fee,
            price: (t.listing as NftListingListing).price,
        }))
        .filter((t) => t.symbol === 'ICP')
        .filter((t) => t.price)
        .map((t) => BigInt(t.price ?? '0') + BigInt(t.fee ?? '0'))
        .reduce((a, b) => a + b, BigInt(0));
    const total_ogy = items
        .filter((t) => t.listing?.type === 'listing')
        .map((t) => ({
            symbol: (t.listing as NftListingListing).token.symbol,
            decimals: (t.listing as NftListingListing).token.decimals,
            fee: (t.listing as NftListingListing).token.fee,
            price: (t.listing as NftListingListing).price,
        }))
        .filter((t) => t.symbol === 'OGY')
        .filter((t) => t.price)
        .map((t) => BigInt(t.price ?? '0') + BigInt(t.fee ?? '0'))
        .reduce((a, b) => a + b, BigInt(0));

    const { batchBuy, action } = useBatchBuyNftByTransaction();
    const { batchBuyGold } = useBatchBuyGoldNftByTransaction();

    // const afterBought = (
    //     nft_list: ShoppingCartItem[],
    //     success_id_list: NftIdentifier[] | undefined,
    // ) => {
    //     if (success_id_list) {
    //         setSuccessList(success_id_list);
    //         const success = items.filter((id) =>
    //             success_id_list
    //                 .map((token_id) => token_id.token_identifier)
    //                 .includes(id.token_id.token_identifier),
    //         );
    //         message.success(`Bought successful (${success.length}/${nft_list.length}).`);
    //         refresh(); //刷新
    //         setSweepItems([], collection, isGold);
    //     }
    // };

    // 黄金批量购买
    const onConfirmGold = async () => {
        const nft_list = items.filter(
            (t) =>
                t.card !== undefined &&
                t.card.owner.raw.standard === 'ogy' &&
                t.listing?.type === 'listing',
        );
        if (items.length === 0) {
            message.error('add nft please');
            return;
        }
        batchBuyGold(
            nft_list.map((item) => ({
                owner: item.card!.owner,
                listing: item.listing!,
                raw: (() => {
                    if (item.card?.owner.raw.standard !== 'ogy') {
                        throw new Error(`card must be ogy`);
                    }
                    // ! 要求当前所有者一定是 principal
                    const account = item.card?.owner.raw.data.account;
                    const key = unwrapVariantKey(account);
                    if (key !== 'principal') {
                        throw new Error(`the owner of nft must be principal`);
                    }
                    const principal = account[key] as string;
                    if (item.listing?.type !== 'listing' || item.listing?.raw.type !== 'ogy') {
                        throw new Error(`wrong listing data`);
                    }
                    return {
                        standard: 'ogy',
                        sale_id: item.listing?.raw.sale_id,
                        broker_id: getYumiOgyBroker(),
                        seller: principal,
                    };
                })(),
            })),
        );
        // .then((success_id_list) => afterBought(nft_list, success_id_list))
        // .catch(() => setCartResultModalOpen(false));
    };
    const [resetSlider, setResetSlider] = useState<number>(0);

    const onBuyNow = async () => {
        setBuyingNft(true);
        try {
            const passed = await checkKyc({ requirement: false });
            if (passed) {
                setConfirmOpen(true);
            }
        } catch (e) {
            console.debug(`🚀 ~ file: index.tsx:281 ~ onConfirm ~ e:`, e);
            return;
        }
    };
    // 是否在黄金自动挂单
    const [goldAutoSelling, setGoldAutoSelling] = useState<boolean>(false);

    // 传递给confirm页
    const onConfirm = async (): Promise<NftIdentifier[] | void> => {
        if (isGold) {
            setGoldAutoSelling(true);
            // 包装是否要上架
            return autoListGoldShoppingCartItems(items)
                .then(() => {
                    onConfirmGold();
                })
                .finally(() => setGoldAutoSelling(false));
        }

        const nft_list = items.filter((t) => t.card !== undefined && t.listing?.type === 'listing');
        if (nft_list.length === 0) {
            throw new Error('add nft please');
        }
        return (
            batchBuy(
                nft_list.map((item) => ({
                    owner: item.card!.owner,
                    listing: item.listing!,
                })),
            )
                // .then((success_id_list) => afterBought(nft_list, success_id_list))
                .finally(() => {
                    setSweepItems([], collection!, isGold);
                    setResetSlider((prev) => prev + 1);
                })
        );
    };
    // 至多sweep数量
    const max_sweep = Math.min(list?.length || 0, MAX_SWEEP);

    // 切换页面时需要更新slider的值
    useEffect(() => {
        list &&
            collection &&
            setSweepItems(
                list.slice(0, items.length).map((card) => ({
                    token_id: card.metadata.token_id,
                    card,
                    listing: card.listing?.listing,
                })),
                collection,
                isGold,
            );
    }, [items.length, list, collection]);

    // 是否显示loading icon
    const confirmLoading = !!((isGold && goldAutoSelling) || action);
    if (!list && !collection) {
        return <></>;
    }
    return (
        <>
            {confirmOpen && (
                <SweepConfirm
                    items={items}
                    needed={{
                        icp: bigint2string(total_icp),
                        ogy: bigint2string(total_ogy),
                    }}
                    isGold={isGold}
                    goldAutoSelling={goldAutoSelling}
                    onConfirm={onConfirm}
                    confirmLoading={confirmLoading}
                    onClose={() => {
                        setConfirmOpen(false);
                    }}
                />
            )}
            {/* pc端ui */}
            <div className="fixed bottom-0 left-0 right-0 z-[1000]  hidden h-[74px] w-full items-center justify-between  gap-x-[18px] border-t border-[#DCDCDC] bg-[#FFF] px-[40px] py-[17px] md:flex">
                <div className="flex items-center gap-x-[18px]">
                    <div className="font-inter-bold text-[16px] leading-normal ">Sweep</div>
                    <Switch
                        checked={sweepMode}
                        onClick={() => {
                            toggleSweepMode();
                            update && update();
                            refresh();
                        }}
                    />
                </div>
                {sweepMode && (
                    <div className="mr-auto flex items-center gap-x-[18px]">
                        <div className="flex h-[40px] items-center justify-between gap-x-[13px] overflow-hidden rounded-[8px] border border-common">
                            <div className="border-r border-common p-[7px]">
                                <img src="/img/market/broom.svg" alt="broom" />
                            </div>
                            <Slider
                                onValueChange={(e) => {
                                    setSweepItems(
                                        list!.slice(0, e[0]).map((card) => ({
                                            token_id: card.metadata.token_id,
                                            card,
                                            listing: card.listing?.listing,
                                        })),
                                        collection!,
                                        isGold,
                                    );
                                }}
                                className="w-[150px]"
                                value={[items.length]}
                                max={max_sweep}
                                step={1}
                                key={'sweep-slider' + resetSlider}
                            />

                            <div className="flex w-[78px] items-center border-l border-common px-[7px] py-[15px] font-inter-semibold text-[14px]">
                                <Input
                                    className="box-content h-[20px] w-[20px] border-none px-0 py-[10px] font-inter-bold text-[14px] text-black"
                                    value={items.length}
                                    defaultValue={items.length}
                                    onChange={(e) => {
                                        let v = Number(e.target.value);
                                        if (isNaN(v)) {
                                            return;
                                        }
                                        v = Math.min(v, max_sweep);
                                        setSweepItems(
                                            list!.slice(0, v).map((card) => ({
                                                token_id: card.metadata.token_id,
                                                card,
                                                listing: card.listing?.listing,
                                            })),
                                            collection!,
                                            isGold,
                                        );
                                    }}
                                />
                                <span className="ml-[3px] h-fit">Items</span>
                            </div>
                        </div>

                        <div className="flex items-end font-inter-semibold ">
                            <div className="flex min-w-[15px] items-end">
                                <TokenPrice
                                    value={{
                                        value: bigint2string(total_icp),
                                        decimals: { type: 'exponent', value: getTokenDecimals() },
                                        scale: 2,
                                        paddingEnd: 2,
                                    }}
                                    className="mx-auto text-[14px] leading-none text-stress md:text-[14px]"
                                />
                            </div>

                            <span className="ml-[3px] text-[12px] leading-none text-symbol">
                                ICP
                            </span>
                        </div>
                        {total_ogy > 0 && (
                            <div className="flex items-end font-inter-semibold ">
                                <div className="flex min-w-[15px] items-end">
                                    <TokenPrice
                                        value={{
                                            value: bigint2string(total_ogy),
                                            decimals: {
                                                type: 'exponent',
                                                value: getTokenDecimals(),
                                            },
                                            scale: 2,
                                            paddingEnd: 2,
                                        }}
                                        className="mx-auto text-[14px] leading-none text-stress md:text-[14px]"
                                    />
                                </div>
                                <span className="ml-[3px] text-[12px] leading-none text-symbol">
                                    OGY
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <div className={cn('flex', !sweepMode && 'hidden')}>
                    <div className="ml-auto mr-[28px] flex cursor-pointer">
                        <div
                            className="my-auto flex items-center"
                            onClick={() => setViewOpen((p) => !p)}
                        >
                            <img
                                src="/img/market/arrow.svg"
                                className={cn('mt-[3px] rotate-180', viewOpen && 'rotate-0')}
                                alt=""
                            />
                            <div className="ml-[4px] font-inter-medium text-[14px]  leading-none text-symbol">
                                view collections
                            </div>
                        </div>
                    </div>

                    {identity ? (
                        <Button
                            disabled={items.length === 0}
                            onClick={onBuyNow}
                            className="flex items-center font-inter-bold text-[14px]"
                        >
                            Buy Now
                        </Button>
                    ) : (
                        <Link to="/connect">
                            <Button className="flex items-center font-inter-bold text-[14px]">
                                Connect
                            </Button>
                        </Link>
                    )}
                </div>
                <div className="absolute bottom-full left-0 right-0">
                    <Drawer
                        placement="bottom"
                        onClose={() => {
                            setViewOpen(false);
                        }}
                        closeIcon={null}
                        open={viewOpen}
                        rootClassName="market-view-container"
                    >
                        <div className="flex justify-between border-b border-common px-[40px] pt-[17px] font-inter-semibold text-[12px] text-symbol">
                            <span>Item</span>
                            <span>Price</span>
                        </div>
                        <div className="flex h-[220px] overflow-scroll px-[40px] py-[10px]">
                            <div className="flex h-fit w-full  flex-col gap-y-[8px] pb-[10px]">
                                {items
                                    .filter((i) => !!i.card)
                                    .map((item) => {
                                        if (!item.card) {
                                            return;
                                        }
                                        return (
                                            <Link
                                                to={`/market/${item.card.data?.info.collection}/${item.card.metadata.token_id.token_identifier}`}
                                                className="flex cursor-pointer items-center justify-between"
                                                key={uniqueKey(item.card.metadata.token_id)}
                                            >
                                                <div className="flex items-center">
                                                    <div className="mr-[10px]  w-[30px]">
                                                        {' '}
                                                        <NftMedia
                                                            src={cdn(
                                                                getThumbnailByNftTokenMetadata(
                                                                    item.card.metadata,
                                                                ),
                                                            )}
                                                            className="rounded-[6px]"
                                                            metadata={item.card.metadata}
                                                        />
                                                    </div>
                                                    <NftName
                                                        token_id={item.card.metadata.token_id}
                                                        metadata={item.card}
                                                    />
                                                </div>
                                                <div>
                                                    <TokenPrice
                                                        value={{
                                                            value: (
                                                                item.listing as NftListingListing
                                                            ).price,
                                                            decimals: {
                                                                type: 'exponent',
                                                                value: getTokenDecimals(),
                                                            },
                                                            scale: (v) => (v < 0.01 ? 4 : 2),
                                                        }}
                                                        className="font-inter-semibold text-[12px] text-title md:text-[12px]"
                                                    />
                                                    <span className="ml-[3px] font-inter-semibold text-[12px] text-title">
                                                        {(
                                                            item.listing as NftListingListing
                                                        ).token.symbol.toLocaleUpperCase()}
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                            </div>
                        </div>
                    </Drawer>
                </div>
            </div>
            {/* 手机端ui */}
            <div className="fixed bottom-0 left-0 right-0 z-[1000] flex w-full flex-col items-center justify-between gap-x-[18px] border-t border-[#DCDCDC]  bg-[#FFF] px-[18px] md:hidden">
                <div className="flex min-h-[52px] w-full items-center justify-between">
                    <div className="flex gap-x-[13px]">
                        <div className="font-inter-bold text-[16px] ">Sweep</div>
                        <Switch
                            checked={sweepMode}
                            onClick={() => {
                                toggleSweepMode();
                                update && update();
                                refresh();
                            }}
                        />
                    </div>
                    {!sweepMode ? (
                        <div className="rounded-[8px] border border-common p-[7px]">
                            <img src="/img/market/broom.svg" alt="broom" />
                        </div>
                    ) : (
                        <CloseIcon onClick={toggleSweepMode} />
                    )}
                </div>
                {sweepMode && (
                    <div className="mt-[10px] flex w-full flex-col items-center gap-x-[18px]">
                        <div className="flex h-[40px] w-full items-center justify-between gap-x-[13px] overflow-hidden rounded-[8px] border border-common">
                            <div className="border-r border-common p-[7px]">
                                <img src="/img/market/broom.svg" alt="broom" />
                            </div>
                            <Slider
                                onValueChange={(e) => {
                                    setSweepItems(
                                        list!.slice(0, e[0]).map((card) => ({
                                            token_id: card.metadata.token_id,
                                            card,
                                            listing: card.listing?.listing,
                                        })),
                                        collection!,
                                        isGold,
                                    );
                                }}
                                className="w-[190px]"
                                defaultValue={[items.length]}
                                max={list?.length}
                                step={1}
                            />
                            <div className="flex w-[72px] items-center border-l border-common px-[7px] py-[15px] font-inter-semibold text-[14px]">
                                <Input
                                    className="box-content h-[20px] w-[20px] border-none px-0 py-[10px] font-inter-bold text-[14px] text-black"
                                    value={items.length}
                                    defaultValue={items.length}
                                    onChange={(e) => {
                                        let v = Number(e.target.value);
                                        v = Math.min(v, max_sweep);
                                        setSweepItems(
                                            list!.slice(0, v).map((card) => ({
                                                token_id: card.metadata.token_id,
                                                card,
                                                listing: card.listing?.listing,
                                            })),
                                            collection!,
                                            isGold,
                                        );
                                    }}
                                />
                                <span className="ml-[3px]">Items</span>
                            </div>
                        </div>
                        <div className="mt-[25px] flex w-full items-center justify-between pb-[20px]">
                            {' '}
                            <div className="flex flex-col items-end gap-y-[3px]">
                                {' '}
                                <div className="flex items-end font-inter-semibold">
                                    <div className="flex min-w-[15px] items-end">
                                        <TokenPrice
                                            value={{
                                                value: totalPrice,
                                                decimals: {
                                                    type: 'exponent',
                                                    value: getTokenDecimals(),
                                                },
                                                scale: 2,
                                                paddingEnd: 2,
                                            }}
                                            className="mx-auto text-[14px] leading-none text-stress md:text-[14px]"
                                        />
                                    </div>

                                    <span className="ml-[3px] text-[12px] leading-none text-symbol">
                                        ICP
                                    </span>
                                </div>
                                {total_ogy > 0 && (
                                    <div className="flex items-end font-inter-semibold ">
                                        <div className="flex min-w-[15px] items-end">
                                            <TokenPrice
                                                value={{
                                                    value: bigint2string(total_ogy),
                                                    decimals: {
                                                        type: 'exponent',
                                                        value: getTokenDecimals(),
                                                    },
                                                    scale: 2,
                                                    paddingEnd: 2,
                                                }}
                                                className="mx-auto text-[14px] leading-none text-stress md:text-[14px]"
                                            />
                                        </div>
                                        <span className="ml-[3px] text-[12px] leading-none text-symbol">
                                            OGY
                                        </span>
                                    </div>
                                )}
                            </div>
                            {identity ? (
                                <Button
                                    disabled={items.length === 0}
                                    className="font-inter-bold text-[14px]"
                                    onClick={onBuyNow}
                                >
                                    Buy Now
                                </Button>
                            ) : (
                                <Link to="/connect">
                                    <Button className="font-inter-bold text-[14px]">Connect</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
                <div className="absolute bottom-full left-0 right-0 ">
                    <Drawer
                        placement="bottom"
                        onClose={() => {
                            setViewOpen(false);
                        }}
                        closeIcon={null}
                        open={viewOpen}
                        rootClassName="market-view-container"
                    >
                        <div className="flex justify-between border-b border-common px-[40px] pt-[17px] font-inter-semibold text-[12px] text-symbol">
                            <span>Item</span>
                            <span>Price</span>
                        </div>
                        <div className="flex h-[220px] overflow-scroll px-[40px] py-[10px]">
                            <div className="flex h-fit w-full  flex-col gap-y-[8px] pb-[10px]">
                                {items
                                    .filter((i) => !!i.card)
                                    .map((item) => {
                                        if (!item.card) {
                                            return;
                                        }
                                        return (
                                            <Link
                                                to={`/market/${item.card.data?.info.collection}/${item.card.metadata.token_id.token_identifier}`}
                                                className="flex cursor-pointer items-center justify-between"
                                                key={uniqueKey(item.card.metadata.token_id)}
                                            >
                                                <div className="flex items-center">
                                                    <div className="mr-[10px]  w-[30px]">
                                                        {' '}
                                                        <NftMedia
                                                            src={cdn(
                                                                getThumbnailByNftTokenMetadata(
                                                                    item.card.metadata,
                                                                ),
                                                            )}
                                                            className="rounded-[6px]"
                                                            metadata={item.card.metadata}
                                                        />
                                                    </div>
                                                    <NftName
                                                        token_id={item.card.metadata.token_id}
                                                        metadata={item.card}
                                                    />
                                                </div>
                                                <div>
                                                    <TokenPrice
                                                        value={{
                                                            value: (
                                                                item.listing as NftListingListing
                                                            ).price,
                                                            decimals: {
                                                                type: 'exponent',
                                                                value: getTokenDecimals(),
                                                            },
                                                            scale: (v) => (v < 0.01 ? 4 : 2),
                                                        }}
                                                        className="font-inter-semibold text-[12px] text-title md:text-[12px]"
                                                    />
                                                    <span className="ml-[3px] font-inter-semibold text-[12px] text-title">
                                                        {(
                                                            item.listing as NftListingListing
                                                        ).token.symbol.toLocaleUpperCase()}
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                            </div>
                        </div>
                    </Drawer>
                </div>
            </div>
        </>
    );
}

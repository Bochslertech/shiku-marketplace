import { useCallback, useEffect, useMemo } from 'react';
import { NotificationInstance } from 'antd/es/notification/interface';
import { LoadingOutlined } from '@ant-design/icons';
// import _ from 'lodash';
import { BatchBuyingTransaction } from '@/01_types/exchange/batch-buy';
import { BatchBuyingGoldTransaction, NftOwnerAndListing } from '@/01_types/exchange/batch-buy-gold';
import { BatchSellingTransaction } from '@/01_types/exchange/batch-sell';
import { SingleBuyTransaction } from '@/01_types/exchange/single-buy';
import { SingleSellTransaction } from '@/01_types/exchange/single-sell';
import { SingleTransferTransaction } from '@/01_types/exchange/single-transfer';
import { NftListing } from '@/01_types/listing';
import { NftIdentifier, NftTokenOwner } from '@/01_types/nft';
import { BatchNftSale } from '@/01_types/yumi';
import { parse_nft_identifier } from '@/02_common/nft/ext';
import { preventLink } from '@/02_common/react/link';
import { useIdentityStore } from '@/07_stores/identity';
import { TransactionRecord, useTransactionStore } from '@/07_stores/transaction';
import { useDoBatchBuyNftByTransaction } from '@/08_hooks/exchange/batch/buy';
import { useDoBatchBuyGoldNftByTransaction } from '@/08_hooks/exchange/batch/buy-gold';
import { useDoBatchSellNftByTransaction } from '@/08_hooks/exchange/batch/sell';
import { useDoBuyNftByTransaction } from '@/08_hooks/exchange/single/buy';
import { useDoSellNftByTransaction } from '@/08_hooks/exchange/single/sell';
import { useDoTransferNftByTransaction } from '@/08_hooks/exchange/single/transfer';
// import { refreshNftListing } from '@/08_hooks/nft/listing';
import NftName from '@/09_components/nft/name';
import { Button } from '@/09_components/ui/button';
import CloseIcon from '@/09_components/ui/close-icon';
import { BatchBuyingTransactionView } from './batch-buy';
import { BatchBuyingGoldTransactionView } from './batch-buy-gold';
import { BatchSellingTransactionView } from './batch-sell';
import { SingleBuyTransactionView } from './single-buy';
import { SingleSellingTransactionView } from './single-sell';
import { SingleTransferringTransactionView } from './single-transfer';

export const TransactionNftName = ({ record }: { record: TransactionRecord }) => {
    let token_id: NftIdentifier | string[] | undefined;
    switch (record.transaction.type) {
        case 'single-buy':
            token_id = (record.transaction as SingleBuyTransaction).args.token_id;
            return <NftName token_id={token_id} />;
        case 'single-sell':
            token_id = (record.transaction as SingleSellTransaction).args.owner.token_id;
            return <NftName token_id={token_id} />;
        case 'single-transfer':
            token_id = (record.transaction as SingleTransferTransaction).args.owner.token_id;
            return <NftName token_id={token_id} />;
        case 'batch-buy':
            return 'batch-buy successfully!';
        case 'batch-buy-gold':
            token_id = (record.transaction as BatchBuyingGoldTransaction).actions
                .find((i) => i.action === 'BID_NFTS_ALL_SUCCESS')
                ?.data.collections.flatMap((c) =>
                    c.list.map((i) => i.owner.token_id.token_identifier.split('-')[1]),
                ) as string[];
            return token_id && 'gold ' + token_id.join(',');
        case 'batch-sell':
            return 'batch-sell successfully!';
        default:
            return <></>;
    }
};
export function TransactionViewMain({
    api,
    record,
    done,
    title,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    done: number; // 当前完成百分比
    title: string; // 当前的title
}) {
    const { stop, go_on, toggle, remove, update } = useTransactionStore((s) => s);
    // single-buy hooks
    const single_buy = useDoBuyNftByTransaction();

    // single-sell hooks
    const single_sell = useDoSellNftByTransaction();

    // single-transfer hooks
    const single_transfer = useDoTransferNftByTransaction();

    // batch-buy hooks
    const batch_buy = useDoBatchBuyNftByTransaction();

    // batch-buy-gold hooks
    const batch_buy_gold = useDoBatchBuyGoldNftByTransaction();

    // batch-sell hooks
    const batch_sell = useDoBatchSellNftByTransaction();

    // 清理状态
    const removeShoppingCartItem = useIdentityStore((s) => s.removeShoppingCartItem);
    const removeGoldShoppingCartItem = useIdentityStore((s) => s.removeGoldShoppingCartItem);
    const removeBatchNftSale = useIdentityStore((s) => s.removeBatchNftSale);
    // const setSweepItems = useIdentityStore((s) => s.setSweepItems);
    // const sweepItems = useIdentityStore((s) => s.sweepItems);
    // const sweepGoldItems = useIdentityStore((s) => s.sweepGoldItems);

    const triggerRefresh = useTransactionStore((s) => s.triggerRefresh);

    const transaction = record.transaction;
    const showStop = useMemo(() => {
        if (['successful', 'failed'].includes(record.status ?? '')) return false;
        if (record.stopped) return false;
        return true; // 没有完成才有取消按钮
    }, [record, record.status, record.stopped]);

    const doStop = useCallback(() => {
        stop(record.id);
    }, [record]);

    const showContinue = useMemo(() => {
        if (record.stopped) return true;
        if (record.status !== 'failed') return false;
        return true; // 失败了才显示继续按钮
    }, [record, record.stopped, record.status]);

    const doContinue = useCallback(() => {
        if (record.stopped) go_on(record.id);
        switch (record.transaction.type) {
            case 'single-buy':
                single_buy(
                    record.id,
                    record.created,
                    transaction as SingleBuyTransaction,
                    true,
                ).catch((e) => update(record.id, record.transaction, record.status!, `${e}`));
                break;
            case 'single-sell':
                single_sell(record.id, record.created, transaction as SingleSellTransaction);
                break;
            case 'single-transfer':
                single_transfer(
                    record.id,
                    record.created,
                    transaction as SingleTransferTransaction,
                );
                break;
            case 'batch-buy':
                batch_buy(record.id, record.created, transaction as BatchBuyingTransaction, true);
                break;
            case 'batch-buy-gold':
                batch_buy_gold(
                    record.id,
                    record.created,
                    transaction as BatchBuyingGoldTransaction,
                );
                break;
            case 'batch-sell':
                batch_sell(record.id, record.created, transaction as BatchSellingTransaction);
                break;
            default:
                throw new Error(`what a transaction type: ${JSON.stringify(record.transaction)}`);
        }
    }, [record, record.stopped]);

    const onRemove = () => {
        doStop();
        remove(record.id);
    };

    // 在成功时需要跳出成功页且尝试移除购物车
    useEffect(() => {
        if (record.status === 'successful') {
            setTimeout(() => {
                toggle(record.id);
            }, 3000);

            switch (record.transaction.type) {
                case 'single-buy':
                    removeShoppingCartItem((transaction as SingleBuyTransaction).args.token_id);
                    removeGoldShoppingCartItem((transaction as SingleBuyTransaction).args.token_id);
                    break;
                case 'single-sell':
                    triggerRefresh('single-sell');
                    removeBatchNftSale((transaction as SingleSellTransaction).args.owner.token_id);
                    break;
                case 'single-transfer':
                    break;
                case 'batch-buy':
                    {
                        const success_token_list = transaction.actions
                            .find((i) => i.action === 'SUBMITTING_HEIGHT')
                            ?.data.map(parse_nft_identifier);

                        success_token_list.forEach((e) => {
                            removeShoppingCartItem(e);
                        }); // 尝试移除购物车
                        // setSweepItems(sweepItems[].filter(), false);
                    }

                    break;
                case 'batch-buy-gold':
                    // 刷新列表
                    triggerRefresh('batch-buy-gold');
                    (record.transaction as BatchBuyingGoldTransaction).actions
                        .find((i) => i.action === 'BID_NFTS_ALL_SUCCESS')
                        ?.data.collections.forEach((c) =>
                            c.list.forEach((i) => {
                                const token_id = i.owner.token_id;
                                removeGoldShoppingCartItem(token_id);
                                return token_id;
                            }),
                        );

                    break;
                case 'batch-sell':
                    {
                        const success_list = transaction.actions.find(
                            (a) => a.action === 'BATCH_YUMI_LISTING',
                        )?.data.success;
                        success_list.forEach((s) => {
                            removeBatchNftSale(s.token_id);
                        }); // 尝试移除购物车
                    }
                    break;
                default:
                    throw new Error(
                        `what a transaction type: ${JSON.stringify(record.transaction)}`,
                    );
            }
        }
    }, [record.status]);

    // 判断交易类型
    let items:
        | {
              owner: NftTokenOwner;
              listing: NftListing;
          }[]
        | NftOwnerAndListing[]
        | BatchNftSale[]
        | undefined;

    let top_title: 'buy' | 'sell' | 'transfer';
    switch (record.transaction.type) {
        case 'single-buy':
            top_title = 'buy';
            break;
        case 'single-sell':
            top_title = 'sell';
            break;
        case 'single-transfer':
            top_title = 'transfer';
            break;
        case 'batch-buy':
            top_title = 'buy';
            items = record.transaction.args.token_list;
            break;
        case 'batch-buy-gold':
            top_title = 'buy';
            items = record.transaction.args.token_list;
            break;
        case 'batch-sell':
            top_title = 'sell';
            items = record.transaction.args.sales;
            break;
        default:
            throw new Error(`what a transaction type: ${JSON.stringify(record.transaction)}`);
    }
    return (
        <div className="flex h-[32px] w-full  items-center justify-between">
            <div className="absolute top-[6px] font-inter-semibold capitalize text-yumi">
                {top_title}
            </div>

            {record.status === 'executing' ? (
                <span className="relative mr-[12px] flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500 "></span>
                </span>
            ) : (
                <img
                    src={`/img/recorder/${
                        record.status === 'successful'
                            ? 'confirming-point.svg'
                            : record.status === 'failed' && 'failed-point.svg'
                    }`}
                    alt=""
                    className="mr-[12px] flex-shrink-0"
                />
            )}
            {record.status === 'executing' ? (
                <div className="relative flex h-[38px] w-[38px]">
                    <div className="absolute bottom-0 left-0 right-0 top-0  rounded-full border-[3px] border-[#aaaaaa] opacity-30"></div>
                    <LoadingOutlined
                        className="!absolute -bottom-0 -left-0 -right-0 -top-0 text-[50px]"
                        style={{ color: '#7953ff' }}
                    />
                    <div className="m-auto text-[12px]">{done * 100}%</div>
                </div>
            ) : record.status === 'successful' ? (
                <img src="/img/recorder/success.svg" className="h-[34px] w-[34px]" alt="" />
            ) : (
                <img src="/img/recorder/failed.svg" className="h-[34px] w-[34px]" alt="" />
            )}
            {/* 相加省略号不能用flex */}
            <div className="mx-[10px] flex-1 items-center truncate font-inter-semibold text-[12px]  text-title">
                {record.status === 'executing' && title}
                {record.status === 'successful' && (
                    <TransactionNftName record={record}></TransactionNftName>
                )}
                {record.status === 'failed' && title}
            </div>
            {showContinue && (
                <Button
                    onClick={preventLink(() => {
                        doContinue();
                        // toggle(record.id);
                    })}
                    className="mr-[15px] h-[28px] bg-yumi px-[10px] font-inter-semibold text-[12px] text-[#fff] hover:bg-yumi/80"
                >
                    Continue
                </Button>
            )}
            {items && (
                <div className="mr-[15px] h-6 w-6 rounded-full border-[2px] border-common text-center font-inter-semibold text-[13px] leading-5 text-yumi">
                    {items.length}
                </div>
            )}
            <img
                className="mr-[11px] h-[20px] w-[20px]"
                src="/img/recorder/show.svg"
                onClick={() => toggle(record.id)}
                alt=""
            />
            <div className="h-[32px] w-px bg-[#F3F3F3]"></div>
            <>
                <CloseIcon
                    onClick={() => {
                        remove(record.id);
                        api.destroy(record.id);
                    }}
                    className="ml-[15px] w-[18px]"
                />
            </>

            <div className="hidden" onClick={() => toggle(record.id)}>
                {showStop && <div onClick={preventLink(doStop)}>Stop</div>}
                {showContinue && <div onClick={preventLink(doContinue)}> Continue </div>}
                <div onClick={preventLink(onRemove)}>Delete</div>
            </div>
        </div>
    );
}
export function TransactionView({
    api,
    record,
}: {
    api: NotificationInstance;
    index: number;
    record: TransactionRecord;
}) {
    switch (record.transaction.type) {
        case 'single-buy':
            return (
                <SingleBuyTransactionView
                    api={api}
                    record={record}
                    transaction={record.transaction}
                ></SingleBuyTransactionView>
            );
        case 'single-sell':
            return (
                <SingleSellingTransactionView
                    api={api}
                    record={record}
                    transaction={record.transaction}
                ></SingleSellingTransactionView>
            );
        case 'single-transfer':
            return (
                <SingleTransferringTransactionView
                    api={api}
                    record={record}
                    transaction={record.transaction}
                ></SingleTransferringTransactionView>
            );
        case 'batch-buy':
            return (
                <BatchBuyingTransactionView
                    api={api}
                    record={record}
                    transaction={record.transaction}
                ></BatchBuyingTransactionView>
            );
        case 'batch-buy-gold':
            return (
                <BatchBuyingGoldTransactionView
                    api={api}
                    record={record}
                    transaction={record.transaction}
                ></BatchBuyingGoldTransactionView>
            );
        case 'batch-sell':
            return (
                <BatchSellingTransactionView
                    api={api}
                    record={record}
                    transaction={record.transaction}
                ></BatchSellingTransactionView>
            );
        default:
            throw new Error(`what a transaction type: ${JSON.stringify(record.transaction)}`);
    }
}

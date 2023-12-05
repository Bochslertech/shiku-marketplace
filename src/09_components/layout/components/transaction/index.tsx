import { useEffect } from 'react';
import { notification } from 'antd';
import { BatchBuyingTransaction } from '@/01_types/exchange/batch-buy';
import { BatchBuyingGoldTransaction } from '@/01_types/exchange/batch-buy-gold';
import { BatchSellingTransaction } from '@/01_types/exchange/batch-sell';
import { SingleBuyTransaction } from '@/01_types/exchange/single-buy';
import { SingleSellTransaction } from '@/01_types/exchange/single-sell';
import { SingleTransferTransaction } from '@/01_types/exchange/single-transfer';
import { useIdentityStore } from '@/07_stores/identity';
import { checkWhitelist } from '@/08_hooks/common/whitelist';
import { useDoBatchBuyNftByTransaction } from '@/08_hooks/exchange/batch/buy';
import { useDoBatchBuyGoldNftByTransaction } from '@/08_hooks/exchange/batch/buy-gold';
import { useDoBatchSellNftByTransaction } from '@/08_hooks/exchange/batch/sell';
import { is_transaction_executing } from '@/08_hooks/exchange/executing';
import { useDoBuyNftByTransaction } from '@/08_hooks/exchange/single/buy';
import { useDoSellNftByTransaction } from '@/08_hooks/exchange/single/sell';
import { useDoTransferNftByTransaction } from '@/08_hooks/exchange/single/transfer';
import { useTransactionRecords } from '@/08_hooks/stores/transaction';
import SingleTransactionNotification from './components/notification/notification';

function TransactionNotification() {
    const identity = useIdentityStore((s) => s.connectedIdentity);

    const [api, contextHolder] = notification.useNotification();

    const single_buy = useDoBuyNftByTransaction();

    const single_sell = useDoSellNftByTransaction();

    const single_transfer = useDoTransferNftByTransaction();

    const batch_buy = useDoBatchBuyNftByTransaction();

    const batch_buy_gold = useDoBatchBuyGoldNftByTransaction();

    const batch_sell = useDoBatchSellNftByTransaction();

    const { records } = useTransactionRecords();
    useEffect(() => {
        console.debug(`======= start transaction notification check =======`, records);
        let whitelist: string[] = [];
        const executable: (() => Promise<void>)[] = [];
        for (const record of records) {
            if (is_transaction_executing(record.id)) continue; // 正在执行
            if (record.stopped) continue; // 已被撤销
            if (['successful', 'failed'].includes(record.status ?? '')) continue; // 已经执行的不再自动执行
            switch (record.transaction.type) {
                case 'single-buy':
                    console.debug('should single buy', record);
                    whitelist.push(record.transaction.args.token.canister);
                    whitelist.push(record.transaction.args.token_id.collection);
                    executable.push(() =>
                        single_buy(
                            record.id,
                            record.created,
                            record.transaction as SingleBuyTransaction,
                            false,
                        ),
                    );
                    break;
                case 'single-sell':
                    console.debug('should single sell', record);
                    whitelist.push(
                        (record.transaction as SingleSellTransaction).args.owner.token_id
                            .collection,
                    );
                    executable.push(() =>
                        single_sell(
                            record.id,
                            record.created,
                            record.transaction as SingleSellTransaction,
                        ),
                    );
                    break;
                case 'single-transfer':
                    console.debug('should single transfer', record);
                    whitelist.push(
                        (record.transaction as SingleTransferTransaction).args.owner.token_id
                            .collection,
                    );
                    executable.push(() =>
                        single_transfer(
                            record.id,
                            record.created,
                            record.transaction as SingleTransferTransaction,
                        ),
                    );
                    break;
                case 'batch-buy': {
                    console.debug('should batch buy', record);
                    const token_list = (record.transaction as BatchBuyingTransaction).args
                        .token_list;
                    whitelist = whitelist.concat([
                        ...token_list.map((item) => item.owner.token_id.collection),
                        ...token_list.map((item) =>
                            item.listing.type === 'listing' ? item.listing.token.canister : '',
                        ),
                    ]);
                    executable.push(() =>
                        batch_buy(
                            record.id,
                            record.created,
                            record.transaction as BatchBuyingTransaction,
                            false,
                        ),
                    );
                    break;
                }
                case 'batch-buy-gold': {
                    console.debug('should batch buy gold', record);
                    const token_list = (record.transaction as BatchBuyingGoldTransaction).args
                        .token_list;
                    whitelist = whitelist.concat([
                        ...token_list.map((item) => item.owner.token_id.collection),
                        ...token_list.map((item) =>
                            item.listing.type === 'listing' ? item.listing.token.canister : '',
                        ),
                    ]);

                    executable.push(() =>
                        batch_buy_gold(
                            record.id,
                            record.created,
                            record.transaction as BatchBuyingGoldTransaction,
                        ),
                    );
                    break;
                }
                case 'batch-sell': {
                    console.debug('should batch sell', record);
                    const sales = (record.transaction as BatchSellingTransaction).args.sales;

                    whitelist = whitelist.concat(sales.map((item) => item.token_id.collection));

                    executable.push(() =>
                        batch_sell(
                            record.id,
                            record.created,
                            record.transaction as BatchSellingTransaction,
                        ),
                    );
                    break;
                }
            }
        }
        if (identity && executable.length) {
            checkWhitelist(identity, whitelist).then(() => executable.forEach((call) => call()));
        }
    }, [identity, records]);
    if (records.length === 0) return <></>;
    return (
        <>
            {contextHolder}
            {records.map((record, index) => (
                <SingleTransactionNotification
                    api={api}
                    key={record.id}
                    index={index}
                    record={record}
                />
            ))}
        </>
    );
}

export default TransactionNotification;

import { NotificationInstance } from 'antd/es/notification/interface';
import { BuyingAction, SingleBuyTransaction } from '@/01_types/exchange/single-buy';
import { TransactionRecord, useTransactionStore } from '@/07_stores/transaction';
import { useBuyingActionSteps } from '@/08_hooks/exchange/single/buy';
import { useTransactionProcess } from '@/08_hooks/exchange/steps';
import { TransactionViewMain } from '.';
import { ActionStepsModal } from '../../../../modal/action-steps';
import { BoughtModal } from '../../../../nft-card/components/buy';

export const SingleBuySteps = ({
    api,
    record,
    transaction,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    transaction: SingleBuyTransaction;
}) => {
    const show = record.modal;
    const toggle = useTransactionStore((s) => s.toggle);
    const remove = useTransactionStore((s) => s.remove);

    // 展示进度条
    const { actions } = useBuyingActionSteps(undefined, transaction.args.raw.standard);

    const { action } = useTransactionProcess<BuyingAction>({ record, actions });
    return (
        show && (
            <>
                <BoughtModal
                    record={record}
                    transaction={transaction}
                    onClose={() => {
                        remove(record.id);
                        api.destroy(record.id);
                    }}
                />
                <ActionStepsModal<BuyingAction>
                    title=""
                    record={record}
                    actions={actions}
                    action={action}
                    onClose={() => toggle(record.id)}
                />
            </>
        )
    );
};

export function SingleBuyTransactionView({
    api,
    record,
    transaction,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    transaction: SingleBuyTransaction;
}) {
    const { actions } = useBuyingActionSteps(undefined, transaction.args.raw.standard);

    const { done, title } = useTransactionProcess<BuyingAction>({ record, actions });

    return <TransactionViewMain api={api} record={record} done={done} title={title} />;
}

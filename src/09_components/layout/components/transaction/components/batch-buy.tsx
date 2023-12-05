import { NotificationInstance } from 'antd/es/notification/interface';
import { BatchBuyingAction, BatchBuyingTransaction } from '@/01_types/exchange/batch-buy';
import { TransactionRecord, useTransactionStore } from '@/07_stores/transaction';
import { useBatchBuyingActionSteps } from '@/08_hooks/exchange/batch/buy';
import { useTransactionProcess } from '@/08_hooks/exchange/steps';
import { TransactionViewMain } from '.';
import { ActionStepsModal } from '../../../../modal/action-steps';
import BatchBuyingResultModal from '../../cart/cart-modal';

export const BatchBuyingSteps = ({
    api,
    record,
    transaction,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    transaction: BatchBuyingTransaction;
}) => {
    const show = record.modal;
    const toggle = useTransactionStore((s) => s.toggle);
    const remove = useTransactionStore((s) => s.remove);

    // 展示进度条
    const { actions } = useBatchBuyingActionSteps(undefined);

    const { action } = useTransactionProcess<BatchBuyingAction>({ record, actions });
    return (
        show && (
            <>
                <BatchBuyingResultModal
                    record={record}
                    transaction={transaction}
                    onClose={() => {
                        remove(record.id);
                        api.destroy(record.id);
                    }}
                />
                <ActionStepsModal<BatchBuyingAction>
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

export function BatchBuyingTransactionView({
    api,
    record, // transaction,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    transaction: BatchBuyingTransaction;
}) {
    const { actions } = useBatchBuyingActionSteps(undefined);

    const { done, title } = useTransactionProcess<BatchBuyingAction>({ record, actions });

    return <TransactionViewMain api={api} record={record} done={done} title={title} />;
}

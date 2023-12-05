import { NotificationInstance } from 'antd/es/notification/interface';
import {
    BatchBuyingGoldAction,
    BatchBuyingGoldTransaction,
} from '@/01_types/exchange/batch-buy-gold';
import { TransactionRecord, useTransactionStore } from '@/07_stores/transaction';
import { useBatchBuyingGoldActionSteps } from '@/08_hooks/exchange/batch/buy-gold';
import { useTransactionProcess } from '@/08_hooks/exchange/steps';
import { TransactionViewMain } from '.';
import { ActionStepsModal } from '../../../../modal/action-steps';
import BatchBuyingResultModal from '../../cart/cart-modal';

// import BatchBuyingResultModal from '../../cart/cart-modal';

export const BatchBuyingGoldSteps = ({
    api,
    record,
    transaction,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    transaction: BatchBuyingGoldTransaction;
}) => {
    const show = record.modal;
    const toggle = useTransactionStore((s) => s.toggle);
    const remove = useTransactionStore((s) => s.remove);

    // 展示进度条
    const { actions } = useBatchBuyingGoldActionSteps(undefined);

    const { action } = useTransactionProcess<BatchBuyingGoldAction>({ record, actions });
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
                <ActionStepsModal<BatchBuyingGoldAction>
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

export function BatchBuyingGoldTransactionView({
    api,
    record, // transaction,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    transaction: BatchBuyingGoldTransaction;
}) {
    const { actions } = useBatchBuyingGoldActionSteps(undefined);

    const { done, title } = useTransactionProcess<BatchBuyingGoldAction>({ record, actions });

    return <TransactionViewMain api={api} record={record} done={done} title={title} />;
}

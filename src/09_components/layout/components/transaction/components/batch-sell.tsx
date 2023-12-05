import { NotificationInstance } from 'antd/es/notification/interface';
import { BatchSellingAction, BatchSellingTransaction } from '@/01_types/exchange/batch-sell';
import { TransactionRecord, useTransactionStore } from '@/07_stores/transaction';
import { useBatchSellingActionSteps } from '@/08_hooks/exchange/batch/sell';
import { useTransactionProcess } from '@/08_hooks/exchange/steps';
import { BatchSaleResultModal } from '@/09_components/nft-card/components/batch';
import { TransactionViewMain } from '.';
import { ActionStepsModal } from '../../../../modal/action-steps';

export const BatchSellingSteps = ({
    api,
    record, // transaction,
    transaction,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    transaction: BatchSellingTransaction;
}) => {
    const show = record.modal;
    const toggle = useTransactionStore((s) => s.toggle);
    const remove = useTransactionStore((s) => s.remove);
    // 展示进度条
    const { actions } = useBatchSellingActionSteps(undefined);

    const { action } = useTransactionProcess<BatchSellingAction>({ record, actions });

    return (
        show && (
            <>
                <BatchSaleResultModal
                    record={record}
                    transaction={transaction}
                    onClose={() => {
                        remove(record.id);
                        api.destroy(record.id);
                    }}
                ></BatchSaleResultModal>
                <ActionStepsModal<BatchSellingAction>
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

export function BatchSellingTransactionView({
    api,
    record, // transaction,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    transaction: BatchSellingTransaction;
}) {
    const { actions } = useBatchSellingActionSteps(undefined);

    const { done, title } = useTransactionProcess<BatchSellingAction>({ record, actions });

    return <TransactionViewMain api={api} record={record} done={done} title={title} />;
}

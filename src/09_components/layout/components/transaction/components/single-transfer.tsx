import { NotificationInstance } from 'antd/es/notification/interface';
import { SingleTransferTransaction } from '@/01_types/exchange/single-transfer';
import { SupportedNftStandard } from '@/01_types/nft';
import { TransactionRecord, useTransactionStore } from '@/07_stores/transaction';
import { useTransferringActionSteps } from '@/08_hooks/exchange/single/transfer';
import { useTransactionProcess } from '@/08_hooks/exchange/steps';
import { ActionStepsModal } from '@/09_components/modal/action-steps';
import { TransactionViewMain } from '.';
import { TransferringAction } from '../../../../../01_types/exchange/single-transfer';

export default function SingleTransferringSteps({
    record,
    transaction,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    transaction: SingleTransferTransaction;
}) {
    const show = record.modal;

    const toggle = useTransactionStore((s) => s.toggle);
    // const remove = useTransactionStore((s) => s.remove);
    // 展示进度条
    const { actions } = useTransferringActionSteps(
        undefined,
        transaction.args.owner.raw.standard as SupportedNftStandard,
    );
    const { action } = useTransactionProcess<TransferringAction>({ record, actions });
    if (!show) return <></>;

    return (
        <ActionStepsModal<TransferringAction>
            title=""
            record={record}
            actions={actions}
            action={action}
            onClose={() => toggle(record.id)}
        />
    );
}
export function SingleTransferringTransactionView({
    api,
    record,
    transaction,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    transaction: SingleTransferTransaction;
}) {
    // 展示进度条
    const { actions } = useTransferringActionSteps(
        undefined,
        transaction.args.owner.raw.standard as SupportedNftStandard,
    );
    const { done, title } = useTransactionProcess<TransferringAction>({ record, actions });

    return <TransactionViewMain api={api} record={record} done={done} title={title} />;
}

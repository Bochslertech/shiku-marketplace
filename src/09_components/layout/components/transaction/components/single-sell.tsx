import { NotificationInstance } from 'antd/es/notification/interface';
import { SellingAction, SingleSellTransaction } from '@/01_types/exchange/single-sell';
import { SupportedNftStandard } from '@/01_types/nft';
import { TransactionRecord, useTransactionStore } from '@/07_stores/transaction';
import { useSellingActionSteps } from '@/08_hooks/exchange/single/sell';
import { useTransactionProcess } from '@/08_hooks/exchange/steps';
import { ActionStepsModal } from '@/09_components/modal/action-steps';
import { TransactionViewMain } from '.';

export default function SingleSellingSteps({
    record,
    transaction,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    transaction: SingleSellTransaction;
}) {
    const show = record.modal;

    const toggle = useTransactionStore((s) => s.toggle);
    // const remove = useTransactionStore((s) => s.remove);
    // 展示进度条
    const { actions } = useSellingActionSteps(
        undefined,
        transaction.args.owner.raw.standard as SupportedNftStandard,
        transaction.args.owner.token_id.collection,
        transaction.args.last,
    );
    const { action } = useTransactionProcess<SellingAction>({ record, actions });
    if (!show) return <></>;

    return (
        <ActionStepsModal<SellingAction>
            title=""
            record={record}
            actions={actions}
            action={action}
            onClose={() => toggle(record.id)}
        />
    );
}
export function SingleSellingTransactionView({
    api,
    record,
    transaction,
}: {
    api: NotificationInstance;
    record: TransactionRecord;
    transaction: SingleSellTransaction;
}) {
    // 展示进度条
    const { actions } = useSellingActionSteps(
        undefined,
        transaction.args.owner.raw.standard as SupportedNftStandard,
        transaction.args.owner.token_id.collection,
        transaction.args.last,
    );
    const { done, title } = useTransactionProcess<SellingAction>({ record, actions });

    return <TransactionViewMain api={api} record={record} done={done} title={title} />;
}

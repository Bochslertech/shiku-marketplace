import { useEffect, useState } from 'react';
import { getBackendType } from '@/05_utils/app/backend';
import { useIdentityStore } from '@/07_stores/identity';
import { TransactionRecord, useTransactionStore } from '@/07_stores/transaction';

// ============== 当前后端对应的交易列表 ==============

export const useTransactionRecords = (
    id?: string,
): {
    records: TransactionRecord[];
    record: TransactionRecord | undefined;
} => {
    const identity = useIdentityStore((s) => s.connectedIdentity);

    const backendType = getBackendType();
    const all_records = useTransactionStore((s) => s.records);

    const [records, setRecords] = useState<TransactionRecord[]>([]);
    useEffect(() => {
        if (!identity) return setRecords([]);
        const records = all_records[backendType] ?? [];
        setRecords(records.filter((r) => r.principal === identity.principal));
    }, [identity, backendType, all_records]);

    const [record, setRecord] = useState<TransactionRecord | undefined>(undefined);

    useEffect(() => {
        if (id === undefined) return setRecord(undefined);
        setRecord(records.find((r) => r.id === id));
    }, [records, id]);

    return { records, record };
};

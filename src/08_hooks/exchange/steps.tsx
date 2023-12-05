import { useCallback, useEffect, useMemo, useState } from 'react';
import { TransactionAction } from '@/01_types/exchange/common';
import { Spend } from '@/02_common/react/spend';
import { Transaction, TransactionRecord } from '@/07_stores/transaction';
import { useTransactionRecords } from '../stores/transaction';

export type MarkAction<T> = {
    actions: T[];
    title: string;
    description?: string;
};

// 复杂交易执行的动作记录

function useActionSteps<T>(action: T): {
    show: boolean;
    hide: () => void;
    failed: boolean;
    fail: () => void;
} {
    const [last, setLast] = useState<T | undefined>(undefined);
    const [show, setShow] = useState(false);
    const [failed, setFailed] = useState(false);
    useEffect(() => {
        if (last === action) return;
        if (last === undefined && action !== undefined) {
            setShow(true);
            setFailed(false);
        }
        setLast(action);
    }, [last, action]);
    const hide = useCallback(() => setShow(false), [setShow]);
    const fail = useCallback(() => setFailed(true), [setFailed]);

    return {
        show,
        hide,
        failed,
        fail,
    };
}
export function useTransactionProcess<T>({
    record,
    actions,
}: {
    record: TransactionRecord;
    actions: MarkAction<T>[];
}): { action: T | undefined; done: number; title: string } {
    const transaction = record.transaction;
    const action = useMemo(() => {
        if (transaction.actions.length === 0) return undefined;
        const action = transaction.actions[transaction.actions.length - 1].action as T;
        let next: T = undefined as T;
        for (let i = actions.length - 1; 0 <= i; i--) {
            if (actions[i].actions.includes(action)) return next;
            next = actions[i].actions[0];
        }
    }, [record, actions, transaction.actions.length]);

    const { done, title } = useMemo(() => {
        if (record.status === 'successful') return { done: 1, title: 'Done' };
        const index = actions.findIndex((a) => a.actions.includes(action as T));
        return {
            done: Number((Math.max(index, 0) / actions.length).toFixed(2)),
            title: record.stopped ? 'Stopped' : index === -1 ? 'Started' : actions[index].title,
        };
    }, [record, action, actions]);
    return { action, done, title };
}

export function useLatestAction<T extends Transaction, U>(id: string | undefined): U {
    const { record } = useTransactionRecords(id);
    const action = useMemo(() => {
        if (record === undefined) return undefined;
        const transaction = record.transaction as T;
        const actions = transaction.actions;
        if (actions.length === 0) return undefined;
        return actions[actions.length - 1].action;
    }, [record]);
    return action as U;
}

type DoActionFuncs<T, D> = {
    fetch_action: (action: TransactionAction<T, D>) => Promise<D>;
    do_action: () => Promise<D>;
    set_action_done: () => void;
    spend: Spend;
    lark_notice_before: (action: T) => number;
    lark_notice_after: (now: number, action: T, data?: any) => void;
};

export function useDoAction<T, D>(): (
    action: T,
    transaction: Transaction,
    args: DoActionFuncs<T, D>,
) => Promise<D> {
    return useCallback((action: T, transaction: Transaction, args: DoActionFuncs<T, D>) => {
        const {
            fetch_action,
            do_action,
            set_action_done,
            spend,
            lark_notice_before,
            lark_notice_after,
        } = args;
        return new Promise((resolve, reject) => {
            const action_with_data = transaction.actions.find((a) => a.action === action);
            if (action_with_data) {
                spend.mark(`already done ${action}`);
                fetch_action(action_with_data as TransactionAction<T, D>)
                    .then(resolve)
                    .catch(reject);
            } else {
                const now = lark_notice_before(action);
                set_action_done();
                do_action()
                    .then((d) => {
                        lark_notice_after(now, action, d ?? undefined);
                        resolve(d);
                    })
                    .catch(reject);
            }
        });
    }, []);
}

export default useActionSteps;

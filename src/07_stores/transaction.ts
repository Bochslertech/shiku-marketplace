import { nanoid } from 'nanoid';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { BatchBuyingTransaction } from '@/01_types/exchange/batch-buy';
import { BatchBuyingGoldTransaction } from '@/01_types/exchange/batch-buy-gold';
import { BatchSellingTransaction } from '@/01_types/exchange/batch-sell';
import { SingleBuyTransaction } from '@/01_types/exchange/single-buy';
import { SingleSellTransaction } from '@/01_types/exchange/single-sell';
import { SingleTransferTransaction } from '@/01_types/exchange/single-transfer';
import { isSame } from '@/02_common/data/same';
import { getBackendType } from '@/05_utils/app/backend';
import { isDevMode } from '@/05_utils/app/env';

const isDev = isDevMode();

// =========================== 交易记录相关数据持久化 ===========================

export type Transaction =
    | SingleBuyTransaction
    | SingleSellTransaction
    | SingleTransferTransaction
    | BatchBuyingTransaction
    | BatchBuyingGoldTransaction
    | BatchSellingTransaction;

export type TransactionRecord = {
    id: string; // 唯一 id
    created: number; // 创建时间, 排序使用
    principal: string; // 身份, 不同身份的记录
    transaction: Transaction;
    stopped: boolean; // 是否停止执行
    status?: 'executing' | 'successful' | 'failed';
    message?: string; // 错误信息
    modal: boolean; // 是否弹窗展示详情
};

export type RefreshFlags =
    | SingleBuyTransaction['type']
    | SingleSellTransaction['type']
    | SingleTransferTransaction['type']
    | BatchBuyingTransaction['type']
    | BatchBuyingGoldTransaction['type']
    | BatchSellingTransaction['type'];

const hasSameTransaction = (
    records: TransactionRecord[],
    principal: string,
    transaction: Transaction,
    duration: number,
): boolean => {
    const transactions = records.filter(
        (r) => r.principal === principal && isSame(r.transaction.args, transaction.args),
    );
    const now = Date.now();
    for (const t of transactions) {
        if (now < t.created + duration) return true;
    }
    return false;
};

interface TransactionState {
    // 交易记录 // ! 注意记录是按照后端类型区分的, 使用 useTransactionRecords hooks
    records: Record<string, TransactionRecord[]>;
    flag: number;
    insert: (principal: string, transaction: Transaction) => Promise<string>;
    update: (
        id: string,
        transaction: Transaction,
        status: 'executing' | 'successful' | 'failed',
        message?: string,
    ) => Promise<void>;
    remove: (id: string) => Promise<void>;
    stop: (id: string) => void;
    go_on: (id: string) => void;
    toggle: (id: string) => void;
    refreshFlags: Record<RefreshFlags, number>;
    triggerRefresh: (type: RefreshFlags) => void;
}

export const useTransactionStore = create<TransactionState>()(
    devtools(
        persist(
            (set, get) => ({
                // showRecorder: false,
                // setShowRecorder: (show: boolean) => set({ showRecorder: show }),

                // 交易记录
                records: {},
                flag: 0,
                insert: async (principal: string, transaction: Transaction) => {
                    const backendType = getBackendType();
                    if (!get().records[backendType])
                        set({ records: { ...get().records, [backendType]: [] } });
                    const records = get().records[backendType];
                    if (hasSameTransaction(records, principal, transaction, 5000)) {
                        throw new Error(`already submitting`); // 5 秒内有相同的订单就不允许再次提交
                    }
                    const id = nanoid();
                    records.push({
                        id,
                        created: Date.now(),
                        principal,
                        transaction,
                        stopped: false,
                        modal: false,
                    });
                    set({ records: { ...get().records, [backendType]: records } });
                    return id;
                },
                update: async (
                    id: string,
                    transaction: Transaction,
                    status: 'executing' | 'successful' | 'failed',
                    message?: string,
                ) => {
                    const backendType = getBackendType();
                    if (!get().records[backendType])
                        set({ records: { ...get().records, [backendType]: [] } });
                    const records = get().records[backendType];
                    const record = records.find((r) => r.id === id);
                    if (record === undefined) {
                        console.debug(`update:can not find transaction by id: ${id}`);
                        return;
                    }
                    // transaction引用需要变
                    record.transaction = { ...transaction };
                    record.status = status;
                    record.message = message;
                    if (status === 'successful') set({ flag: get().flag + 1 });
                    set({ records: { ...get().records } });
                },
                remove: async (id: string) => {
                    const backendType = getBackendType();
                    if (!get().records[backendType])
                        set({ records: { ...get().records, [backendType]: [] } });
                    let records = get().records[backendType];
                    const record = records.find((r) => r.id === id);
                    if (record === undefined) {
                        console.debug(`remove:can not find transaction by id: ${id}`);
                        return;
                    }
                    records = records.filter((r) => r.id !== id);
                    set({ records: { ...get().records, [backendType]: records } });
                },
                stop: (id: string) => {
                    const backendType = getBackendType();
                    if (!get().records[backendType])
                        set({ records: { ...get().records, [backendType]: [] } });
                    const records = get().records[backendType];
                    const record = records.find((r) => r.id === id);
                    if (record === undefined) {
                        console.debug(`remove:can not find transaction by id: ${id}`);
                        return;
                    }
                    record.stopped = true; // 停止
                    set({ records: { ...get().records, [backendType]: records } });
                },
                go_on: (id: string) => {
                    const backendType = getBackendType();
                    if (!get().records[backendType])
                        set({ records: { ...get().records, [backendType]: [] } });
                    const records = get().records[backendType];
                    const record = records.find((r) => r.id === id);
                    if (record === undefined) {
                        console.debug(`go_on:can not find transaction by id: ${id}`);
                        return;
                    }
                    record.stopped = false; // 继续
                    set({ records: { ...get().records, [backendType]: records } });
                },
                toggle: (id: string) => {
                    const backendType = getBackendType();
                    if (!get().records[backendType])
                        set({ records: { ...get().records, [backendType]: [] } });
                    const records = get().records[backendType];
                    const record = records.find((r) => r.id === id);
                    if (record === undefined) {
                        // throw new Error(`can not find transaction by id: ${id}`);
                        return;
                    }
                    record.modal = !record.modal;
                    set({ records: { ...get().records, [backendType]: records } });
                },
                refreshFlags: {
                    'single-buy': 0,
                    'single-sell': 0,
                    'single-transfer': 0,
                    'batch-buy': 0,
                    'batch-buy-gold': 0,
                    'batch-sell': 0,
                },
                triggerRefresh: (type: RefreshFlags) => {
                    const refreshFlags = get().refreshFlags;
                    refreshFlags[type]++;
                    set({ refreshFlags });
                },
            }),
            {
                name: '__yumi_transactions__',
            },
        ),
        {
            enabled: isDev,
        },
    ),
);

isDev && mountStoreDevtool('TransactionStore', useTransactionStore);

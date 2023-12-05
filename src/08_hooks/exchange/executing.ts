// =============== 执行交易必须唯一 ===============

const executing: Record<string, boolean> = {};

export const transaction_executing = (id: string): boolean => {
    const value = executing[id];
    if (value === true) return false;
    executing[id] = true;
    return true;
};

export const transaction_executed = (id: string): void => {
    delete executing[id];
};

export const is_transaction_executing = (id: string): boolean => !!executing[id];

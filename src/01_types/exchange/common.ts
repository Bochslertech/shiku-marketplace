export type TransactionAction<T, U> = {
    action: T;
    timestamp: number;
    data?: U;
};
// 收集用户信息
export type UserInfo = {
    wallet: string;
    agent: string;
};

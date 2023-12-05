// 支持的代币
export type SupportedLedgerTokenSymbol = 'ICP' | 'OGY';

// 查询余额
export type LedgerTokenBalance = {
    e8s: string; // ? bigint -> string // bigint 无法序列化
};

// 转账参数
export type LedgerTransferArgs = {
    to: string; // account_hex
    from_subaccount?: number[];
    amount: LedgerTokenBalance; // ? bigint -> string
    fee: LedgerTokenBalance; // ? bigint -> string
    memo: string; // ? bigint -> string
};

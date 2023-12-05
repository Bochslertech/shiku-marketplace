// bigint -> 字符串
export const bigint2string = (n: BigInt): string => `${n}`;

// 字符串 -> bigint
export const string2bigint = (n: string): bigint => BigInt(n);

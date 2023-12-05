export type Option<T> = [] | [T];

// 解包
export const unwrapOption = <T>(v: [] | [T]): T | undefined => (v.length ? v[0] : undefined);
// 解包并映射
export const unwrapOptionMap = <T, R>(v: [] | [T], map: (t: T) => R): R | undefined =>
    v.length ? map(v[0]) : undefined;

// 包装
export const wrapOption = <T>(v?: T): [] | [T] => (v !== undefined ? [v] : []);
// 包装并映射
export const wrapOptionMap = <T, R>(v: T | undefined, map: (t: T) => R): [] | [R] =>
    v !== undefined ? [map(v)] : [];

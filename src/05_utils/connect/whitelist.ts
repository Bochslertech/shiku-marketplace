// ======================== 记录账户的白名单 ========================

const initial: string[] = []; // 初始化白名单

let whitelist: string[] = []; // 已经完成的白名单

// 初始化白名单
export const initWhitelist = (list: string[]) => {
    initial.splice(0, 0, ...list);
    whitelist = [...initial];
};

// 每次登录后需要重置白名单
export const resetWhitelist = () => (whitelist = [...initial]);

// 每次得到新的白名单后, 需要更新记录
export const updateWhitelist = (list: string[]) => whitelist.splice(0, 0, ...list);

// 比较是否需要请求白名单
export const diffWhitelist = (needs: string[]): string[] =>
    needs.filter((canister_id) => !whitelist.includes(canister_id));

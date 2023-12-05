import { isPrincipalText } from '@/02_common/ic/principals';
import { ProfileLet } from '@/03_canisters/yumi/yumi_core';
import { queryProfileByAccountHex, queryProfileByPrincipal } from '../canisters/yumi/core';
import { MemoryStore } from '../stored';

// =============== 用户 Profile 信息代理缓存 ===============
// ! 内存中保留
const user_profile_memory = new MemoryStore<ProfileLet>(
    1000 * 60 * 60 * 24 * 365, // * 1 年
    false, // 不需要随机
);
const failed_user_profile_memory = new MemoryStore<true>(
    1000 * 60, // * 1 分钟
    false, // 不需要随机
);
export const getUserProfile = async (
    principal_or_account?: string,
): Promise<ProfileLet | undefined> => {
    if (principal_or_account === undefined) return undefined;
    const failed = failed_user_profile_memory.getItem(principal_or_account);
    if (failed !== undefined) return undefined;
    let cached = user_profile_memory.getItem(principal_or_account);
    if (cached === undefined) {
        cached = await new Promise<ProfileLet | undefined>((resolve) => {
            const query = isPrincipalText(principal_or_account)
                ? queryProfileByPrincipal(principal_or_account)
                : queryProfileByAccountHex(principal_or_account);
            query.then(resolve).catch(() => resolve(undefined));
        });
        if (cached === undefined) {
            failed_user_profile_memory.setItem(principal_or_account, true);
            return undefined;
        }
        if (cached.principal) user_profile_memory.setItem(cached.principal, cached);
        user_profile_memory.setItem(cached.account, cached);
    }
    return cached;
};

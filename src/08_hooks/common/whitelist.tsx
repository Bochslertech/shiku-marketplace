import _ from 'lodash';
import { ConnectedIdentity } from '@/01_types/identity';
import { diffWhitelist, updateWhitelist } from '@/05_utils/connect/whitelist';

// 检查白名单
export const checkWhitelist = async (
    identity: ConnectedIdentity,
    whitelist: string[],
): Promise<void> => {
    whitelist = whitelist.filter((canister_id) => !!canister_id); // 有可能是空的, 所以要过滤
    if (whitelist.length === 0) return;

    whitelist = _.uniq(whitelist);
    const needs = diffWhitelist(whitelist); // 过滤需要白名单的罐子
    if (needs.length === 0) return;

    try {
        const passed = await identity.requestWhitelist(needs);
        if (!passed) throw new Error();
    } catch (e) {
        console.debug(`🚀 ~ file: whitelist.tsx:23 ~ e:`, e);
        throw new Error(`The required permissions were rejected.`);
    }
    updateWhitelist(whitelist); // 新增新的白名单
};

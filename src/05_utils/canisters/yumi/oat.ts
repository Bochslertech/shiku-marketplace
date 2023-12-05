import * as oat from '@/03_canisters/yumi/yumi_oat';
import { ConnectedIdentity } from '@/01_types/identity';
import { OatCollectionEvent, OatProject, OatWhitelist } from '@/03_canisters/yumi/yumi_oat';
import { anonymous } from '../../connect/anonymous';
import { getYumiOatCanisterId } from './special';

// ===================== OAT Event 状态 =====================

export type OatEventStatus = 'warm-up' | 'active' | 'warm-up' | 'ended';

export const getOatEventStatus = (event: OatCollectionEvent): OatEventStatus => {
    const now = BigInt(Date.now() * 1e6);
    const { event_start, event_end, oat_release_start, oat_release_end } = event;
    if (now < BigInt(event_start)) {
        return 'warm-up'; // Event Start Time前为活动的未开始时间
    } else if (BigInt(oat_release_start) <= now && now < BigInt(oat_release_end)) {
        return 'active'; // 在Event End Time之后到OAT Published End Time前为OAT可领取时间
    } else if (BigInt(event_start) <= now && now < BigInt(event_end)) {
        return 'warm-up'; // 在Event Start Time之后到Event End Tim前时间段为活动的运营时间
    } else if (BigInt(event_end) <= now && now < BigInt(oat_release_start)) {
        return 'warm-up'; // 即将可领取
    } else if (BigInt(oat_release_end) <= now) {
        return 'ended'; // 在OAT Published End Time之后为OAT关闭时间
    }
    return 'ended';
};

// ===================== 查询 OAT 列表 =====================

export const queryAllOatCollectionEventList = async (): Promise<OatCollectionEvent[]> => {
    const backend_canister_id = getYumiOatCanisterId();
    return oat.queryAllOatCollectionEventList(anonymous, backend_canister_id);
};

// ===================== 根据 id 查询 OAT =====================

export const queryOatCollectionEventsByEventId = async (
    event_id_list: string[],
): Promise<OatCollectionEvent[]> => {
    const backend_canister_id = getYumiOatCanisterId();
    return oat.queryOatCollectionEventsByEventId(anonymous, backend_canister_id, event_id_list);
};

// ===================== 根据 project id 查询 OAT =====================

export const queryOatCollectionEventsByProjectId = async (
    project_id: string,
): Promise<OatCollectionEvent[]> => {
    const backend_canister_id = getYumiOatCanisterId();
    return oat.queryOatCollectionEventsByProjectId(anonymous, backend_canister_id, project_id);
};

// ===================== 查询 项目信息 =====================

export const queryOatProjectsByProjectId = async (
    project_id_list: string[],
): Promise<OatProject[]> => {
    const backend_canister_id = getYumiOatCanisterId();
    return oat.queryOatProjectsByProjectId(anonymous, backend_canister_id, project_id_list);
};

// ===================== 查询 是否有权限索要 NFT =====================

export const queryClaimableByUser = async (
    identity: ConnectedIdentity,
    event_id: string,
): Promise<boolean> => {
    const backend_canister_id = getYumiOatCanisterId();
    return oat.queryClaimableByUser(identity, backend_canister_id, event_id);
};

// ===================== 索要 NFT =====================

export const claimOatNFT = async (
    identity: ConnectedIdentity,
    event_id: string,
): Promise<string> => {
    const backend_canister_id = getYumiOatCanisterId();
    return oat.claimOatNFT(identity, backend_canister_id, event_id);
};

// // ======================== OAT 加白名单 ========================

// export const oatAddWhitelist = async (
//     identity: ConnectedIdentity,
//     args: {
//         event_id: string;
//         account_list: string[];
//     },
// ): Promise<void> => {
//     const backend_canister_id = getYumiOatCanisterId();
//     return oat.oatAddWhitelist(identity, backend_canister_id, args);
// };

// ======================== OAT 查询白名单 ========================

export const queryOatWhitelist = async (collection: string): Promise<OatWhitelist[]> => {
    const backend_canister_id = getYumiOatCanisterId();
    return oat.queryOatWhitelist(anonymous, backend_canister_id, collection);
};

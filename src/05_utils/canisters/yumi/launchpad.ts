import * as launchpad from '@/03_canisters/yumi/yumi_launchpad';
import { ConnectedIdentity } from '@/01_types/identity';
import {
    AllLaunchpadCollections,
    LaunchpadCollectionInfo,
} from '@/03_canisters/yumi/yumi_launchpad';
import { anonymous } from '../../connect/anonymous';
import { getYumiLaunchpadCanisterId } from './special';

// ======================== 查询 Launchpad 的项目 ========================

export const queryAllLaunchpadCollections = async (): Promise<LaunchpadCollectionInfo[]> => {
    const backend_canister_id = getYumiLaunchpadCanisterId();
    return launchpad.queryAllLaunchpadCollections(anonymous, backend_canister_id);
};
export const queryAllLaunchpadCollectionsWithStatus =
    async (): Promise<AllLaunchpadCollections> => {
        const backend_canister_id = getYumiLaunchpadCanisterId();
        return launchpad.queryAllLaunchpadCollectionsWithStatus(anonymous, backend_canister_id);
    };

export const querySingleLaunchpadCollectionInfo = async (
    collection: string,
): Promise<LaunchpadCollectionInfo | undefined> => {
    const backend_canister_id = getYumiLaunchpadCanisterId();
    return launchpad.querySingleLaunchpadCollectionInfo(anonymous, backend_canister_id, collection);
};

// ======================== 查询 Launchpad 的项目 用户最大可购买数量 ========================

export const queryWhitelistUserRemainAmount = async (
    identity: ConnectedIdentity,
    args: {
        collection: string;
        whitelist_limit: string; // 白名单数量限制
        supply: string; // 总供应量
        remain: string; // 当前 NFT 剩下的量
        whitelist_supply: string; // 白名单总供应量
    },
): Promise<number> => {
    const backend_canister_id = getYumiLaunchpadCanisterId();
    return launchpad.queryWhitelistUserRemainAmount(identity, backend_canister_id, args);
};

// ======================== 查询 Launchpad 的项目 用户最大可购买数量 ========================

export const queryOpenUserRemainAmount = async (
    identity: ConnectedIdentity,
    args: {
        collection: string;
        open_limit: string; // 公售数量限制
        supply: string; // 总供应量
        remain: string; // 当前 NFT 剩下的量
        open_supply: string; // 公售总供应量
    },
): Promise<number> => {
    const backend_canister_id = getYumiLaunchpadCanisterId();
    return launchpad.queryOpenUserRemainAmount(identity, backend_canister_id, args);
};

// ======================== 充钱后取回应得的NFT ========================

export const claimLaunchpadNFT = async (
    identity: ConnectedIdentity,
    height: string,
): Promise<number[]> => {
    const backend_canister_id = getYumiLaunchpadCanisterId();
    return launchpad.claimLaunchpadNFT(identity, backend_canister_id, height);
};

// // ======================== Launchpad 加白名单 ========================

// export const launchpadAddWhitelist = async (
//     identity: ConnectedIdentity,
//     args: {
//         collection: string;
//         account_list: string[];
//     },
// ): Promise<void> => {
//     const backend_canister_id = getYumiLaunchpadCanisterId();
//     return launchpad.launchpadAddWhitelist(identity, backend_canister_id, args);
// };

// ======================== Launchpad 查询加白名单 ========================

export const queryLaunchpadWhitelist = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<number> => {
    const backend_canister_id = getYumiLaunchpadCanisterId();
    return launchpad.queryLaunchpadWhitelist(identity, backend_canister_id, collection);
};

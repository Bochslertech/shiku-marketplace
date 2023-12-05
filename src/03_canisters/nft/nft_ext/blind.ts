import { ConnectedIdentity } from '@/01_types/identity';
import { NftTokenMetadata } from '@/01_types/nft';
import * as blind from './ext_blind';

// ===================== 查询开启时间 =====================

export const queryBlindBoxOpenTime = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<string> => {
    return blind.queryBlindBoxOpenTime(identity, collection);
};

// ===================== 打开盲盒 =====================

export const openBlindBox = async (
    identity: ConnectedIdentity,
    collection: string,
    token_identifier: string,
): Promise<NftTokenMetadata> => {
    return blind.openBlindBox(identity, collection, token_identifier);
};

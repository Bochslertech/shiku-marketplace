import { ConnectedIdentity } from '@/01_types/identity';
import { NftTokenMetadata } from '@/01_types/nft';
import { bigint2string } from '@/02_common/types/bigint';
import { unwrapOption } from '@/02_common/types/options';
import { unwrapMotokoResultMap } from '@/02_common/types/results';
import { throwsBy, unwrapVariant2Map } from '@/02_common/types/variant';
import { parseExtTokenMetadata } from '..';
import idlFactory from './ext_blind.did';
import _SERVICE, { CommonError, Metadata } from './ext_blind.did.d';

// ===================== 查询开启时间 =====================

export const queryBlindBoxOpenTime = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.getOpenTime();
    return bigint2string(r);
};

// ===================== 打开盲盒 =====================

export const openBlindBox = async (
    identity: ConnectedIdentity,
    collection: string,
    token_identifier: string,
): Promise<NftTokenMetadata> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const result = await actor.open(token_identifier);
    const metadata = unwrapMotokoResultMap<Metadata, CommonError, number[] | undefined>(
        result,
        (data) => {
            return unwrapVariant2Map(
                data,
                ['fungible', throwsBy(`fungible token is not support`)],
                ['nonfungible', (n) => unwrapOption(n.metadata)],
            );
        },
        (e) => {
            if (e['InvalidToken']) throw new Error(`InvalidToken: ${e['InvalidToken']}`);
            if (e['Other']) throw new Error(`Other: ${e['Other']}`);
            throw new Error(`open blind box failed`);
        },
    );
    return parseExtTokenMetadata(collection, token_identifier, metadata);
};

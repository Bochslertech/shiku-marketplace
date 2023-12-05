import { NftMetadata } from '@/01_types/nft';
import { CANISTER_QUERY_HOST } from '../host';
import { canister_query } from '../query';

export const canisterQueryOrigynArtCardsByStored = async (
    collection: string,
): Promise<NftMetadata[] | undefined> =>
    canister_query(`${CANISTER_QUERY_HOST}/origyn/art/${collection}/cards`);

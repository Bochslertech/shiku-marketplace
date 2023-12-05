import { NftIdentifier } from '@/01_types/nft';
import { parse_token_index_with_checking } from './ext';

// 是否相等
export const isSameNft = (a: NftIdentifier, b: NftIdentifier) =>
    a.collection === b.collection && a.token_identifier === b.token_identifier;

// 是否相等
export const isSameNftByTokenId = (
    a: { token_id: NftIdentifier },
    b: { token_id: NftIdentifier },
) => isSameNft(a.token_id, b.token_id);

// 字符串化, 具有唯一性
export const uniqueKey = (token_id: NftIdentifier) =>
    `${token_id.collection}/${token_id.token_identifier}`;

// 解析出 token_index // ogy 的不可解析
export const parseTokenIndex = (token_id: NftIdentifier): number =>
    parse_token_index_with_checking(token_id.collection, token_id.token_identifier);

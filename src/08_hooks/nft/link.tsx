import { NftMetadata } from '@/01_types/nft';
import { parse_token_index } from '@/02_common/nft/ext';
import { uniqueKey } from '@/02_common/nft/identifier';
import { NFT_OGY_ART, NFT_SHIKU_LAND } from '@/03_canisters/nft/special';
import { getNftPathByNftMetadata } from '@/05_utils/nft/metadata';
import { useArtistCollectionIdList, useOrigynArtCollectionIdList } from './collection';

// NFT 的跳转目录
export const useNftPath = (card: NftMetadata): string => {
    // shiku 的罐子要进入 shiku
    if (NFT_SHIKU_LAND.includes(card.owner.token_id.collection)) {
        return `/shiku/${parse_token_index(card.owner.token_id.token_identifier)}`;
    }
    // origyn art 的罐子要进入 origyn art
    if (NFT_OGY_ART.includes(card.owner.token_id.collection)) {
        return `/origyn/art/${uniqueKey(card.owner.token_id)}`;
    }

    const artistCollectionIdList = useArtistCollectionIdList();
    const origynArtCollectionIdList = useOrigynArtCollectionIdList();
    const path =
        artistCollectionIdList && origynArtCollectionIdList
            ? getNftPathByNftMetadata(card, artistCollectionIdList, origynArtCollectionIdList)
            : '';
    return path;
};

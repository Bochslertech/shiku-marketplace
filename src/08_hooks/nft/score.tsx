import { useEffect, useState } from 'react';
import { NftMetadata, NftTokenScore } from '@/01_types/nft';
import { isSame } from '@/02_common/data/same';
import { isSameNftByTokenId } from '@/02_common/nft/identifier';
import { getTokenOwners, getTokenScores } from '@/05_utils/combined/collection';

// NFT 稀有度
// 如果返回 undefined, 则说明没有数据, 就不处理
// 有很多 NFT 就是没有稀有度数据的
export const useNftScore = (
    card: NftMetadata,
    updateItem?: (card: NftMetadata) => void,
): NftTokenScore | undefined => {
    const [score, setScore] = useState<NftTokenScore | undefined>(card.score);
    useEffect(() => {
        if (card.score !== undefined && isSame(score, card.score)) setScore(card.score);
    }, [card, score]);

    // 包装一下更新方法, 可能需要通知上级
    const setScoreAndUpdate = (score: NftTokenScore) => {
        if (isSame(card.score, score)) return;
        setScore(score);
        card.score = score;
        updateItem && updateItem(card);
    };

    // 加载内容
    useEffect(() => {
        if (score !== undefined) return;
        getTokenOwners(card.metadata.token_id.collection, 'stored_remote').then((token_owners) => {
            if (token_owners) {
                getTokenScores(card.metadata.token_id.collection, {
                    from: 'stored_remote',
                    token_owners,
                }).then((scores) => {
                    if (scores) {
                        const score = scores.find((s) => isSameNftByTokenId(s, card.metadata));
                        if (score) setScoreAndUpdate(score);
                    }
                });
            }
        });
    }, [card, score]);

    return score;
};

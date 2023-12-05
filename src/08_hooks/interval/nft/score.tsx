import { useCallback, useEffect, useState } from 'react';
import { NftIdentifier, NftTokenScore } from '@/01_types/nft';
import { NftMetadata } from '@/01_types/nft';
import { isSameNft, isSameNftByTokenId } from '@/02_common/nft/identifier';
import { FirstRenderByData } from '@/02_common/react/render';
import { getTokenOwners, getTokenScores } from '@/05_utils/combined/collection';

export const useNftScore = (
    card: NftMetadata | undefined,
    // delay = 15000, // 不需要轮询
): {
    score: NftTokenScore | undefined;
    scores: NftTokenScore[] | undefined;
    refresh: () => void;
} => {
    const [score, setScore] = useState<NftTokenScore | undefined>(card?.score);
    const [scores, setScores] = useState<NftTokenScore[] | undefined>(undefined);

    // 加载上架信息
    const refresh = useCallback(() => {
        if (card === undefined) return;
        const collection = card.owner.token_id.collection;
        getTokenOwners(collection, 'stored_remote').then((token_owners) => {
            if (token_owners) {
                getTokenScores(collection, {
                    from: 'stored_remote',
                    token_owners,
                }).then((scores) => {
                    if (scores) {
                        const score = scores.find((s) => isSameNftByTokenId(s, card.metadata));
                        card.score = score;
                        setScore(score);
                        setScores(scores);
                    }
                });
            }
        });
    }, [card]);

    // 先执行一次
    const [once_check_score] = useState(new FirstRenderByData());
    useEffect(() => {
        once_check_score.once(card && [card.owner.token_id], refresh);
    }, [card]);

    // 定时刷新 // ? 不需要轮询
    // useInterval(refresh, delay); // 定时刷新价格

    return { score, scores, refresh };
};

export const useNftScoreByNftIdentifier = (
    token_id: NftIdentifier | undefined,
    // delay = 15000, // 不需要轮询
): {
    score: NftTokenScore | undefined;
    scores: NftTokenScore[] | undefined;
    refresh: () => void;
} => {
    const { collection, token_identifier }: { collection?: string; token_identifier?: string } =
        token_id ? token_id : {};

    const [score, setScore] = useState<NftTokenScore | undefined>(undefined);
    const [scores, setScores] = useState<NftTokenScore[] | undefined>(undefined);

    // 加载上架信息
    const refresh = useCallback(() => {
        if (!collection || !token_identifier) return;
        getTokenOwners(collection, 'stored_remote').then((token_owners) => {
            if (token_owners) {
                getTokenScores(collection, {
                    from: 'stored_remote',
                    token_owners,
                }).then((scores) => {
                    const token_id = { collection, token_identifier };
                    if (scores) {
                        const score = scores.find((s) => isSameNft(s.token_id, token_id));
                        setScore(score);
                        setScores(scores);
                    }
                });
            }
        });
    }, [collection, token_identifier]);

    // 先执行一次
    const [once_check_score] = useState(new FirstRenderByData());
    useEffect(() => {
        once_check_score.once([collection, token_identifier], refresh);
    }, [collection, token_identifier]);

    // 定时刷新 // ? 不需要轮询
    // useInterval(refresh, delay); // 定时刷新价格

    return { score, scores, refresh };
};

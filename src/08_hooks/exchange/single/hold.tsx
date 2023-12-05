import { useCallback, useState } from 'react';
import { message } from 'antd';
import { HoldingAction, HoldingNftExecutor } from '@/01_types/exchange/single-hold';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftTokenOwner } from '@/01_types/nft';
import { uniqueKey } from '@/02_common/nft/identifier';
import { Spend } from '@/02_common/react/spend';
import { retrieveNftFromListingByOgy } from '@/03_canisters/nft/nft_ogy';
import { cancelListing } from '@/05_utils/canisters/yumi/core';
import { useCheckAction } from '../../common/action';
import { checkWhitelist } from '../../common/whitelist';

export const useHoldNft = (): {
    hold: HoldingNftExecutor;
    action: HoldingAction;
} => {
    const checkAction = useCheckAction();

    // 标记当前状态
    const [action, setAction] = useState<HoldingAction>(undefined);

    const hold = useCallback(
        async (identity: ConnectedIdentity, owner: NftTokenOwner): Promise<boolean> => {
            checkAction(action, `Holding`); // 防止重复点击

            setAction('DOING');
            try {
                // ? 0. 检查白名单
                await checkWhitelist(identity, [
                    owner.raw.standard === 'ogy' ? owner.token_id.collection : '',
                ]);

                const spend = Spend.start(`hold nft ${uniqueKey(owner.token_id)}`);

                // ? 1. OGY 需要取消
                await doCancel(setAction, identity, owner, spend);
                if (owner.raw.standard === 'ogy') return true; // * 如果是 OGY， 就已经完成了

                // ? 2. 进行转移
                await doHold(setAction, identity, owner, spend);

                // ? 3. 圆满完成
                return true;
            } catch (e) {
                console.debug(`🚀 ~ file: hold.tsx:54 ~ e:`, e);
                message.error(`Hold NFT failed: ${e}`);
            } finally {
                setAction(undefined); // 恢复状态
            }
            return false;
        },
        [action],
    );

    return { hold, action };
};

const doCancel = async (
    setAction: (action: HoldingAction) => void,
    identity: ConnectedIdentity,
    owner: NftTokenOwner,
    spend: Spend,
): Promise<void> => {
    setAction('CANCELLING');
    await cancel(identity, owner, setAction, spend);
    spend.mark(`CANCELLING DONE`);
};

// 某些 NFT 需要先取消下架
const cancel = async (
    identity: ConnectedIdentity,
    owner: NftTokenOwner,
    setAction: (action: HoldingAction) => void,
    spend: Spend,
): Promise<void> => {
    if (owner.raw.standard === 'ogy') {
        // ? OGY
        setAction('CANCELLING_OGY');
        const cancel = await retrieveNftFromListingByOgy(
            identity,
            owner.token_id.collection,
            owner.token_id.token_identifier,
        );
        spend.mark(`CANCELLING_OGY DONE`);
        if (!cancel) throw new Error('Cancel last order failed.');
    }
};

const doHold = async (
    setAction: (action: HoldingAction) => void,
    identity: ConnectedIdentity,
    owner: NftTokenOwner,
    spend: Spend,
): Promise<void> => {
    setAction('HOLDING');
    await cancelListing(identity, owner.token_id.token_identifier);
    spend.mark(`HOLDING DONE`);
};

import { useCallback, useState } from 'react';
import { message } from 'antd';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftIdentifier, NftTokenMetadata } from '@/01_types/nft';
import { uniqueKey } from '@/02_common/nft/identifier';
import { Spend } from '@/02_common/react/spend';
import { openBlindBox } from '@/03_canisters/nft/nft_ext/ext_blind';
import { useCheckAction } from '../common/action';
import { checkWhitelist } from '../common/whitelist';

// 打开状态
export type OpeningBlindBoxAction =
    | undefined // 未开始
    | 'DOING' // 开始打开
    | 'OPENING'; // 1. 打开盲盒

export type OpenBlindBoxNftExecutor = (
    identity: ConnectedIdentity,
    token_id: NftIdentifier, // nft 标识
) => Promise<NftTokenMetadata | undefined>;

export const useOpenBlindBoxNft = (): {
    open: OpenBlindBoxNftExecutor;
    action: OpeningBlindBoxAction;
} => {
    const checkAction = useCheckAction();

    // 标记当前状态
    const [action, setAction] = useState<OpeningBlindBoxAction>(undefined);

    const open = useCallback(
        async (
            identity: ConnectedIdentity,
            token_id: NftIdentifier,
        ): Promise<NftTokenMetadata | undefined> => {
            checkAction(action, `Opening`); // 防止重复点击

            setAction('DOING');
            try {
                // ? 0. 检查白名单
                await checkWhitelist(identity, [token_id.collection]);

                const spend = Spend.start(`open blind box nft ${uniqueKey(token_id)}`);

                // ? 1. 打开盲盒
                const metadata = await doOpenBlindBox(setAction, identity, token_id, spend);

                // ? 2. 圆满完成
                return metadata;
            } catch (e) {
                console.debug(`🚀 ~ file: blind.tsx:46 ~ e:`, e);
                message.error(`Open Blink Box NFT failed: ${e}`);
            } finally {
                setAction(undefined); // 恢复状态
            }
        },
        [action],
    );

    return { open, action };
};

export const doOpenBlindBox = async (
    setAction: (action: OpeningBlindBoxAction) => void,
    identity: ConnectedIdentity,
    token_id: NftIdentifier,
    spend: Spend,
): Promise<NftTokenMetadata | undefined> => {
    setAction('OPENING');
    const metadata = await openBlindBox(identity, token_id.collection, token_id.token_identifier);
    spend.mark(`OPENING DONE`);

    return metadata;
};

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NftIdentifier } from '@/01_types/nft';
import { exponentNumber } from '@/02_common/data/numbers';
import { principal2account } from '@/02_common/ic/account';
import { Spend } from '@/02_common/react/spend';
import { MintingNFT } from '@/03_canisters/yumi/yumi_artist_router';
import { icpAccountBalance } from '@/05_utils/canisters/ledgers/icp';
import {
    createArtistCollection,
    getAllArtists,
    mintArtistNFT,
    queryMintingFee,
    queryUserArtistCollection,
} from '@/05_utils/canisters/yumi/artist_router';
import { getYumiArtistRouterCanisterId } from '@/05_utils/canisters/yumi/special';
import { useIdentityStore } from '@/07_stores/identity';
import { useMessage } from '../common/message';
import { useTransferByICP } from '../ledger/transfer';

export type MintingArtistNftAction =
    | undefined // 未开始
    | 'DOING' // 开始
    | 'CHECKING_FEE' // 1. 获取费用
    | 'CHECKING_BALANCE' // 2. 检查余额是否充足
    | 'PAY' // 3. 付款
    | 'CHECKING_COLLECTION' // 4. 获取当前用户的罐子
    | 'CREATING_COLLECTION_CREATING' // 5. 如果没有用户罐子, 应当创建
    | 'MINTING'; // 6. 进行铸造NFT

// 艺术家铸造 NFT 接口
export type ArtistMintNftExecutor = (metadata: MintingNFT) => Promise<NftIdentifier | undefined>;

// 铸造 NFT
export const useMintArtistNft = (): {
    mint: ArtistMintNftExecutor;
    action: MintingArtistNftAction;
} => {
    const message = useMessage();

    const { balance, fee, decimals, transfer } = useTransferByICP();
    const [action, setAction] = useState<MintingArtistNftAction>(undefined);
    const navigate = useNavigate();
    const identity = useIdentityStore((s) => s.connectedIdentity);

    const mint = useCallback(
        async (metadata: MintingNFT): Promise<NftIdentifier | undefined> => {
            console.debug('🚀 ~ file: artist.tsx:51 ~ metadata:', metadata);
            if (!identity) {
                navigate('/connect');
                return undefined; // 未登录
            }
            if (action !== undefined) {
                message.warning(`Minting`);
                return undefined; // 防止重复点击
            }

            setAction('DOING');
            try {
                const spend = Spend.start(`mint art start`);

                // ? 1. 获取费用
                setAction('CHECKING_FEE');
                const mintFee = await queryMintingFee();
                spend.mark(`CHECKING_FEE DONE: ${mintFee}`);

                // ? 2. 检查余额
                setAction('CHECKING_BALANCE');
                const e8s = balance?.e8s ?? (await icpAccountBalance(identity.account)).e8s; // 没有余额的话, 就主动获取一下吧
                const need = BigInt(mintFee) + BigInt(fee);
                console.debug('🚀 ~ file: artist.tsx:75 ~ need:', need);
                if (BigInt(e8s) < need)
                    throw new Error(
                        `Insufficient balance.(needs ${exponentNumber(`${need}`, -decimals)}ICP)`,
                    );
                spend.mark(`CHECKING_BALANCE DONE: ${need} < ${e8s}`);

                // ? 3. 付款
                setAction('PAY');
                const artist_router = getYumiArtistRouterCanisterId();
                const height = await transfer({
                    to: principal2account(artist_router),
                    amount: `${mintFee}`,
                });
                spend.mark(`PAY DONE: ${height}`);

                // ? 4. 获取当前用户的罐子
                setAction('CHECKING_COLLECTION');
                let collection = await queryUserArtistCollection(identity.principal);
                spend.mark(`CHECKING_COLLECTION DONE: ${collection}`);

                // ? 5. 如果没有用户罐子, 应当创建
                if (collection === undefined) {
                    setAction('CREATING_COLLECTION_CREATING');
                    collection = await createArtistCollection(identity, {});
                    spend.mark(`CREATING_COLLECTION_CREATING DONE: ${collection}`);
                    if (collection === undefined) throw new Error(`create user collection failed`);
                }

                // ? 6. 进行铸造NFT
                setAction('MINTING');
                const token_id = await mintArtistNFT(identity, {
                    collection,
                    to: identity.principal,
                    height,
                    metadata,
                });
                spend.mark(`MINTING DONE`);

                // ? 7. 圆满完成
                return token_id;
            } catch (e) {
                throw new Error(`mint nft failed: ${e}`);
            } finally {
                setAction(undefined); // 恢复状态
            }
        },
        [identity, balance, fee, decimals, transfer, action],
    );

    return { mint, action };
};

// 当前登录用户是否有权限铸造 NFT // 是否艺术家
export const useArtists = (): { artist: boolean } => {
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const [artist, setArtist] = useState(false);
    useEffect(() => {
        if (!identity) return setArtist(false);
        getAllArtists().then((artists) => {
            setArtist(artists.includes(identity.principal));
        });
    }, [identity]);

    return {
        artist,
    };
};

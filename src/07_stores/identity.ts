import { mountStoreDevtool } from 'simple-zustand-devtools';
import { devtools } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { LedgerTokenBalance, SupportedLedgerTokenSymbol } from '@/01_types/canisters/ledgers';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftIdentifier } from '@/01_types/nft';
import { BatchNftSale, KycResult, ShoppingCartItem } from '@/01_types/yumi';
import { parse_nft_identifier } from '@/02_common/nft/ext';
import { isSameNft, isSameNftByTokenId } from '@/02_common/nft/identifier';
import { Spend } from '@/02_common/react/spend';
import { refetch } from '@/02_common/tasks';
import { queryKycResultByPrincipal } from '@/05_utils/apis/yumi/kyc';
import { isDevMode } from '@/05_utils/app/env';
import { icpAccountBalance } from '@/05_utils/canisters/ledgers/icp';
import { ogyAccountBalance } from '@/05_utils/canisters/ledgers/ogy';
import { queryProfileByPrincipal, queryShoppingCart } from '@/05_utils/canisters/yumi/core';
import { queryCreditPointsByPrincipal } from '@/05_utils/canisters/yumi/credit_points';
import { generateJwtToken, queryJwtToken } from '@/05_utils/canisters/yumi/jwt_token';

const isDev = isDevMode();

// 用户个人信息
type IdentityProfile = {
    principal: string | undefined;
    account: string;
    username: string;
    banner: string;
    avatar: string;
    email: string;
    bio: string;
    notification: string[];
};

// 法币modal相关参数
type AddFundsArgs = { type: 'BUY' | 'SELL'; symbol: SupportedLedgerTokenSymbol; amount: string };

// =========================== 用户身份状态 ===========================

interface IdentityState {
    // 用户登录身份
    connectedIdentity?: ConnectedIdentity;
    setConnectedIdentity: (connectedIdentity?: ConnectedIdentity) => void;
    // 用户信息
    identityProfile?: IdentityProfile;
    reloadIdentityProfile: (retry?: number) => Promise<void>;

    // 用户的 jwt_token
    jwt_token?: string;
    reloadJwtToken: (retry?: number) => Promise<void>;

    // icp balance
    icpBalance?: LedgerTokenBalance;
    reloadIcpBalance: () => Promise<void>;
    // ogy balance
    ogyBalance?: LedgerTokenBalance;
    reloadOgyBalance: () => Promise<void>;
    // credit points
    creditPoints?: LedgerTokenBalance;
    reloadCreditPoints: () => Promise<void>;

    // kyc
    kycResult?: KycResult;
    reloadKycResult: () => Promise<void>;
    buyingNft: boolean;
    setBuyingNft: (buyingNft: boolean) => void;

    // favorites
    favorited?: NftIdentifier[];
    reloadFavorited: () => Promise<void>;
    addFavorited: (record: NftIdentifier) => void;
    removeFavorited: (record: NftIdentifier) => void;

    // batch sell
    showBatchSellSidebar: boolean;
    toggleShowBatchSellSidebar: () => void;
    batchSales: BatchNftSale[];
    updateBatchNftSale: (sale: BatchNftSale) => void;
    addBatchNftSale: (sale: BatchNftSale) => void;
    setBatchNftSales: (sale: BatchNftSale[] | undefined) => void;
    removeBatchNftSale: (token_id: NftIdentifier) => void;
    cleanBatchNftSales: () => void;

    // shopping cart
    showShoppingCart: boolean;
    toggleShowShoppingCart: () => void;
    // remote shopping cart
    shoppingCartFlag: number;
    shoppingCartItems?: ShoppingCartItem[];
    reloadShoppingCartItems: () => Promise<void>;
    updateShoppingCartItem: (item: ShoppingCartItem) => void;
    addShoppingCartItem: (item: ShoppingCartItem) => void;
    removeShoppingCartItem: (token: NftIdentifier) => void;
    cleanShoppingCartItems: () => void;
    // gold shopping cart
    goldShoppingCartFlag: number;
    goldShoppingCartItems: ShoppingCartItem[];
    updateGoldShoppingCartItem: (item: ShoppingCartItem) => void;
    addGoldShoppingCartItem: (item: ShoppingCartItem) => void;
    removeGoldShoppingCartItem: (token: NftIdentifier) => void;
    cleanGoldShoppingCartItems: () => void;

    reloadByIdentity: (identity: ConnectedIdentity) => Promise<void>; // 一旦获取到新的登录身份,就要重新获取信息

    // user sidebar
    isUserSidebarOpen: boolean;
    toggleIsUserSidebarIdOpen: () => void;
    addFundsOpen: boolean;
    addFundsArgs?: AddFundsArgs;
    toggleAddFundsOpen: () => void;
    setAddFundArgs: (args: AddFundsArgs) => void;

    // market sweep
    // !sweep不与principal相关，不应该放在这
    sweepMode: boolean;
    toggleSweepMode: () => void;
    sweepGold: boolean;

    sweepItems: Record<string, ShoppingCartItem[]>; // 不同collection
    sweepGoldItems: ShoppingCartItem[];
    setSweepGold: (sweepGold: boolean) => void;
    setSweepItems: (items: ShoppingCartItem[], collection?: string, iGold?: boolean) => void;
    // updateSweepItems: (newItem: ShoppingCartItem) => void;
    // cleanSweepItems: () => void;
    // addSweepItems: (newItem: ShoppingCartItem) => void;
    // removeSweepItems: (token_id: NftIdentifier) => void;
}

const resetConnectedState = (connectedIdentity?: ConnectedIdentity): Partial<IdentityState> => {
    return {
        connectedIdentity,
        // 其他属性需要重置
        identityProfile: undefined,
        jwt_token: undefined,
        icpBalance: undefined,
        ogyBalance: undefined,
        creditPoints: undefined,
        kycResult: undefined,
        buyingNft: false,
        favorited: undefined,
        showBatchSellSidebar: false,
        batchSales: [],
        showShoppingCart: false,
        shoppingCartFlag: 0,
        shoppingCartItems: undefined,
        goldShoppingCartFlag: 0,
        goldShoppingCartItems: [],
        isUserSidebarOpen: false,
        // sweepMode: false,
        // sweepGold: false,
        // sweepItems: {},
        // sweepGoldItems: [],
    };
};

export const useIdentityStore = createWithEqualityFn<IdentityState>()(
    devtools(
        subscribeWithSelector<IdentityState>((set, get) => ({
            // 用户登录身份
            connectedIdentity: undefined,
            setConnectedIdentity: (connectedIdentity?: ConnectedIdentity) => {
                // console.warn('identity state connected', connectedIdentity);
                let delta: Partial<IdentityState> = {};
                if (connectedIdentity === undefined) {
                    delta = resetConnectedState(connectedIdentity); // 退出登录
                } else {
                    // 登录了
                    const { connectedIdentity: old } = get();
                    if (old === undefined) {
                        delta = resetConnectedState(connectedIdentity); // 之前没有登录, 新身份
                    } else if (old.principal === connectedIdentity.principal) {
                        delta = { connectedIdentity }; // 还是原来的身份 其他内容不改变
                    } else {
                        delta = resetConnectedState(connectedIdentity); // 替换为新身份
                    }
                }
                return set({ ...delta });
            },
            // 用户信息
            identityProfile: undefined,
            reloadIdentityProfile: async (retry: number = 0) => {
                const identity = get().connectedIdentity;
                if (!identity) return;
                return set({ identityProfile: await fetchIdentityProfile(identity, retry) });
            },

            // 用户的 jwt_token
            jwt_token: undefined,
            reloadJwtToken: async (retry: number = 0) => {
                const identity = get().connectedIdentity;
                if (!identity) return;
                return set({
                    jwt_token: await refetch(
                        () =>
                            new Promise((resolve, reject) => {
                                queryJwtToken(identity)
                                    .then(resolve)
                                    .catch(() => generateJwtToken(identity).then(resolve))
                                    .catch(reject);
                            }),
                        retry,
                    ),
                });
            },

            // icp balance
            icpBalance: undefined,
            reloadIcpBalance: async () => {
                const identity = get().connectedIdentity;
                if (!identity) return;
                const icpBalance = await refetch(() => icpAccountBalance(identity.account));
                return set({ icpBalance });
            },
            // ogy balance
            ogyBalance: undefined,
            reloadOgyBalance: async () => {
                const identity = get().connectedIdentity;
                if (!identity) return;
                const ogyBalance = await refetch(() => ogyAccountBalance(identity.account));
                return set({ ogyBalance });
            },
            // credit points
            creditPoints: undefined,
            reloadCreditPoints: async () => {
                const identity = get().connectedIdentity;
                if (!identity) return;
                const creditPoints = await refetch(() =>
                    queryCreditPointsByPrincipal(identity.principal),
                );
                return set({ creditPoints });
            },

            // kyc
            kycResult: undefined,
            reloadKycResult: async () => {
                const identity = get().connectedIdentity;
                if (!identity) return;
                const kycResult = await refetch(() =>
                    queryKycResultByPrincipal(identity.principal),
                );
                return set({ kycResult });
            },
            buyingNft: false,
            setBuyingNft: (buyingNft: boolean) => set({ buyingNft }),

            // favorites
            favorited: undefined,
            reloadFavorited: async () => {
                const identity = get().connectedIdentity;
                if (!identity) return;
                const favorited = await fetchUserFavorited(identity);
                return set({ favorited });
            },
            addFavorited: (record: NftIdentifier) => {
                const { favorited: old } = get();
                if (old === undefined) return;
                const favorited = old.filter((n) => !isSameNft(n, record));
                favorited.push(record);
                return set({ favorited });
            },
            removeFavorited: (record: NftIdentifier) => {
                const { favorited: old } = get();
                if (old === undefined) return;
                const favorited = old.filter((n) => !isSameNft(n, record));
                return set({ favorited });
            },

            // batch sell
            showBatchSellSidebar: false,
            toggleShowBatchSellSidebar: () =>
                set({ showBatchSellSidebar: !get().showBatchSellSidebar }),
            batchSales: [],
            updateBatchNftSale: (sale: BatchNftSale) => {
                const { batchSales: old } = get();
                const item = old.find((o) => isSameNftByTokenId(o, sale));
                if (item === undefined) return;
                item.token = sale.token;
                item.last = sale.last;
                item.price = sale.price;
                item.result = sale.result;
                return set({ batchSales: [...old] });
            },
            addBatchNftSale: (sale: BatchNftSale) => {
                const { batchSales: old } = get();
                const item = old.find((o) => isSameNftByTokenId(o, sale));
                if (item !== undefined) return;
                old.push(sale);
                return set({ batchSales: [...old] });
            },
            setBatchNftSales: (sales: BatchNftSale[] | undefined) => {
                if (!sales) {
                    return;
                }
                return set({ batchSales: sales });
            },
            removeBatchNftSale: (token_id: NftIdentifier) => {
                const { batchSales: old } = get();
                const records = old.filter((o) => !isSameNft(o.token_id, token_id));
                if (records.length === old.length) return;
                return set({ batchSales: records });
            },
            cleanBatchNftSales: () => set({ batchSales: [] }),

            // shopping cart
            showShoppingCart: false,
            toggleShowShoppingCart: () => set({ showShoppingCart: !get().showShoppingCart }),

            // remote shopping cart
            shoppingCartFlag: 0,
            shoppingCartItems: undefined,
            reloadShoppingCartItems: async () => {
                const identity = get().connectedIdentity;
                if (!identity) return;
                const shoppingCartItems = await fetchShoppingCart(identity);
                return set({
                    shoppingCartItems,
                    shoppingCartFlag: get().shoppingCartFlag + 1,
                });
            },
            updateShoppingCartItem: (newItem: ShoppingCartItem) => {
                const { shoppingCartItems: old } = get();
                if (old === undefined) return;
                const item = old.find((o) => isSameNftByTokenId(o, newItem));
                if (item === undefined) return;
                item.card = newItem.card;
                item.listing = newItem.listing;
                return set({
                    shoppingCartItems: [...old],
                    shoppingCartFlag: get().shoppingCartFlag + 1,
                });
            },
            addShoppingCartItem: (newItem: ShoppingCartItem) => {
                const { shoppingCartItems: old } = get();
                if (old === undefined) return;
                const item = old.find((o) => isSameNftByTokenId(o, newItem));
                if (item !== undefined) return;
                old.push(newItem);
                return set({
                    shoppingCartItems: [...old],
                    shoppingCartFlag: get().shoppingCartFlag + 1,
                });
            },
            removeShoppingCartItem: (token_id: NftIdentifier) => {
                const { shoppingCartItems: old } = get();
                if (old === undefined) return;
                const records = old.filter((o) => !isSameNft(o.token_id, token_id));
                if (records.length === old.length) return;
                return set({
                    shoppingCartItems: records,
                    shoppingCartFlag: get().shoppingCartFlag + 1,
                });
            },
            cleanShoppingCartItems: () =>
                set({ shoppingCartItems: [], shoppingCartFlag: get().shoppingCartFlag + 1 }),

            // gold shopping cart
            goldShoppingCartFlag: 0,
            goldShoppingCartItems: [],
            updateGoldShoppingCartItem: (newItem: ShoppingCartItem) => {
                const { goldShoppingCartItems: old } = get();
                if (old === undefined) return;
                const item = old.find((o) => isSameNftByTokenId(o, newItem));
                if (item === undefined) return;
                item.card = newItem.card;
                item.listing = newItem.listing;
                return set({
                    goldShoppingCartItems: [...old],
                    goldShoppingCartFlag: get().goldShoppingCartFlag + 1,
                });
            },
            addGoldShoppingCartItem: (newItem: ShoppingCartItem) => {
                const { goldShoppingCartItems: old } = get();
                if (old === undefined) return;
                const item = old.find((o) => isSameNftByTokenId(o, newItem));
                if (item !== undefined) return;
                return set({
                    goldShoppingCartItems: [...old, newItem],
                    goldShoppingCartFlag: get().goldShoppingCartFlag + 1,
                });
            },
            removeGoldShoppingCartItem: (token_id: NftIdentifier) => {
                const { goldShoppingCartItems: old } = get();
                if (old === undefined) return;
                const records = old.filter((o) => !isSameNft(o.token_id, token_id));
                if (records.length === old.length) return;
                return set({
                    goldShoppingCartItems: records,
                    goldShoppingCartFlag: get().goldShoppingCartFlag + 1,
                });
            },
            cleanGoldShoppingCartItems: () =>
                set({
                    goldShoppingCartItems: [],
                    goldShoppingCartFlag: get().goldShoppingCartFlag + 1,
                }),
            reloadByIdentity: async (identity: ConnectedIdentity) => {
                const { connectedIdentity: old } = get();
                if (old === undefined) return;
                if (old !== identity) return;

                // console.debug('connected identity reload start');
                const spend = Spend.start(`connected identity reload by identity end`);
                const [icpBalance, ogyBalance, creditPoints] = await Promise.all([
                    refetch(() => icpAccountBalance(identity.account)),
                    refetch(() => ogyAccountBalance(identity.account)),
                    refetch(() => queryCreditPointsByPrincipal(identity.principal)),
                ]);
                spend.mark('over');

                return set({
                    icpBalance,
                    ogyBalance,
                    creditPoints,
                });
            },

            // user sidebar
            isUserSidebarOpen: false,
            toggleIsUserSidebarIdOpen: () => set({ isUserSidebarOpen: !get().isUserSidebarOpen }),
            addFundsOpen: false,
            toggleAddFundsOpen: () => set({ addFundsOpen: !get().addFundsOpen }),
            setAddFundArgs: (args: AddFundsArgs) => set({ addFundsArgs: args }),
            // market sweep
            sweepMode: false,
            sweepGold: false,
            sweepItems: {},
            sweepGoldItems: [],
            setSweepGold: (sweepGold: boolean) => set({ sweepGold }),
            toggleSweepMode: () => set({ sweepMode: !get().sweepMode }),
            setSweepItems: (items: ShoppingCartItem[], collection?: string, iGold?: boolean) => {
                const { sweepItems: old } = get();
                iGold
                    ? set({ sweepGoldItems: items })
                    : collection && set({ sweepItems: { ...old, [collection]: items } });
            },
        })),
        {
            enabled: isDev,
            name: 'IdentityStore',
        },
    ),
    shallow,
);

isDev && mountStoreDevtool('IdentityStore', useIdentityStore);

// 读取当前用户登录的身份信息
const fetchIdentityProfile = async (
    connectedIdentity: ConnectedIdentity,
    retry: number,
): Promise<IdentityProfile | undefined> => {
    const profile = await refetch(
        () => queryProfileByPrincipal(connectedIdentity.principal),
        retry,
    );
    if (profile) {
        return {
            principal: profile.principal,
            account: profile.account,
            username: profile.username,
            banner: profile.banner,
            avatar: profile.avatar,
            email: profile.email,
            bio: profile.bio,
            notification: profile.notification,
        };
    }
    return undefined;
};

// 获取用户的收藏列表
const fetchUserFavorited = async (
    connectedIdentity: ConnectedIdentity,
): Promise<NftIdentifier[] | undefined> => {
    try {
        const d = await queryProfileByPrincipal(connectedIdentity.principal);
        return d.favorited.map(parse_nft_identifier); // 暂时后端只支持 ext 类型的收藏
    } catch (e) {
        console.log(`🚀 ~ file: identity.ts:202 ~ e:`, e);
        return undefined;
    }
};

// 获取用户的购物车内容
const fetchShoppingCart = async (
    connectedIdentity: ConnectedIdentity,
): Promise<ShoppingCartItem[] | undefined> => {
    try {
        const d = await queryShoppingCart(connectedIdentity);
        return d.map((token_id) => ({ token_id })); // 暂时后端只支持 ext 类型的收藏
    } catch (e) {
        console.log(`🚀 ~ file: identity.ts:213 ~ e:`, e);
        return undefined;
    }
};

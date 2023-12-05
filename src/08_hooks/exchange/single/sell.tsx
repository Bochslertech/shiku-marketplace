import { useCallback, useMemo, useState } from 'react';
import { message } from 'antd';
import {
    SellingAction,
    SellNftByTransactionExecutor,
    SellNftExecutor,
    SingleSellAction,
    SingleSellTransaction,
} from '@/01_types/exchange/single-sell';
import { ConnectedIdentity } from '@/01_types/identity';
import { SupportedNftStandard, TokenInfo } from '@/01_types/nft';
import { NftTokenOwner } from '@/01_types/nft';
import { exponentNumber, isValidNumber } from '@/02_common/data/numbers';
import { parse_token_index_with_checking } from '@/02_common/nft/ext';
import { uniqueKey } from '@/02_common/nft/identifier';
import { getYumiOgyBroker } from '@/02_common/nft/ogy';
import { Spend } from '@/02_common/react/spend';
import { transferFrom as transferFromByCcc } from '@/03_canisters/nft/nft_ccc';
import { listingByOgy, retrieveNftFromListingByOgy } from '@/03_canisters/nft/nft_ogy';
import { NFT_EXT_WITHOUT_APPROVE, NFT_OGY, NFT_OGY_ART } from '@/03_canisters/nft/special';
import {
    larkNoticeSingleSell,
    larkNoticeSingleSellFailed,
    larkNoticeSingleSellInitial,
    larkNoticeSingleSellOver,
} from '@/04_apis/yumi-logs/single-sell';
import { ERRS_NOT_SEND } from '@/04_apis/yumi-logs/special';
import { queryOgyGoldSupportedTokens } from '@/05_utils/apis/yumi/api';
import { getBackendType } from '@/05_utils/app/backend';
import {
    getLedgerIcpCanisterId,
    getLedgerIcpDecimals,
    getLedgerIcpFee,
    getLedgerOgyCanisterId,
    getLedgerOgyDecimals,
    getLedgerOgyFee,
} from '@/05_utils/canisters/ledgers/special';
import {
    allowance,
    approve,
    transferFrom as transferFromByExt,
} from '@/05_utils/canisters/nft/ext';
import { getOgyGoldCanisterId } from '@/05_utils/canisters/nft/special';
import {
    afterDepositingNft,
    beforeDepositingNft,
    queryNftDepositor,
} from '@/05_utils/canisters/yumi/ccc_proxy';
import { listing } from '@/05_utils/canisters/yumi/core';
import { queryOrigynArtSupportedTokens } from '@/05_utils/canisters/yumi/origyn-art';
import {
    getYumiCccProxyCanisterId,
    getYumiCoreCanisterId,
} from '@/05_utils/canisters/yumi/special';
import { useTransactionStore } from '@/07_stores/transaction';
import { useCheckIdentity } from '@/08_hooks/common/identity';
import { useMessage } from '@/08_hooks/common/message';
import { useTransactionRecords } from '@/08_hooks/stores/transaction';
import { useCheckAction } from '../../common/action';
import { checkWhitelist } from '../../common/whitelist';
import useActionSteps, { MarkAction } from '../../exchange/steps';
import { transaction_executed, transaction_executing } from '../executing';

export const useSellNft = (): {
    sell: SellNftExecutor;
    action: SellingAction;
} => {
    const checkAction = useCheckAction();

    // 标记当前状态
    const [action, setAction] = useState<SellingAction>(undefined);

    const sell = useCallback(
        async (
            identity: ConnectedIdentity,
            owner: NftTokenOwner,
            last: string | undefined, // 上次价格, OGY 需要判断是否已经上架了
            token: TokenInfo,
            price: string,
            allow_list?: string[], // 允许回购的白名单 // OGY Gold 使用
        ): Promise<boolean> => {
            checkAction(action, `Selling`); // 防止重复点击

            setAction('DOING');
            try {
                // ? 0. 检查白名单
                await checkWhitelist(identity, [owner.token_id.collection]);

                const spend = Spend.start(`sell nft ${uniqueKey(owner.token_id)}`);

                // ? 0. 检查一下 token 信息对不对
                await checkToken(token);

                // ? 1. 统一前置授权阶段
                await doApproving(
                    setAction,
                    identity,
                    owner,
                    last,
                    token,
                    price,
                    allow_list,
                    spend,
                );
                if (owner.raw.standard === 'ogy') return true; // * 如果是 OGY， 就已经完成了

                // ? 2. Yumi 记录上架信息阶段
                await yumiRecord(setAction, price, token, identity, owner, spend);

                // ? 3. 圆满完成
                return true;
            } catch (e) {
                console.debug(`🚀 ~ file: sell.tsx:113 ~ e:`, e);
                message.error(`Sell NFT failed: ${e}`);
            } finally {
                setAction(undefined); // 恢复状态
            }
            return false;
        },
        [action],
    );

    return { sell, action };
};

const checkToken = async (token: TokenInfo): Promise<void> => {
    switch (token.symbol) {
        case 'ICP':
            if (
                token.canister !== getLedgerIcpCanisterId() ||
                token.decimals !== `${getLedgerIcpDecimals()}` ||
                token.fee !== getLedgerIcpFee()
            ) {
                throw new Error(`wrong token info`);
            }
            break;
        case 'OGY':
            if (
                token.canister !== getLedgerOgyCanisterId() ||
                token.decimals !== `${getLedgerOgyDecimals()}` ||
                token.fee !== getLedgerOgyFee()
            ) {
                throw new Error(`wrong token info`);
            }
            break;
        default:
            throw new Error(`token ${token.symbol} is not supported`);
    }
};

const doApproving = async (
    setAction: (action: SellingAction) => void,
    identity: ConnectedIdentity,
    owner: NftTokenOwner,
    last: string | undefined, // 上次价格, OGY 需要判断是否已经上架了
    token: TokenInfo | undefined,
    price: string,
    allow_list: string[] | undefined, // 允许回购的白名单
    spend: Spend,
): Promise<void> => {
    setAction('APPROVING');
    await doApprove(identity, owner, last, token, price, allow_list, setAction, spend);
    spend.mark(`APPROVING DONE`);
};

// 统一授权阶段
export const doApprove = async (
    identity: ConnectedIdentity,
    owner: NftTokenOwner,
    last: string | undefined, // 上次价格, OGY 需要判断是否已经上架了
    token: TokenInfo | undefined,
    price: string,
    allow_list: string[] | undefined, // 允许回购的白名单
    setAction: (action: SellingAction) => void,
    spend: Spend,
): Promise<void> => {
    if (owner.raw.standard === 'ogy') {
        // ? OGY
        setAction('APPROVING_OGY');
        await approveByOgy(identity, owner, last, token, price, allow_list, setAction, spend);
        spend.mark(`APPROVING_OGY DONE`);
    } else if (
        owner.raw.standard === 'ccc' ||
        NFT_EXT_WITHOUT_APPROVE.includes(owner.token_id.collection) // ! 没有 approve 的 ext 标准也要走 ccc 路径
    ) {
        // ? CCC
        setAction('APPROVING_CCC');
        await approveByCcc(identity, owner, setAction, spend);
        spend.mark(`APPROVING_CCC DONE`);
    } else {
        // ? 其他类型 一律按照 EXT 操作
        setAction('APPROVING_EXT');
        await approveByExt(identity, owner, setAction, spend);
        spend.mark(`APPROVING_EXT DONE`);
    }
};

// 1.1 OGY 的授权阶段,直接上架
const approveByOgy = async (
    identity: ConnectedIdentity,
    owner: NftTokenOwner,
    last: string | undefined, // 上次价格, OGY 需要判断是否已经上架了
    token: TokenInfo | undefined,
    price: string,
    allow_list: string[] | undefined, // 允许回购的白名单
    setAction: (action: SellingAction) => void,
    spend: Spend,
): Promise<void> => {
    // 1. 3 种方式获取 token
    if (token !== undefined) {
        // 已经有了
    } else if (NFT_OGY_ART.includes(owner.token_id.collection)) {
        setAction('APPROVING_OGY_SUPPORTED_TOKEN');
        const tokens = await queryOrigynArtSupportedTokens();
        spend.mark(
            `APPROVING_OGY_SUPPORTED_TOKEN DONE: origyn art ogy: ${owner.token_id.collection}`,
        );
        token = tokens.find((t) => t.symbol === 'ICP');
    } else if (getOgyGoldCanisterId().includes(owner.token_id.collection)) {
        setAction('APPROVING_OGY_SUPPORTED_TOKEN');
        const tokens = await queryOgyGoldSupportedTokens();
        spend.mark(`APPROVING_OGY_SUPPORTED_TOKEN DONE: gold ogy: ${owner.token_id.collection}`);
        token = tokens.find((t) => t.symbol === 'ICP');
    } else if (NFT_OGY.includes(owner.token_id.collection)) {
        setAction('APPROVING_OGY_SUPPORTED_TOKEN');
        const tokens = await queryOrigynArtSupportedTokens();
        spend.mark(`APPROVING_OGY_SUPPORTED_TOKEN DONE: ogy: ${owner.token_id.collection}`);
        token = tokens.find((t) => t.symbol === 'ICP'); // 其他罐子也使用 origyn art 的
    } else {
        throw new Error('unknown NFT canister');
    }
    if (token === undefined) throw new Error(`Token Info is missing.`); // 找不到需要的信息

    // 2. 检查需不需要先下架
    if (last !== undefined) {
        setAction('APPROVING_OGY_CANCELLING');
        const cancel = await retrieveNftFromListingByOgy(
            identity,
            owner.token_id.collection,
            owner.token_id.token_identifier,
        );
        spend.mark(`APPROVING_OGY_CANCELLING DONE`);
        if (!cancel) throw new Error('Cancel last order failed.');
    }

    // 3. 直接上架
    setAction('APPROVING_OGY_SELLING');
    const listing = await listingByOgy(identity, owner.token_id.collection, {
        broker_id: getYumiOgyBroker(),
        token_identifier: owner.token_id.token_identifier,
        token,
        price, // 不需要进行精度调整，默认传入的就是实际的带有 8 位精度的整数
        allow_list,
    });
    spend.mark(`APPROVING_OGY_SELLING DONE`);
    if (!listing) throw new Error(`OGY NFT listing failed.`);
};

// 1.2 CCC 标准没有 approve,需要用户将所有权转移给 yumi 的代理罐子
const approveByCcc = async (
    identity: ConnectedIdentity,
    owner: NftTokenOwner,
    setAction: (action: SellingAction) => void,
    spend: Spend,
): Promise<void> => {
    const token_index = parse_token_index_with_checking(
        owner.token_id.collection,
        owner.token_id.token_identifier,
    );

    // 1. 检查是否已经将所有权转移给代理罐
    setAction('APPROVING_CCC_CHECKING_TRANSFERRED');
    const checking = await queryNftDepositor(owner.token_id.collection, token_index);
    spend.mark(`APPROVING_CCC_CHECKING_TRANSFERRED DONE`);
    if (checking === identity.principal) return; // 已经托管了

    // 2. 转移给 yumi 代理罐子之前,先保存当时的所有者
    setAction('APPROVING_CCC_BEFORE_TRANSFERRING');
    await beforeDepositingNft(identity, {
        collection: owner.token_id.collection,
        token_index,
    });
    spend.mark(`APPROVING_CCC_BEFORE_TRANSFERRING DONE`);

    // 3. 转移给 yumi
    setAction('APPROVING_CCC_TRANSFERRING');
    owner.raw.standard === 'ext'
        ? await transferFromByExt(identity, owner.token_id.collection, {
              token_identifier: owner.token_id.token_identifier,
              from: { address: owner.owner },
              to: { principal: getYumiCccProxyCanisterId() },
          })
        : await transferFromByCcc(identity, owner.token_id.collection, {
              owner: identity.principal,
              token_index,
              to: getYumiCccProxyCanisterId(),
          });
    spend.mark(`APPROVING_CCC_TRANSFERRING DONE`);

    // 4. 告知 yumi 已经转移
    setAction('APPROVING_CCC_AFTER_TRANSFERRING');
    await afterDepositingNft(identity, {
        collection: owner.token_id.collection,
        token_index,
    });
    spend.mark(`APPROVING_CCC_AFTER_TRANSFERRING DONE`);
};

// 1.3 EXT 系列有 approve 的
const approveByExt = async (
    identity: ConnectedIdentity,
    owner: NftTokenOwner,
    setAction: (action: SellingAction) => void,
    spend: Spend,
): Promise<void> => {
    const args_allowance = {
        token_identifier: owner.token_id.token_identifier,
        owner: { principal: identity.principal },
        spender: getYumiCoreCanisterId(),
    };

    const args_approve = {
        token_identifier: owner.token_id.token_identifier,
        spender: getYumiCoreCanisterId(),
    };

    // 1. 检查授权
    setAction('APPROVING_EXT_CHECKING');
    const checking = await allowance(owner.token_id.collection, args_allowance);
    spend.mark(`APPROVING_EXT_CHECKING DONE`);
    if (checking) return; // 已经授权了

    // 2. 如果没授权,要进行授权
    setAction('APPROVING_EXT_APPROVING');
    await approve(identity, owner.token_id.collection, args_approve);
    spend.mark(`APPROVING_EXT_APPROVING DONE`);

    // 3. 授权后要再次进行检查
    setAction('APPROVING_EXT_CHECKING_AGAIN');
    const checking_again = await allowance(owner.token_id.collection, args_allowance);
    spend.mark(`APPROVING_EXT_APPROVING DONE`);
    if (!checking_again) throw new Error(`Approve failed.`);
};

const yumiRecord = async (
    setAction: (action: SellingAction) => void,
    price: string,
    token: TokenInfo,
    identity: ConnectedIdentity,
    owner: NftTokenOwner,
    spend: Spend,
): Promise<void> => {
    setAction('YUMI_LISTING');
    const actually = exponentNumber(price, Number(token.decimals));
    await listing(identity, {
        token_identifier: owner.token_id.token_identifier,
        token,
        price: `${actually}`,
    });
    spend.mark(`YUMI_LISTING DONE`);
};

// ================== 上架之前,需要检查一下输入的价格是否有效 ==================

export const checkSellPrice = (price: string, decimals: number, min?: number): string => {
    if (!isValidNumber(price, decimals)) {
        return 'Wrong price.';
    }
    const p = Number(price);
    if (p < (min ?? 0)) {
        return `Price must be greater than ${min ?? 0}.`;
    }
    if (p > 1e4) {
        return 'Price is too high.';
    }
    return '';
};

// ================== 状态显示弹窗 ==================

export const useSellingActionSteps = (
    action: SellingAction,
    standard: SupportedNftStandard,
    collection: string,
    lastPrice: string | undefined,
): {
    show: boolean;
    hide: () => void;
    failed: boolean;
    fail: () => void;
    title: string;
    actions: MarkAction<SellingAction>[];
} => {
    const { show, hide, failed, fail } = useActionSteps(action);

    const { title, actions }: { title: string; actions: MarkAction<SellingAction>[] } =
        useMemo(() => {
            const title = 'Sell NFT';
            const actions: MarkAction<SellingAction>[] =
                standard === 'ogy'
                    ? [
                          {
                              actions: ['APPROVING_OGY_SUPPORTED_TOKEN'],
                              title: 'Find supported token',
                          },
                          ...((lastPrice === undefined
                              ? []
                              : [
                                    {
                                        actions: ['APPROVING_OGY_CANCELLING'],
                                        title: 'cancelling last order',
                                    },
                                ]) as MarkAction<SellingAction>[]),
                          { actions: ['APPROVING_OGY_SELLING'], title: 'Sell' },
                      ]
                    : standard === 'ccc' || NFT_EXT_WITHOUT_APPROVE.includes(collection) // ! 没有 approve 的 ext 标准也要走 ccc 路径
                    ? [
                          {
                              actions: [
                                  'APPROVING',
                                  'APPROVING_CCC',
                                  'APPROVING_CCC_CHECKING_TRANSFERRED',
                                  'APPROVING_CCC_BEFORE_TRANSFERRING',
                                  'APPROVING_CCC_TRANSFERRING',
                                  'APPROVING_CCC_AFTER_TRANSFERRING',
                              ],
                              title: 'Approve first',
                          },
                          { actions: ['YUMI_LISTING'], title: 'Record your sell info' },
                      ]
                    : [
                          {
                              actions: [
                                  'APPROVING',
                                  'APPROVING_EXT',
                                  'APPROVING_EXT_CHECKING',
                                  'APPROVING_EXT_APPROVING',
                                  'APPROVING_EXT_CHECKING_AGAIN',
                              ],
                              title: 'Approve first',
                          },
                          { actions: ['YUMI_LISTING'], title: 'Record your sell info' },
                      ];
            return { title, actions };
        }, [standard, lastPrice]);

    return {
        show,
        hide,
        failed,
        fail,
        title,
        actions,
    };
};

// 发出卖出交易
export const useSellNftByTransaction = (): {
    sell: SellNftExecutor;
    executing: boolean;
} => {
    const message = useMessage();

    const insert = useTransactionStore((s) => s.insert);

    const [id, setId] = useState<string | undefined>(undefined);
    const { record } = useTransactionRecords(id);

    const sell = useCallback(
        async (
            identity: ConnectedIdentity,
            owner: NftTokenOwner,
            last: string | undefined, // 上次价格, OGY 需要判断是否已经上架了
            token: TokenInfo,
            price: string,
            allow_list?: string[], // 允许回购的白名单 // OGY Gold 使用
        ): Promise<boolean> => {
            try {
                // ? 0. 检查一下 token 信息对不对
                await checkToken(token);
            } catch (e) {
                message.error(`wrong token`);
                return false;
            }

            const id = await insert(identity.principal, {
                type: 'single-sell',
                args: { owner, last, token, price, allow_list },
                actions: [],
            }).catch((e) => {
                console.debug(`🚀 ~ file: sell.tsx:456 ~ e:`, e);
                message.error(e.message);
                return undefined;
            });
            setId(id);
            if (!id) {
                return false;
            }
            // ? LARK 通知
            larkNoticeSingleSellInitial(
                getBackendType(),
                id,
                identity.principal,
                owner.token_id,
                token,
                price,
                '',
            );
            return true;
        },
        [insert],
    );

    return { sell, executing: record?.status === 'executing' };
};

// 交易执行
export const useDoSellNftByTransaction = (): SellNftByTransactionExecutor => {
    const checkIdentity = useCheckIdentity();

    const update = useTransactionStore((s) => s.update);

    const doSell = useCallback(
        async (id: string, _created: number, transaction: SingleSellTransaction) => {
            const identity = checkIdentity();
            if (!transaction_executing(id)) return; // 已经执行了，不能重复执行
            const spend = Spend.start(
                `sell nft by transaction ${uniqueKey(transaction.args.owner.token_id)}`,
            );
            let done_action = false;

            function doAction<T>(
                action: SellingAction,
                fetch_action: (action: SingleSellAction<T>) => Promise<T>,
                do_action: () => Promise<T>,
            ): Promise<T> {
                return new Promise((resolve, reject) => {
                    const action_with_data = transaction.actions.find((a) => a.action === action);
                    if (action_with_data) {
                        spend.mark(`already done ${action}`);
                        fetch_action(action_with_data).then(resolve).catch(reject);
                    } else {
                        done_action = true;
                        // ? LARK 通知
                        const now = larkNoticeSingleSell(0, getBackendType(), id, action ?? '');
                        do_action()
                            .then((d) => {
                                // ? LARK 通知
                                larkNoticeSingleSell(
                                    now,
                                    getBackendType(),
                                    id,
                                    action ?? '',
                                    d ? `${d}` : '',
                                );
                                resolve(d);
                            })
                            .catch(reject);
                    }
                });
            }

            try {
                // ? 0. 检查白名单
                await checkWhitelist(identity, [transaction.args.owner.token_id.collection]);

                await doAction(
                    'DOING',
                    async () => {},
                    async () => {
                        transaction.actions.push({ action: 'DOING', timestamp: Date.now() });
                        await update(id, transaction, 'executing');
                    },
                );
                if (done_action) return;

                // 区分类型进行上架
                if (transaction.args.owner.raw.standard === 'ogy') {
                    // 1. 3 种方式获取 token
                    const token = await doAction(
                        'APPROVING_OGY_SUPPORTED_TOKEN',
                        async (action) => action.data!,
                        async () => {
                            const token = await (async () => {
                                let token: TokenInfo | undefined = transaction.args.token;
                                if (token !== undefined) {
                                    // 已经有了
                                } else if (
                                    NFT_OGY_ART.includes(transaction.args.owner.token_id.collection)
                                ) {
                                    const tokens = await queryOrigynArtSupportedTokens();
                                    spend.mark(
                                        `APPROVING_OGY_SUPPORTED_TOKEN DONE: origyn art ogy: ${transaction.args.owner.token_id.collection}`,
                                    );
                                    token = tokens.find((t) => t.symbol === 'ICP');
                                } else if (
                                    getOgyGoldCanisterId().includes(
                                        transaction.args.owner.token_id.collection,
                                    )
                                ) {
                                    const tokens = await queryOgyGoldSupportedTokens();
                                    spend.mark(
                                        `APPROVING_OGY_SUPPORTED_TOKEN DONE: gold ogy: ${transaction.args.owner.token_id.collection}`,
                                    );
                                    token = tokens.find((t) => t.symbol === 'ICP');
                                } else if (
                                    NFT_OGY.includes(transaction.args.owner.token_id.collection)
                                ) {
                                    const tokens = await queryOrigynArtSupportedTokens();
                                    spend.mark(
                                        `APPROVING_OGY_SUPPORTED_TOKEN DONE: ogy: ${transaction.args.owner.token_id.collection}`,
                                    );
                                    token = tokens.find((t) => t.symbol === 'ICP'); // 其他罐子也使用 origyn art 的
                                } else {
                                    throw new Error('unknown NFT canister');
                                }
                                if (token === undefined) throw new Error(`Token Info is missing.`); // 找不到需要的信息
                                return token;
                            })();
                            transaction.actions.push({
                                action: 'APPROVING_OGY_SUPPORTED_TOKEN',
                                timestamp: Date.now(),
                                data: token,
                            });
                            await update(id, transaction, 'executing');
                            return token;
                        },
                    );
                    if (done_action) return;

                    // 2. 检查需不需要先下架
                    if (transaction.args.last !== undefined) {
                        await doAction(
                            'APPROVING_OGY_CANCELLING',
                            async () => {},
                            async () => {
                                // 进行取消
                                await retrieveNftFromListingByOgy(
                                    identity,
                                    transaction.args.owner.token_id.collection,
                                    transaction.args.owner.token_id.token_identifier,
                                ).catch(() => {});
                                spend.mark(`APPROVING_OGY_CANCELLING DONE`);
                                transaction.actions.push({
                                    action: 'APPROVING_OGY_CANCELLING',
                                    timestamp: Date.now(),
                                });
                                await update(id, transaction, 'executing');
                            },
                        );
                        if (done_action) return;
                    }

                    // 3. 直接上架
                    await doAction(
                        'APPROVING_OGY_SELLING',
                        async () => {},
                        async () => {
                            const listing = await listingByOgy(
                                identity,
                                transaction.args.owner.token_id.collection,
                                {
                                    broker_id: getYumiOgyBroker(),
                                    token_identifier:
                                        transaction.args.owner.token_id.token_identifier,
                                    token,
                                    price: transaction.args.price, // 不需要进行精度调整，默认传入的就是实际的带有 8 位精度的整数
                                    allow_list: transaction.args.allow_list,
                                },
                            );
                            spend.mark(`APPROVING_OGY_SELLING DONE`);
                            if (!listing) throw new Error(`OGY NFT listing failed.`);
                            transaction.actions.push({
                                action: 'APPROVING_OGY_SELLING',
                                timestamp: Date.now(),
                                data: listing,
                            });
                            await update(id, transaction, 'successful');
                        },
                    );

                    return; // 完毕
                } else if (
                    transaction.args.owner.raw.standard === 'ccc' ||
                    NFT_EXT_WITHOUT_APPROVE.includes(transaction.args.owner.token_id.collection) // ! 没有 approve 的 ext 标准也要走 ccc 路径
                ) {
                    const token_index = parse_token_index_with_checking(
                        transaction.args.owner.token_id.collection,
                        transaction.args.owner.token_id.token_identifier,
                    );
                    // 1. 检查是否已经将所有权转移给代理罐
                    await doAction(
                        'APPROVING_CCC_CHECKING_TRANSFERRED',
                        async () => {},
                        async () => {
                            await (async () => {
                                // 1. 检查是否已经将所有权转移给代理罐
                                const checking = await queryNftDepositor(
                                    transaction.args.owner.token_id.collection,
                                    token_index,
                                );
                                spend.mark(`APPROVING_CCC_CHECKING_TRANSFERRED DONE`);
                                if (checking === identity.principal) return; // 已经托管了

                                // 2. 转移给 yumi 代理罐子之前,先保存当时的所有者
                                await beforeDepositingNft(identity, {
                                    collection: transaction.args.owner.token_id.collection,
                                    token_index,
                                });
                                spend.mark(`APPROVING_CCC_BEFORE_TRANSFERRING DONE`);
                                // 3. 转移给 yumi
                                transaction.args.owner.raw.standard === 'ext'
                                    ? await transferFromByExt(
                                          identity,
                                          transaction.args.owner.token_id.collection,
                                          {
                                              token_identifier:
                                                  transaction.args.owner.token_id.token_identifier,
                                              from: { address: transaction.args.owner.owner },
                                              to: { principal: getYumiCccProxyCanisterId() },
                                          },
                                      )
                                    : await transferFromByCcc(
                                          identity,
                                          transaction.args.owner.token_id.collection,
                                          {
                                              owner: identity.principal,
                                              token_index,
                                              to: getYumiCccProxyCanisterId(),
                                          },
                                      );
                                spend.mark(`APPROVING_CCC_TRANSFERRING DONE`);

                                // 4. 告知 yumi 已经转移
                                await afterDepositingNft(identity, {
                                    collection: transaction.args.owner.token_id.collection,
                                    token_index,
                                });
                                spend.mark(`APPROVING_CCC_AFTER_TRANSFERRING DONE`);
                            })();
                            transaction.actions.push({
                                action: 'APPROVING_CCC_CHECKING_TRANSFERRED',
                                timestamp: Date.now(),
                            });
                            await update(id, transaction, 'executing');
                        },
                    );
                    if (done_action) return;
                } else {
                    const args_allowance = {
                        token_identifier: transaction.args.owner.token_id.token_identifier,
                        owner: { principal: identity.principal },
                        spender: getYumiCoreCanisterId(),
                    };

                    const args_approve = {
                        token_identifier: transaction.args.owner.token_id.token_identifier,
                        spender: getYumiCoreCanisterId(),
                    };
                    // 1. 检查授权
                    await doAction(
                        'APPROVING_EXT',
                        async () => {},
                        async () => {
                            await (async () => {
                                // 1. 检查授权
                                const checking = await allowance(
                                    transaction.args.owner.token_id.collection,
                                    args_allowance,
                                );
                                spend.mark(`APPROVING_EXT_CHECKING DONE`);
                                if (checking) return; // 已经授权了

                                // 2. 如果没授权,要进行授权
                                await approve(
                                    identity,
                                    transaction.args.owner.token_id.collection,
                                    args_approve,
                                );
                                spend.mark(`APPROVING_EXT_APPROVING DONE`);

                                // 3. 授权后要再次进行检查
                                const checking_again = await allowance(
                                    transaction.args.owner.token_id.collection,
                                    args_allowance,
                                );
                                spend.mark(`APPROVING_EXT_APPROVING DONE`);
                                if (!checking_again) throw new Error(`Approve failed.`);
                            })();
                            transaction.actions.push({
                                action: 'APPROVING_EXT',
                                timestamp: Date.now(),
                            });
                            await update(id, transaction, 'executing');
                        },
                    );
                    if (done_action) return;
                }

                // ? 2. Yumi 记录上架信息阶段
                const actually = exponentNumber(
                    transaction.args.price,
                    Number(transaction.args.token.decimals),
                );
                await doAction(
                    'YUMI_LISTING',
                    async () => {},
                    async () => {
                        await update(id, transaction, 'executing');
                        await listing(identity, {
                            token_identifier: transaction.args.owner.token_id.token_identifier,
                            token: transaction.args.token,
                            price: `${actually}`,
                        });
                        spend.mark(`YUMI_LISTING DONE`);
                        transaction.actions.push({ action: 'YUMI_LISTING', timestamp: Date.now() });
                        await update(id, transaction, 'successful');
                    },
                );
                // ? LARK 通知
                larkNoticeSingleSellOver(
                    _created,
                    getBackendType(),
                    id,
                    identity.principal,
                    transaction.args.owner.token_id,
                    transaction.args.token,
                    transaction.args.price,
                    `Actions: ${transaction.actions
                        .map((a) => `${a.action}(${a.timestamp})${a.data ? `: ${a.data}` : ''}`)
                        .join('\n\t')}`,
                );
            } catch (e: any) {
                const message = `${e.message ?? e}`;

                console.debug('🚀 ~ file: sell.tsx:846 ~ message:', message);
                // 是否将err信息发送到错误日志
                const log_error = !ERRS_NOT_SEND.find((m) => message.indexOf(m) !== -1);

                // ? LARK 通知
                larkNoticeSingleSellFailed(
                    _created,
                    getBackendType(),
                    id,
                    identity.principal,
                    transaction.args.owner.token_id,
                    transaction.args.token,
                    transaction.args.price,
                    `Actions: ${transaction.actions
                        .map((a) => `${a.action}(${a.timestamp})${a.data ? `: ${a.data}` : ''}`)
                        .join('\n\t')}`,
                    message,
                    log_error,
                );
                await update(id, transaction, 'failed', message);
            } finally {
                transaction_executed(id);
            }
        },
        [checkIdentity, update],
    );

    return doSell;
};

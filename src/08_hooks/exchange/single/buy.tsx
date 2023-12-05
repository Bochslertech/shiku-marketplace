import { useCallback, useMemo, useState } from 'react';
import { LedgerTokenBalance } from '@/01_types/canisters/ledgers';
import {
    BuyingAction,
    BuyNftByTransactionExecutor,
    BuyNftExecutor,
    BuyNftRaw,
    BuyNftRawOgy,
    SingleBuyAction,
    SingleBuyTransaction,
} from '@/01_types/exchange/single-buy';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftIdentifier, SupportedNftStandard, TokenInfo } from '@/01_types/nft';
import { exponentNumber } from '@/02_common/data/numbers';
import { principal2account } from '@/02_common/ic/account';
import { uniqueKey } from '@/02_common/nft/identifier';
import { Spend } from '@/02_common/react/spend';
import { bigint2string } from '@/02_common/types/bigint';
import { bidNftByOgy, querySingleTokenOwnerByOgy } from '@/03_canisters/nft/nft_ogy';
import {
    larkNoticeSingleBuy,
    larkNoticeSingleBuyFailed,
    larkNoticeSingleBuyInitial,
    larkNoticeSingleBuyOver,
} from '@/04_apis/yumi-logs/single-buy';
import { ERRS_NOT_SEND } from '@/04_apis/yumi-logs/special';
import { getBackendType } from '@/05_utils/app/backend';
import { icpAccountBalance } from '@/05_utils/canisters/ledgers/icp';
import { ogyAccountBalance } from '@/05_utils/canisters/ledgers/ogy';
import {
    getLedgerIcpCanisterId,
    getLedgerOgyCanisterId,
} from '@/05_utils/canisters/ledgers/special';
import { queryRechargeAccountByOgy } from '@/05_utils/canisters/nft/ogy';
import { createSingleBuyOrder, submittingTransferHeight } from '@/05_utils/canisters/yumi/core';
import { getYumiCoreCanisterId } from '@/05_utils/canisters/yumi/special';
import { queryNftListingData } from '@/05_utils/nft/listing';
import { useTransactionStore } from '@/07_stores/transaction';
import { useCheckAction } from '../../common/action';
import { useCheckIdentity } from '../../common/identity';
import { useCheckKyc } from '../../common/kyc';
import { useMessage } from '../../common/message';
import { checkWhitelist } from '../../common/whitelist';
import { LedgerTransferExecutor, useTransferByICP, useTransferByOGY } from '../../ledger/transfer';
import { useTransactionRecords } from '../../stores/transaction';
import { transaction_executed, transaction_executing } from '../executing';
import useActionSteps, { MarkAction } from '../steps';

export const useBuyNft = (): {
    buy: BuyNftExecutor;
    action: BuyingAction;
} => {
    const message = useMessage();
    const checkIdentity = useCheckIdentity();
    const checkAction = useCheckAction();
    const checkKyc = useCheckKyc();

    // 标记当前状态
    const [action, setAction] = useState<BuyingAction>(undefined);

    // 需要使用转账
    const {
        balance: icpBalance,
        fee: icpFee,
        decimals: icpDecimals,
        transfer: icpTransfer,
    } = useTransferByICP();
    const {
        balance: ogyBalance,
        fee: ogyFee,
        decimals: ogyDecimals,
        transfer: ogyTransfer,
    } = useTransferByOGY();

    const buy = useCallback(
        async (
            token_id: NftIdentifier,
            owner: string | undefined,
            token: TokenInfo,
            price: string,
            raw: BuyNftRaw,
        ): Promise<boolean> => {
            const identity = checkIdentity();
            if (!checkArgs(identity, owner, () => message.warning(`You can't buy your own NFT`)))
                return false;
            checkAction(action, `Purchasing`); // 防止重复点击

            setAction('DOING');
            try {
                // ? 0. 检查白名单
                await checkWhitelist(identity, [token.canister, token_id.collection]);

                const spend = Spend.start(`buy nft ${uniqueKey(token_id)}`);

                // ? 1. 检查KYC
                await checkKyc({
                    before: () => setAction('CHECKING_KYC'),
                    requirement: true,
                    after: () => spend.mark(`${action} DONE`),
                });

                // ? 2. 检查余额
                const { fee, transfer } = await checkBalance(
                    setAction,
                    token,
                    icpBalance,
                    icpFee,
                    icpDecimals,
                    icpTransfer,
                    ogyBalance,
                    ogyFee,
                    ogyDecimals,
                    ogyTransfer,
                    identity,
                    spend,
                    price,
                    raw,
                );

                // ? 3 第三步开始不一样了
                if (raw.standard === 'ogy') {
                    // ? 3. 查询付款地址
                    const account = await ogyQueryPayAccount(setAction, token_id, identity, spend);

                    // ? 4. 付款
                    await ogyPay(setAction, transfer, account, price, fee, spend);

                    // ? 5. 付款后进行购买
                    await ogyBidNft(setAction, identity, token_id, raw, token, price, spend);
                } else {
                    // ? 3. 创建订单阶段
                    const memo = await yumiCreateOrder(setAction, identity, token_id, spend);

                    // ? 4. 付款
                    const height = await yumiPay(setAction, transfer, price, memo, spend);

                    // ? 5. 取回所购买的 NFT
                    await yumiSubmitHeight(setAction, identity, token_id, height, token, spend);
                }

                // ? 6. 圆满完成
                return true;
            } catch (e) {
                console.debug(`🚀 ~ file: buy.tsx:138 ~ e:`, e);
                message.error(`Buy NFT failed: ${e}`);
            } finally {
                setAction(undefined); // 恢复状态
            }
            return false;
        },
        [
            checkIdentity,
            checkKyc,
            action,
            icpBalance,
            icpFee,
            icpDecimals,
            icpTransfer,
            ogyBalance,
            ogyFee,
            ogyDecimals,
            ogyTransfer,
        ],
    );

    return { buy, action };
};

const checkArgs = (
    identity: ConnectedIdentity,
    owner: string | undefined,
    failed: () => void,
): boolean => {
    // 检查不能是自己的 NFT
    if (owner && identity.account === owner) {
        failed();
        return false; // 防止购买自己的 NFT
    }

    return true;
};

const checkBalance = async (
    setAction: (action: BuyingAction) => void,
    token: TokenInfo,
    icpBalance: LedgerTokenBalance | undefined,
    icpFee: string,
    icpDecimals: number,
    icpTransfer: LedgerTransferExecutor,
    ogyBalance: LedgerTokenBalance | undefined,
    ogyFee: string,
    ogyDecimals: number,
    ogyTransfer: LedgerTransferExecutor,
    identity: ConnectedIdentity,
    spend: Spend,
    price: string,
    raw: BuyNftRaw,
): Promise<{ fee: string; transfer: LedgerTransferExecutor }> => {
    setAction('CHECKING_BALANCE');
    const { balance, fee, decimals, transfer, accountBalance } = (() => {
        switch (token.symbol) {
            case 'ICP':
                if (token.canister !== getLedgerIcpCanisterId())
                    throw new Error(`unsupported token: ${token.symbol}`);
                return {
                    balance: icpBalance,
                    fee: icpFee,
                    decimals: icpDecimals,
                    transfer: icpTransfer,
                    accountBalance: icpAccountBalance,
                };
            case 'OGY':
                if (token.canister !== getLedgerOgyCanisterId())
                    throw new Error(`unsupported token: ${token.symbol}`);
                return {
                    balance: ogyBalance,
                    fee: ogyFee,
                    decimals: ogyDecimals,
                    transfer: ogyTransfer,
                    accountBalance: ogyAccountBalance,
                };
            default:
                throw new Error(`unsupported token: ${token.symbol}`);
        }
    })();
    const e8s = balance?.e8s ?? (await accountBalance(identity.account)).e8s; // 没有余额的话, 就主动获取一下吧
    spend.mark(`CHECKING_BALANCE DONE`);
    const need =
        BigInt(price) + // 购买价格
        BigInt(fee) + // 本次转账费用
        (raw.standard === 'ogy'
            ? BigInt(fee) // ? OGY 这种模式,还要额外转一个手续费
            : BigInt(0));
    if (BigInt(e8s) < need)
        throw new Error(
            `Insufficient balance.(needs ${exponentNumber(`${need}`, -decimals)}${token.symbol})`,
        );

    return { fee, transfer };
};

const ogyQueryPayAccount = async (
    setAction: (action: BuyingAction) => void,
    token_id: NftIdentifier,
    identity: ConnectedIdentity,
    spend: Spend,
): Promise<string> => {
    setAction('OGY_QUERY_PAY_ACCOUNT');
    const account = await queryRechargeAccountByOgy(token_id.collection, identity.principal);
    console.debug(`ogy got pay account address:`, account);
    spend.mark(`OGY_QUERY_PAY_ACCOUNT DONE: got pay account address -> ${account}`);

    return account;
};

const ogyPay = async (
    setAction: (action: BuyingAction) => void,
    transfer: LedgerTransferExecutor,
    account: string,
    price: string,
    fee: string,
    spend: Spend,
): Promise<string> => {
    setAction('PAY');
    // ! 付款地址是 获得的 ogy 子地址
    const height = await transfer({
        to: account,
        amount: bigint2string(BigInt(price) + BigInt(fee)), // 额外费用
    });
    console.debug(`ogy buy nft paid ${price}, height:`, height);
    spend.mark(`PAY DONE: ${height}`);
    return height;
};

const ogyBidNft = async (
    setAction: (action: BuyingAction) => void,
    identity: ConnectedIdentity,
    token_id: NftIdentifier,
    raw: BuyNftRawOgy,
    token: TokenInfo,
    price: string,
    spend: Spend,
): Promise<void> => {
    setAction('OGY_BID_NFT');
    await bidNftByOgy(identity, token_id.collection, {
        sale_id: raw.sale_id,
        broker_id: raw.broker_id,
        token_identifier: token_id.token_identifier,
        seller: raw.seller,
        buyer: identity.principal,
        token,
        amount: price, // 告诉 ogy 可以使用的余额
    }).catch((e) => console.error('bid ogy failed: ' + e.message));
    spend.mark(`OGY_BID_NFT DONE`);
};

const yumiCreateOrder = async (
    setAction: (action: BuyingAction) => void,
    identity: ConnectedIdentity,
    token_id: NftIdentifier,
    spend: Spend,
): Promise<string> => {
    setAction('CREATING_ORDER');
    const { memo } = await createSingleBuyOrder(identity, token_id.token_identifier);
    console.debug(`created order memo:`, memo);
    spend.mark(`CREATING_ORDER DONE: got memo -> ${memo}`);

    return memo;
};

const yumiPay = async (
    setAction: (action: BuyingAction) => void,
    transfer: LedgerTransferExecutor,
    price: string,
    memo: string,
    spend: Spend,
): Promise<string> => {
    setAction('PAY');
    // ! 付款地址是 Core 罐子
    const yumi_account = principal2account(getYumiCoreCanisterId());
    const height = await transfer({
        to: yumi_account,
        amount: price,
        memo,
    });
    console.debug(`buy nft paid ${price}, height:`, height);
    spend.mark(`PAY DONE: ${height}`);

    return height;
};

const yumiSubmitHeight = async (
    setAction: (action: BuyingAction) => void,
    identity: ConnectedIdentity,
    token_id: NftIdentifier,
    height: string,
    token: TokenInfo,
    spend: Spend,
): Promise<void> => {
    setAction('SUBMITTING_HEIGHT');
    await submittingTransferHeight(identity, {
        token_id,
        height,
        token,
    });
    spend.mark(`SUBMITTING_HEIGHT DONE`);
};

// ================== 状态显示弹窗 ==================

export const useBuyingActionSteps = (
    action: BuyingAction,
    standard: SupportedNftStandard,
): {
    show: boolean;
    hide: () => void;
    failed: boolean;
    fail: () => void;
    title: string;
    actions: MarkAction<BuyingAction>[];
} => {
    const { show, hide, failed, fail } = useActionSteps(action);

    const { title, actions }: { title: string; actions: MarkAction<BuyingAction>[] } =
        useMemo(() => {
            const title = 'Buy NFT';
            const actions: MarkAction<BuyingAction>[] =
                standard === 'ogy'
                    ? [
                          {
                              title: 'Check order status and check wallet balance',
                              actions: ['CHECKING_KYC', 'CHECKING_BALANCE'],
                          },
                          {
                              actions: ['OGY_QUERY_PAY_ACCOUNT'],
                              title: 'Query pay account',
                          },
                          {
                              actions: ['PAY'],
                              title: 'Pay',
                          },
                          {
                              actions: ['OGY_BID_NFT'],
                              title: 'Purchasing your NFT',
                          },
                          {
                              actions: ['OGY_BID_NFT_SUCCESS'],
                              title: 'Check your NFT purchased',
                          },
                      ]
                    : [
                          {
                              title: 'Check order status and check wallet balance',
                              actions: ['DOING', 'CHECKING_KYC', 'CHECKING_BALANCE'],
                          },
                          {
                              title: 'Calling the wallet to initiate a transfer',
                              actions: ['CREATING_ORDER'],
                          },
                          { title: 'Calling Ledger to validate transactions', actions: ['PAY'] },
                          { title: 'Transferring item', actions: ['SUBMITTING_HEIGHT'] },
                      ];
            return { title, actions };
        }, [standard]);

    return {
        show,
        hide,
        failed,
        fail,
        title,
        actions,
    };
};

// 发出购买交易
export const useBuyNftByTransaction = (): {
    buy: BuyNftExecutor;
    action: BuyingAction;
} => {
    const checkIdentity = useCheckIdentity();

    const message = useMessage();

    const insert = useTransactionStore((s) => s.insert);

    const [id, setId] = useState<string | undefined>(undefined);
    const { record } = useTransactionRecords(id);

    const buy = useCallback(
        async (
            token_id: NftIdentifier,
            owner: string | undefined,
            token: TokenInfo,
            price: string,
            raw: BuyNftRaw,
        ): Promise<boolean> => {
            const identity = checkIdentity();
            if (!checkArgs(identity, owner, () => message.warning(`You can't buy your own NFT`)))
                return false;

            const id = await insert(identity.principal, {
                type: 'single-buy',
                args: { token_id, owner: owner!, token, price, raw },
                actions: [],
                paid: 0,
            }).catch((e) => {
                message.error(e.message);
                return undefined;
            });
            if (!id) return false;
            setId(id);

            // ? LARK 通知
            larkNoticeSingleBuyInitial(
                getBackendType(),
                id,
                identity.principal,
                token_id,
                token,
                price,
                raw.standard === 'ogy'
                    ? `sale_id: ${raw.sale_id}
                broker_id: ${raw.broker_id}
                seller: ${raw.seller}`
                    : '',
            );
            throw new Error(`already recorded transaction`);
        },
        [checkIdentity, insert],
    );

    const action = useMemo(() => {
        if (record === undefined) return undefined;
        const transaction = record.transaction as SingleBuyTransaction;
        const actions = transaction.actions;
        if (actions.length === 0) return undefined;
        return actions[actions.length - 1].action;
    }, [record]);

    return { buy, action };
};

// 交易执行
export const useDoBuyNftByTransaction = (): BuyNftByTransactionExecutor => {
    const checkIdentity = useCheckIdentity();
    const checkKyc = useCheckKyc();

    const message = useMessage();

    const update = useTransactionStore((s) => s.update);

    // 需要使用转账
    const {
        balance: icpBalance,
        fee: icpFee,
        decimals: icpDecimals,
        transfer: icpTransfer,
    } = useTransferByICP(true);
    const {
        balance: ogyBalance,
        fee: ogyFee,
        decimals: ogyDecimals,
        transfer: ogyTransfer,
    } = useTransferByOGY(true);

    const doBuy = useCallback(
        async (id: string, created: number, transaction: SingleBuyTransaction, manual: boolean) => {
            const identity = checkIdentity();
            if (
                !checkArgs(identity, transaction.args.owner, () =>
                    message.warning(`You can't buy your own NFT`),
                )
            )
                return;
            if (!transaction_executing(id)) return; // 已经执行了，不能重复执行

            const spend = Spend.start(
                `buy nft by transaction ${uniqueKey(transaction.args.token_id)}`,
            );
            let done_action = false;
            function doAction<T>(
                action: BuyingAction,
                fetch_action: (action: SingleBuyAction<T>) => Promise<T>,
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
                        const now = larkNoticeSingleBuy(0, getBackendType(), id, action ?? '');
                        do_action()
                            .then((d) => {
                                // ? LARK 通知
                                larkNoticeSingleBuy(
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

            const setAction = () => {};

            try {
                // ? 0. 检查白名单
                await checkWhitelist(identity, [
                    transaction.args.token.canister,
                    transaction.args.token_id.collection,
                ]);

                await doAction(
                    'DOING',
                    async () => {},
                    async () => {
                        transaction.actions.push({ action: 'DOING', timestamp: Date.now() });
                        await update(id, transaction, 'executing');
                    },
                );
                if (done_action) return;

                // ? 1. 检查KYC
                await doAction(
                    'CHECKING_KYC',
                    async () => {},
                    async () => {
                        await checkKyc({
                            requirement: true,
                            after: () => spend.mark(`CHECKING_KYC DONE`),
                        });
                        transaction.actions.push({ action: 'CHECKING_KYC', timestamp: Date.now() });
                        await update(id, transaction, 'executing');
                    },
                );
                if (done_action) return;

                // ? 2. 检查余额 // 每次都要检查
                const { fee, transfer } = await (async () => {
                    if (transaction.actions.find((a) => a.action === 'PAY'))
                        return { fee: icpFee, transfer: icpTransfer };
                    const checkedBalance = transaction.actions.find(
                        (a) => a.action === 'CHECKING_BALANCE',
                    );
                    if (checkedBalance && Date.now() < checkedBalance.timestamp + 15000) {
                        switch (transaction.args.token.symbol) {
                            case 'ICP':
                                return {
                                    fee: icpFee,
                                    transfer: icpTransfer,
                                };
                            case 'OGY':
                                return {
                                    fee: ogyFee,
                                    transfer: ogyTransfer,
                                };
                            default:
                                throw new Error(
                                    `unsupported token: ${transaction.args.token.symbol}`,
                                );
                        }
                    }
                    const r = await checkBalance(
                        setAction,
                        transaction.args.token,
                        icpBalance,
                        icpFee,
                        icpDecimals,
                        icpTransfer,
                        ogyBalance,
                        ogyFee,
                        ogyDecimals,
                        ogyTransfer,
                        identity,
                        spend,
                        transaction.args.price,
                        transaction.args.raw,
                    ); // 在上次的检查余额后面插入一条记录
                    let index = -1;
                    for (let i = transaction.actions.length - 1; 0 <= i; i--) {
                        if (transaction.actions[i].action === 'CHECKING_BALANCE') {
                            index = i;
                            break;
                        }
                    }
                    if (index < 0)
                        transaction.actions.push({
                            action: 'CHECKING_BALANCE',
                            timestamp: Date.now(),
                        });
                    else
                        transaction.actions.splice(index, 0, {
                            action: 'CHECKING_BALANCE',
                            timestamp: Date.now(),
                        });
                    await update(id, transaction, 'executing');
                    return r;
                })();

                // ? 3 第三步开始不一样了
                if (transaction.args.raw.standard === 'ogy') {
                    const raw = transaction.args.raw as BuyNftRawOgy;
                    // ? 3. 查询付款地址
                    const account = await doAction(
                        'OGY_QUERY_PAY_ACCOUNT',
                        async (action) => action.data!,
                        async () => {
                            const account = await ogyQueryPayAccount(
                                setAction,
                                transaction.args.token_id,
                                identity,
                                spend,
                            );
                            transaction.actions.push({
                                action: 'OGY_QUERY_PAY_ACCOUNT',
                                timestamp: Date.now(),
                                data: account,
                            });
                            await update(id, transaction, 'executing');
                            return account;
                        },
                    );
                    if (done_action) return;

                    // ? 4. 付款
                    if (
                        transaction.actions.find((a) => a.action === 'PAY') ||
                        transaction.paid === 0 ||
                        manual
                    ) {
                        await doAction(
                            'PAY',
                            async () => {},
                            async () => {
                                transaction.paid++; // 记录支付次数
                                await update(id, transaction, 'executing');
                                const height = await ogyPay(
                                    setAction,
                                    transfer,
                                    account,
                                    transaction.args.price,
                                    fee,
                                    spend,
                                );
                                if (!height) {
                                    throw new Error(`Pay failed. Contact Yumi.`);
                                }
                                transaction.actions.push({
                                    action: 'PAY',
                                    timestamp: Date.now(),
                                });
                                await update(id, transaction, 'executing');
                            },
                        );
                    } else {
                        // ! 报错, 不允许自动执行支付
                        throw new Error('auto pay is forbidden');
                    }
                    if (done_action) return;

                    // ? 5. 付款后进行购买
                    await doAction(
                        'OGY_BID_NFT',
                        async () => {},
                        async () => {
                            await ogyBidNft(
                                setAction,
                                identity,
                                transaction.args.token_id,
                                raw,
                                transaction.args.token,
                                transaction.args.price,
                                spend,
                            );
                            transaction.actions.push({
                                action: 'OGY_BID_NFT',
                                timestamp: Date.now(),
                            });
                        },
                    );
                    // ? 6. 检查bid是否成功
                    (async () => {
                        const isSelf = await checkGoldIsSelf(
                            identity,
                            transaction.args.token_id.collection,
                            transaction.args.token_id.token_identifier,
                        );
                        const isListing =
                            (await queryNftListingData('ogy', transaction.args.token_id)).listing
                                .type === 'listing';

                        if (!isListing && !isSelf) {
                            throw new Error('batch buy gold failed,purchased by someone already.');
                        }
                        if (!isListing && isSelf) {
                            transaction.actions.push({
                                action: 'OGY_BID_NFT_SUCCESS',
                                timestamp: Date.now(),
                            });
                            await update(id, transaction, 'successful');
                        }
                    })();

                    // ? LARK 通知
                    larkNoticeSingleBuyOver(
                        created,
                        getBackendType(),
                        id,
                        identity.principal,
                        transaction.args.token_id,
                        transaction.args.token,
                        transaction.args.price,
                        `Actions: ${transaction.actions
                            .map((a) => `${a.action}(${a.timestamp})${a.data ? `: ${a.data}` : ''}`)
                            .join('\n\t')}`,
                    );
                } else {
                    // ? 3. 创建订单阶段
                    const memo = await doAction(
                        'CREATING_ORDER',
                        async (action) => action.data!,
                        async () => {
                            const memo = await yumiCreateOrder(
                                setAction,
                                identity,
                                transaction.args.token_id,
                                spend,
                            );
                            transaction.actions.push({
                                action: 'CREATING_ORDER',
                                timestamp: Date.now(),
                                data: memo,
                            });
                            await update(id, transaction, 'executing');
                            return memo;
                        },
                    );
                    if (done_action) return;

                    // ? 4. 付款
                    let height: string;
                    if (
                        transaction.actions.find((a) => a.action === 'PAY') ||
                        transaction.paid === 0 ||
                        manual
                    ) {
                        height = await doAction(
                            'PAY',
                            async (action) => action.data!,
                            async () => {
                                transaction.paid++; // 记录支付次数
                                await update(id, transaction, 'executing');
                                const height = await yumiPay(
                                    setAction,
                                    transfer,
                                    transaction.args.price,
                                    memo,
                                    spend,
                                );
                                if (!height) {
                                    throw new Error(
                                        `Pay failed. Contact Yumi with order id: ${memo}`,
                                    );
                                }
                                transaction.actions.push({
                                    action: 'PAY',
                                    timestamp: Date.now(),
                                    data: height,
                                });
                                await update(id, transaction, 'executing');
                                return height;
                            },
                        );
                    } else {
                        // ! 报错, 不允许自动执行支付
                        throw new Error('auto pay is forbidden');
                    }
                    if (done_action) return;

                    // ? 5. 取回所购买的 NFT
                    await doAction(
                        'SUBMITTING_HEIGHT',
                        async () => {},
                        async () => {
                            await yumiSubmitHeight(
                                setAction,
                                identity,
                                transaction.args.token_id,
                                height,
                                transaction.args.token,
                                spend,
                            );
                            transaction.actions.push({
                                action: 'SUBMITTING_HEIGHT',
                                timestamp: Date.now(),
                                data: height,
                            });
                            await update(id, transaction, 'successful');
                        },
                    );

                    // ? LARK 通知
                    larkNoticeSingleBuyOver(
                        created,
                        getBackendType(),
                        id,
                        identity.principal,
                        transaction.args.token_id,
                        transaction.args.token,
                        transaction.args.price,
                        `Actions: ${transaction.actions
                            .map((a) => `${a.action}(${a.timestamp})${a.data ? `: ${a.data}` : ''}`)
                            .join('\n\t')}`,
                    );
                }
            } catch (e: any) {
                console.debug(`🚀 ~ file: buy.tsx:619 ~ e:`, e);
                const message = `${e.message ?? e}`;
                const log_error = !ERRS_NOT_SEND.find((m) => message.indexOf(m) !== -1);
                // ? LARK 通知
                larkNoticeSingleBuyFailed(
                    created,
                    getBackendType(),
                    id,
                    identity.principal,
                    transaction.args.token_id,
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
        [
            checkIdentity,
            update,
            checkKyc,
            icpBalance,
            icpFee,
            icpDecimals,
            icpTransfer,
            ogyBalance,
            ogyFee,
            ogyDecimals,
            ogyTransfer,
        ],
    );

    return doBuy;
};

export const checkGoldIsSelf = async (
    identity: ConnectedIdentity,
    collection: string,
    token_identifier: string,
): Promise<boolean> => {
    const account = await querySingleTokenOwnerByOgy(identity, collection, token_identifier);
    return identity.account === account;
};

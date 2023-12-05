import { useCallback, useMemo, useState } from 'react';
import { message } from 'antd';
import _ from 'lodash';
import { LedgerTokenBalance } from '@/01_types/canisters/ledgers';
import {
    BatchBuyingAction,
    BatchBuyingByTransactionExecutor,
    BatchBuyingTransaction,
    BatchBuyNftExecutor,
} from '@/01_types/exchange/batch-buy';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftListing, NftListingListing } from '@/01_types/listing';
import { NftIdentifier } from '@/01_types/nft';
import { NftTokenOwner } from '@/01_types/nft';
import { exponentNumber } from '@/02_common/data/numbers';
import { principal2account } from '@/02_common/ic/account';
import { parse_nft_identifier } from '@/02_common/nft/ext';
import { uniqueKey } from '@/02_common/nft/identifier';
import { Spend } from '@/02_common/react/spend';
import { bigint2string, string2bigint } from '@/02_common/types/bigint';
import { BatchOrderInfo } from '@/03_canisters/yumi/yumi_core';
import {
    larkNoticeBatchBuy,
    larkNoticeBatchBuyFailed,
    larkNoticeBatchBuyInitial,
    larkNoticeBatchBuyOver,
} from '@/04_apis/yumi-logs/batch-buy';
import { ERRS_NOT_SEND } from '@/04_apis/yumi-logs/special';
import { getBackendType } from '@/05_utils/app/backend';
import { icpAccountBalance } from '@/05_utils/canisters/ledgers/icp';
import { getLedgerIcpCanisterId } from '@/05_utils/canisters/ledgers/special';
import { createBatchBuyOrder, submittingTransferBatchHeight } from '@/05_utils/canisters/yumi/core';
import { getYumiCoreCanisterId } from '@/05_utils/canisters/yumi/special';
import { useTransactionStore } from '@/07_stores/transaction';
import { useMessage } from '@/08_hooks/common/message';
import { useCheckAction } from '../../common/action';
import { useCheckIdentity } from '../../common/identity';
import { useCheckKyc } from '../../common/kyc';
import { checkWhitelist } from '../../common/whitelist';
import { LedgerTransferExecutor, useTransferByICP } from '../../ledger/transfer';
import { transaction_executed, transaction_executing } from '../executing';
import useActionSteps, { MarkAction, useDoAction, useLatestAction } from '../steps';

export const useBatchBuyingActionSteps = (
    action: BatchBuyingAction,
): {
    show: boolean;
    hide: () => void;
    failed: boolean;
    fail: () => void;
    title: string;
    actions: MarkAction<BatchBuyingAction>[];
} => {
    const { show, hide, failed, fail } = useActionSteps(action);

    const { title, actions }: { title: string; actions: MarkAction<BatchBuyingAction>[] } =
        useMemo(() => {
            const title = 'Buy NFT';
            const actions: MarkAction<BatchBuyingAction>[] = [
                {
                    title: 'Check order status and check wallet balance',
                    actions: ['DOING', 'CHECKING_KYC', 'CHECKING_BALANCE', 'CREATING_BATCH_ORDER'],
                },
                { title: 'Calling Ledger to validate transactions', actions: ['PAY'] },
                { title: 'Transferring item', actions: ['SUBMITTING_HEIGHT'] },
            ];
            return { title, actions };
        }, []);

    return {
        show,
        hide,
        failed,
        fail,
        title,
        actions,
    };
};

export const useBatchBuyNft = (): {
    batchBuy: BatchBuyNftExecutor;
    action: BatchBuyingAction;
} => {
    const checkIdentity = useCheckIdentity();
    const checkAction = useCheckAction();
    const checkKyc = useCheckKyc();

    // 标记当前状态
    const [action, setAction] = useState<BatchBuyingAction>(undefined);

    // 需要使用转账
    const { balance, fee, decimals, transfer } = useTransferByICP();

    const batchBuy = useCallback(
        async (
            token_list: {
                owner: NftTokenOwner;
                listing: NftListing;
            }[],
        ): Promise<NftIdentifier[] | undefined> => {
            const identity = checkIdentity();
            const token_id_list = token_list.map((t) => t.owner.token_id);
            if (!checkArgs(identity, token_list)) return undefined;
            checkAction(action, `Batch purchasing`); // 防止重复点击

            setAction('DOING');
            try {
                // ? 0. 检查白名单
                await checkWhitelist(identity, [
                    ...token_list.map((item) => item.owner.token_id.collection),
                    ...token_list.map((item) =>
                        item.listing.type === 'listing' ? item.listing.token.canister : '',
                    ),
                ]);

                const spend = Spend.start(
                    `batch buy nft ${token_list
                        .map((o) => o.owner.token_id)
                        .map(uniqueKey)
                        .join('/')}`,
                );

                // ? 1. 检查KYC
                await checkKyc({
                    before: () => setAction('CHECKING_KYC'),
                    requirement: true,
                    after: () => spend.mark(`${action} DONE`),
                });

                // ? 2. 创建批量订单阶段
                const { memo, price } = await createBatchOrder(
                    setAction,
                    identity,
                    token_list,
                    spend,
                );

                // ? 3. 检查余额 只支持 ICP
                await checkBalance(setAction, balance, identity, spend, price, fee, decimals);

                // ? 4. 付款
                const height = await doPay(setAction, transfer, price, memo, spend);

                // ? 5. 取回所购买的 NFT
                const success_id = await submit(setAction, identity, height, spend, token_id_list);

                // ? 6. 圆满完成
                return success_id.map(parse_nft_identifier);
            } catch (e) {
                console.debug(`🚀 ~ file: buy.tsx:138 ~ e:`, e);
                message.error(`Buy NFT failed: ${e}`);
            } finally {
                setAction(undefined); // 恢复状态
            }
        },
        [checkIdentity, checkKyc, action, balance, fee, decimals, transfer],
    );

    return { batchBuy, action };
};

// 发出批量购买交易
export const useBatchBuyNftByTransaction = (): {
    batchBuy: BatchBuyNftExecutor;
    action: BatchBuyingAction;
} => {
    const checkIdentity = useCheckIdentity();

    const message = useMessage();

    const insert = useTransactionStore((s) => s.insert);

    const [id, setId] = useState<string | undefined>(undefined);

    const batchBuy = useCallback(
        async (
            token_list: {
                owner: NftTokenOwner;
                listing: NftListing;
            }[],
        ): Promise<NftIdentifier[] | undefined> => {
            const identity = checkIdentity();
            if (!checkArgs(identity, token_list)) return undefined;

            const id = await insert(identity.principal, {
                type: 'batch-buy',
                args: { token_list },
                actions: [],
                paid: 0,
            }).catch((e) => {
                console.debug('🚀 ~ file: batch buy.tsx:143 ~ e:', e);
                message.error(e.message);
                return undefined;
            });
            if (!id) return undefined;
            setId(id);
            // ? LARK 通知
            larkNoticeBatchBuyInitial(
                getBackendType(),
                id,
                identity.principal,
                token_list.map((i) => i.owner.token_id),
                token_list
                    .map((i) => (i.listing as NftListingListing).price)
                    .reduce((a, b) => bigint2string(string2bigint(a) + string2bigint(b)), ''),
                '',
            );
            throw new Error(`already recorded transaction`);
        },
        [checkIdentity, insert],
    );
    const action = useLatestAction<BatchBuyingTransaction, BatchBuyingAction>(id);

    return { batchBuy, action };
};

// 交易执行
export const useDoBatchBuyNftByTransaction = (): BatchBuyingByTransactionExecutor => {
    const checkIdentity = useCheckIdentity();
    const checkKyc = useCheckKyc();

    // 需要使用转账
    const {
        balance: icpBalance,
        fee: icpFee,
        decimals: icpDecimals,
        transfer: icpTransfer,
    } = useTransferByICP(true);
    const update = useTransactionStore((s) => s.update);
    // doAction方法
    const doAction = useDoAction<BatchBuyingAction, any>();
    const doBatchBuy = useCallback(
        async (
            id: string,
            created: number,
            transaction: BatchBuyingTransaction,
            manual: boolean,
        ) => {
            const identity = checkIdentity();
            const token_list = transaction.args.token_list;
            const token_id_list = token_list.map((t) => t.owner.token_id);
            if (!checkArgs(identity, transaction.args.token_list)) return undefined;
            if (!transaction_executing(id)) return; // 已经执行了，不能重复执行

            const spend = Spend.start(
                `batch buy nft ${token_list
                    .map((o) => o.owner.token_id)
                    .map(uniqueKey)
                    .join('/')}`,
            );

            let done_action = false;
            const set_action_done = () => {
                done_action = true;
            };
            const setAction = () => {};
            const lark_notice_before = function (action: BatchBuyingAction): number {
                return larkNoticeBatchBuy(0, getBackendType(), id, action ?? '');
            };
            const lark_notice_after = function (
                now: number,
                action: BatchBuyingAction,
                data?: string,
            ): void {
                larkNoticeBatchBuy(
                    now,
                    getBackendType(),
                    id,
                    action ?? '',
                    data ? `${JSON.stringify(data)}` : undefined,
                );
            };

            try {
                // ? 0. 检查白名单
                await checkWhitelist(identity, [
                    ...token_list.map((item) => item.owner.token_id.collection),
                    ...token_list.map((item) =>
                        item.listing.type === 'listing' ? item.listing.token.canister : '',
                    ),
                ]);

                await doAction('DOING', transaction, {
                    fetch_action: async () => {},
                    do_action: async () => {
                        transaction.actions.push({ action: 'DOING', timestamp: Date.now() });
                        await update(id, transaction, 'executing');
                    },
                    set_action_done,
                    spend,
                    lark_notice_before,
                    lark_notice_after,
                });

                if (done_action) return;

                // ? 1. 检查KYC
                await doAction('CHECKING_KYC', transaction, {
                    fetch_action: async () => {},
                    do_action: async () => {
                        await checkKyc({
                            requirement: true,
                            after: () => spend.mark(`CHECKING_KYC DONE`),
                        });
                        transaction.actions.push({ action: 'CHECKING_KYC', timestamp: Date.now() });
                        await update(id, transaction, 'executing');
                    },
                    set_action_done,
                    spend,
                    lark_notice_before,
                    lark_notice_after,
                });
                if (done_action) return;

                // ? 2. 创建批量订单阶段

                const { memo, price } = await doAction('CREATING_BATCH_ORDER', transaction, {
                    fetch_action: async (action) => action.data!,
                    do_action: async () => {
                        const { memo, price } = await createBatchOrder(
                            setAction,
                            identity,
                            token_list,
                            spend,
                        );
                        transaction.actions.push({
                            action: 'CREATING_BATCH_ORDER',
                            timestamp: Date.now(),
                            data: { memo, price },
                        });
                        await update(id, transaction, 'executing');
                        return { memo, price };
                    },
                    set_action_done,
                    spend,
                    lark_notice_before,
                    lark_notice_after,
                });

                if (done_action) return;
                // ? 3. 检查余额 // 每次都要检查
                const { transfer } = await (async () => {
                    if (transaction.actions.find((a) => a.action === 'PAY'))
                        return { transfer: icpTransfer };
                    const checkedBalance = transaction.actions.find(
                        (a) => a.action === 'CHECKING_BALANCE',
                    );
                    if (checkedBalance && Date.now() < checkedBalance.timestamp + 15000) {
                        return {
                            transfer: icpTransfer,
                        };
                    }

                    await checkBalance(
                        setAction,
                        icpBalance,
                        identity,
                        spend,
                        price,
                        icpFee,
                        icpDecimals,
                    );
                    // 在上次的检查余额后面插入一条记录
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
                    return {
                        fee: icpFee,
                        transfer: icpTransfer,
                    };
                })();
                // ? 4. 付款
                let height: string;

                if (
                    transaction.actions.find((a) => a.action === 'PAY') ||
                    transaction.paid === 0 ||
                    manual
                ) {
                    const { height: action_height } = await doAction('PAY', transaction, {
                        fetch_action: async (action) => action.data!,
                        do_action: async () => {
                            transaction.paid++; // 记录支付次数
                            await update(id, transaction, 'executing');

                            const height = await doPay(setAction, transfer, price, memo, spend);
                            if (!height) {
                                throw new Error(
                                    `Pay failed. Contact Yumi with order id: ${height}`,
                                );
                            }
                            transaction.actions.push({
                                action: 'PAY',
                                timestamp: Date.now(),
                                data: { height },
                            });
                            await update(id, transaction, 'executing');
                            return { height };
                        },
                        set_action_done,
                        spend,
                        lark_notice_before,
                        lark_notice_after,
                    });
                    height = action_height;
                } else {
                    // ! 报错, 不允许自动执行支付
                    throw new Error('auto pay is forbidden');
                }

                // ? 5. 取回所购买的 NFT
                await doAction('SUBMITTING_HEIGHT', transaction, {
                    fetch_action: async () => {},
                    do_action: async () => {
                        const success_id = await submit(
                            setAction,
                            identity,
                            height,
                            spend,
                            token_id_list,
                        );
                        transaction.actions.push({
                            action: 'SUBMITTING_HEIGHT',
                            timestamp: Date.now(),
                            data: success_id,
                        });
                        await update(id, transaction, 'successful');
                    },
                    set_action_done,
                    spend,
                    lark_notice_before,
                    lark_notice_after,
                });
                // ? LARK 通知
                larkNoticeBatchBuyOver(
                    created,
                    getBackendType(),
                    id,
                    identity.principal,
                    transaction.args.token_list.map((i) => i.owner.token_id),
                    price,
                    `Actions: ${transaction.actions
                        .map(
                            (a) =>
                                `${a.action}(${a.timestamp})${
                                    a.data ? `: ${JSON.stringify(a.data)}` : ''
                                }`,
                        )
                        .join('\n\t')}`,
                );
            } catch (e: any) {
                const message = `${e.message ?? e}`;
                const log_error = !ERRS_NOT_SEND.find((m) => message.indexOf(m) !== -1);
                // ? LARK 通知
                larkNoticeBatchBuyFailed(
                    created,
                    getBackendType(),
                    id,
                    identity.principal,
                    transaction.args.token_list.map((i) => i.owner.token_id),
                    transaction.args.token_list
                        .map((i) => (i.listing as NftListingListing).price)
                        .reduce((a, b) => bigint2string(string2bigint(a) + string2bigint(b)), ''),
                    `Actions: ${transaction.actions
                        .map(
                            (a) =>
                                `${a.action}(${a.timestamp})${
                                    a.data ? `: ${JSON.stringify(a.data)}` : ''
                                }`,
                        )
                        .join('\n\t')}`,
                    message,
                    log_error,
                );

                await update(id, transaction, 'failed', message);
            } finally {
                transaction_executed(id);
            }
        },
        [checkIdentity, update, checkKyc, icpBalance, icpFee, icpDecimals, icpTransfer],
    );
    return doBatchBuy;
};
const checkArgs = (
    identity: ConnectedIdentity,
    token_list: {
        owner: NftTokenOwner;
        listing: NftListing;
    }[],
): boolean => {
    // 检查不能是自己的 NFT
    const owner_account = identity.account;
    for (const o of token_list) {
        if (o.owner.owner === owner_account) {
            message.warning(`You can't buy your own NFT`);
            return false; // 防止购买自己的 NFT
        }
    }
    // 检查挂单代币只能是 ICP
    for (const o of token_list) {
        if (o.listing.type !== 'listing') {
            message.warning(`NFT is not listing`);
            return false; // 没有挂单
        }
        if (o.listing.token.canister !== getLedgerIcpCanisterId()) {
            message.warning(`Token is not supported`);
            return false; // 不支持代币
        }
    }
    // 检查不能重复
    if (_.uniq(token_list.map((o) => o.owner.token_id).map(uniqueKey)).length < token_list.length) {
        message.warning(`NFT is repeated`);
        return false; //  NFT 不能重复
    }

    return true;
};

const createBatchOrder = async (
    setAction: (action: BatchBuyingAction) => void,
    identity: ConnectedIdentity,
    token_list: {
        owner: NftTokenOwner;
        listing: NftListing;
    }[],
    spend: Spend,
): Promise<BatchOrderInfo> => {
    setAction('CREATING_BATCH_ORDER');
    const { memo, price } = await createBatchBuyOrder(
        identity,
        token_list.map((o) => o.owner.token_id.token_identifier),
    );
    console.debug(`created batch order memo: ${memo} price: ${price}`);
    spend.mark(`CREATING_BATCH_ORDER DONE: got memo -> ${memo} | price -> ${price}`);
    return { memo, price };
};

const checkBalance = async (
    setAction: (action: BatchBuyingAction) => void,
    balance: LedgerTokenBalance | undefined,
    identity: ConnectedIdentity,
    spend: Spend,
    price: string,
    fee: string,
    decimals: number,
): Promise<void> => {
    setAction('CHECKING_BALANCE');
    const e8s = balance?.e8s ?? (await icpAccountBalance(identity.account)).e8s; // 没有余额的话, 就主动获取一下吧
    spend.mark(`CHECKING_BALANCE DONE`);
    const need = BigInt(price) + BigInt(fee);
    if (BigInt(e8s) < need)
        throw new Error(`Insufficient balance.(needs ${exponentNumber(`${need}`, -decimals)}ICP)`);
};

const doPay = async (
    setAction: (action: BatchBuyingAction) => void,
    transfer: LedgerTransferExecutor,
    price: string,
    memo: string,
    spend: Spend,
): Promise<string> => {
    setAction('PAY');
    // ! 付款地址是 Yumi 核心罐子
    const yumi_account = principal2account(getYumiCoreCanisterId());
    const height = await transfer({
        to: yumi_account,
        amount: price,
        memo,
    });
    console.debug(`batch buy nft paid ${price}, height:`, height);
    spend.mark(`PAY DONE: ${height}`);

    return height;
};

const submit = async (
    setAction: (action: BatchBuyingAction) => void,
    identity: ConnectedIdentity,
    height: string,
    spend: Spend,
    token_id_list: NftIdentifier[],
): Promise<string[]> => {
    setAction('SUBMITTING_HEIGHT');
    const success_id = await submittingTransferBatchHeight(identity, height, token_id_list);
    spend.mark(`SUBMITTING_HEIGHT DONE`);
    return success_id;
};

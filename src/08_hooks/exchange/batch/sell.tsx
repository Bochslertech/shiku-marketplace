import { useCallback, useMemo, useState } from 'react';
import { message } from 'antd';
import _ from 'lodash';
import { SupportedLedgerTokenSymbol } from '@/01_types/canisters/ledgers';
import {
    BatchSellingAction,
    BatchSellingByTransactionExecutor,
    BatchSellingTransaction,
    BatchSellNftExecutor,
} from '@/01_types/exchange/batch-sell';
import { ConnectedIdentity } from '@/01_types/identity';
import { BatchNftSale } from '@/01_types/yumi';
import { exponentNumber } from '@/02_common/data/numbers';
import { uniqueKey } from '@/02_common/nft/identifier';
import { Spend } from '@/02_common/react/spend';
import { bigint2string, string2bigint } from '@/02_common/types/bigint';
import {
    larkNoticeBatchSell,
    larkNoticeBatchSellFailed,
    larkNoticeBatchSellInitial,
    larkNoticeBatchSellOver,
} from '@/04_apis/yumi-logs/batch-sell';
import { ERRS_NOT_SEND } from '@/04_apis/yumi-logs/special';
import { getBackendType } from '@/05_utils/app/backend';
import { getTokenDecimals } from '@/05_utils/canisters/ledgers/special';
import { batchListing } from '@/05_utils/canisters/yumi/core';
import { useTransactionStore } from '@/07_stores/transaction';
import { useCheckIdentity } from '@/08_hooks/common/identity';
import { useMessage } from '@/08_hooks/common/message';
import { useTransactionRecords } from '@/08_hooks/stores/transaction';
import { useCheckAction } from '../../common/action';
import { checkWhitelist } from '../../common/whitelist';
import { transaction_executed, transaction_executing } from '../executing';
import { doApprove } from '../single/sell';
import useActionSteps, { MarkAction, useDoAction } from '../steps';

export const useBatchSellNft = (): {
    batchSell: BatchSellNftExecutor;
    action: BatchSellingAction;
    success: BatchNftSale[] | undefined;
    failed: BatchNftSale[] | undefined;
} => {
    const checkAction = useCheckAction();

    // 标记当前状态
    const [action, setAction] = useState<BatchSellingAction>(undefined);
    const [success, setSuccess] = useState<BatchNftSale[] | undefined>(undefined);
    const [failed, setFailed] = useState<BatchNftSale[] | undefined>(undefined);

    const batchSell = useCallback(
        async (
            identity: ConnectedIdentity,
            sales: BatchNftSale[],
        ): Promise<BatchNftSale[] | undefined> => {
            if (!checkArgs(identity, sales)) return undefined;
            checkAction(action, `Batch selling`); // 防止重复点击

            setAction('DOING');
            try {
                // ? 0. 检查白名单
                await checkWhitelist(identity, [...sales.map((item) => item.token_id.collection)]);

                const spend = Spend.start(
                    `batch sell nfts ${sales.map((s) => uniqueKey(s.token_id)).join('|')}`,
                );

                // ? 1. 批量需要考虑先允许白名单
                await checkBatchWhiteList(setAction, spend);

                // ? 2. 统一前置授权阶段
                const success: BatchNftSale[] = [];
                const failed: BatchNftSale[] = [];
                await doBatchApproving(
                    setAction,
                    success,
                    failed,
                    setSuccess,
                    setFailed,
                    identity,
                    sales,
                    spend,
                );

                // ? 3. Yumi 记录上架信息阶段
                await doYumiRecord(setAction, success, identity, spend);

                // ? 3. 圆满完成
                return sales;
            } catch (e) {
                console.debug(`🚀 ~ file: sell.tsx:90 ~ e:`, e);
                message.error(`Batch sell NFT failed: ${e}`);
            } finally {
                setAction(undefined); // 恢复状态
            }
        },
        [action],
    );

    return { batchSell, action, success, failed };
};
export const useBatchSellingActionSteps = (
    action: BatchSellingAction,
): {
    show: boolean;
    hide: () => void;
    failed: boolean;
    fail: () => void;
    title: string;
    actions: MarkAction<BatchSellingAction>[];
} => {
    const { show, hide, failed, fail } = useActionSteps(action);

    const { title, actions }: { title: string; actions: MarkAction<BatchSellingAction>[] } =
        useMemo(() => {
            const title = 'Batch Sell NFT';
            const actions: MarkAction<BatchSellingAction>[] = [
                {
                    title: 'Check order status and check wallet balance',
                    actions: ['DOING', 'BATCH_WHITELIST'],
                },
                {
                    title: 'Approving ',
                    actions: ['BATCH_APPROVING'],
                },
                {
                    title: 'Committing your listings',
                    actions: ['BATCH_YUMI_LISTING'],
                },
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
const getBatchSellTotalPrice = (sales: BatchNftSale[], symbol: SupportedLedgerTokenSymbol) => {
    const price = sales
        .filter((s) => s.token.symbol.toLocaleUpperCase() === symbol)
        .map((s) => s.price)
        .reduce((a, b) => bigint2string(string2bigint(a) + string2bigint(b)), '');
    return exponentNumber(price, -getTokenDecimals(symbol));
};
// 发出卖出交易
export const useBatchSellNftByTransaction = (): {
    batchSell: BatchSellNftExecutor;
    executing: boolean;
} => {
    const message = useMessage();

    const insert = useTransactionStore((s) => s.insert);

    const [id, setId] = useState<string | undefined>(undefined);
    const { record } = useTransactionRecords(id);

    const batchSell = useCallback(
        async (
            identity: ConnectedIdentity,
            sales: BatchNftSale[],
        ): Promise<BatchNftSale[] | undefined> => {
            if (!checkArgs(identity, sales)) return undefined;
            const price_icp = getBatchSellTotalPrice(sales, 'ICP');
            const price_ogy = getBatchSellTotalPrice(sales, 'OGY');
            // 防止重复点击
            if (record?.status === 'executing') {
                return undefined;
            }
            const id = await insert(identity.principal, {
                type: 'batch-sell',
                args: { sales },
                actions: [],
            }).catch((e) => {
                message.error(e.message);
                return undefined;
            });
            if (!id) return;
            setId(id);
            // ? LARK 通知
            larkNoticeBatchSellInitial(
                getBackendType(),
                id,
                identity.principal,
                sales,
                `icp: ${price_icp},ogy: ${price_ogy || '0'}`,
                '',
            );
        },
        [insert, record],
    );

    return { batchSell, executing: record?.status === 'executing' };
};

// 发出卖出交易
export const useDoBatchSellNftByTransaction = (): BatchSellingByTransactionExecutor => {
    const checkIdentity = useCheckIdentity();

    const update = useTransactionStore((s) => s.update);
    // doAction方法
    const doAction = useDoAction<BatchSellingAction, any>();

    // 每次调用前先清空
    const [success, setSuccess] = useState<BatchNftSale[] | undefined>(undefined);

    const [failed, setFailed] = useState<BatchNftSale[] | undefined>(undefined);

    const doBatchSell = useCallback(
        async (id: string, created: number, transaction: BatchSellingTransaction) => {
            const identity = checkIdentity();
            const sales = transaction.args.sales;
            const price_icp = getBatchSellTotalPrice(sales, 'ICP');
            const price_ogy = getBatchSellTotalPrice(sales, 'OGY');
            try {
                if (!transaction_executing(id)) return; // 已经执行了，不能重复执行
                let done_action = false;
                const set_action_done = () => {
                    done_action = true;
                };
                const setAction = () => {};
                const lark_notice_before = function (action: BatchSellingAction): number {
                    return larkNoticeBatchSell(0, getBackendType(), id, action ?? '');
                };
                const lark_notice_after = function (
                    now: number,
                    action: BatchSellingAction,
                    data?: any,
                ): void {
                    larkNoticeBatchSell(
                        now,
                        getBackendType(),
                        id,
                        action ?? '',
                        data ? `${JSON.stringify(data)}` : undefined,
                    );
                };
                const spend = Spend.start(
                    `batch sell nfts ${sales.map((s) => uniqueKey(s.token_id)).join('|')}`,
                );
                // ? 0. 检查白名单
                await checkWhitelist(identity, [...sales.map((item) => item.token_id.collection)]);

                // ? 1.开始执行
                await doAction('DOING', transaction, {
                    fetch_action: async () => {},
                    do_action: async () => {
                        transaction.actions.push({
                            action: 'DOING',
                            timestamp: Date.now(),
                        });
                        await update(id, transaction, 'executing');
                    },
                    set_action_done,
                    spend,
                    lark_notice_before,
                    lark_notice_after,
                });
                if (done_action) return;

                // ? 2. 统一前置授权阶段
                await doAction('BATCH_APPROVING', transaction, {
                    fetch_action: async () => {},
                    do_action: async () => {
                        const success: BatchNftSale[] = [];
                        const failed: BatchNftSale[] = [];
                        await doBatchApproving(
                            setAction,
                            success,
                            failed,
                            setSuccess,
                            setFailed,
                            identity,
                            sales,
                            spend,
                        );
                        transaction.actions.push({
                            action: 'BATCH_APPROVING',
                            timestamp: Date.now(),
                            data: {
                                success,
                                failed,
                            },
                        });
                        await update(id, transaction, 'executing');
                        return {
                            success: success.map((s) => uniqueKey(s.token_id)),
                            failed: failed.map((s) => uniqueKey(s.token_id)),
                        };
                    },
                    set_action_done,
                    spend,
                    lark_notice_before,
                    lark_notice_after,
                });
                if (done_action) return;
                // ? 3. Yumi 记录上架信息阶段
                await doAction('BATCH_YUMI_LISTING', transaction, {
                    fetch_action: async () => {},
                    do_action: async () => {
                        const success = _.findLast(
                            transaction.actions,
                            (i) => i.action === 'BATCH_APPROVING',
                        )?.data.success;
                        await doYumiRecord(setAction, success, identity, spend);
                        transaction.actions.push({
                            action: 'BATCH_YUMI_LISTING',
                            timestamp: Date.now(),
                            data: {
                                success,
                            },
                        });
                        await update(id, transaction, 'successful');
                        return {
                            success: success.map((s) => uniqueKey(s.token_id)),
                        };
                    },
                    set_action_done,
                    spend,
                    lark_notice_before,
                    lark_notice_after,
                });
                // ? LARK 通知
                larkNoticeBatchSellOver(
                    created,
                    getBackendType(),
                    id,
                    identity.principal,
                    transaction.args.sales,
                    `icp: ${price_icp},ogy: ${price_ogy || '0'}`,
                    `Actions: ${transaction.actions
                        .map((a) => {
                            if (!a.action) {
                                return;
                            }
                            if (!['BATCH_APPROVING', 'BATCH_YUMI_LISTING'].includes(a.action)) {
                                return `${a.action}(${a.timestamp})${
                                    a.data ? `: ${JSON.stringify(a.data)}` : ''
                                }`;
                            } else {
                                return `${a.action}(${a.timestamp})${
                                    a.data
                                        ? `: ${JSON.stringify(
                                              a.data.success.map((s) => uniqueKey(s.token_id)),
                                          )}${JSON.stringify(
                                              a.data.failed?.map((s) => uniqueKey(s.token_id)),
                                          )}`
                                        : ''
                                }`;
                            }
                        })
                        .join('\n\t')}`,
                );
            } catch (e: any) {
                const message = `${e.message ?? e}`;
                const log_error = !ERRS_NOT_SEND.find((m) => message.indexOf(m) !== -1);

                // ? LARK 通知
                larkNoticeBatchSellFailed(
                    created,
                    getBackendType(),
                    id,
                    identity.principal,
                    transaction.args.sales,
                    `Actions: ${transaction.actions
                        .map((a) => {
                            let n_data;
                            if (a.data) {
                                n_data = { ...a.data };
                                if (n_data.collections) {
                                    delete n_data.collections;
                                }
                            }
                            return `${a.action}(${a.timestamp})${
                                n_data ? `: ${JSON.stringify(n_data)}` : ''
                            }`;
                        })
                        .join('\n\t')}`,
                    message,
                    log_error,
                );
                await update(id, transaction, 'failed', message);
            } finally {
                transaction_executed(id);
            }
        },
        [checkIdentity, doAction, update, success, failed],
    );
    return doBatchSell;
};

const checkArgs = (identity: ConnectedIdentity, sales: BatchNftSale[]): boolean => {
    // 检查必须是自己的 NFT
    const owner_account = identity.account;
    for (const o of sales) {
        if (o.owner.owner !== owner_account) {
            message.warning(`You can't sell NFT that you are not owned`);
            return false; // 防止卖不是自己的 NFT
        }
    }
    // 检查不能重复
    if (_.uniq(sales.map((o) => o.token_id).map(uniqueKey)).length < sales.length) {
        message.warning(`NFT is repeated`);
        return false; //  NFT 不能重复
    }

    return true;
};

const checkBatchWhiteList = async (
    setAction: (action: BatchSellingAction) => void,
    spend: Spend,
): Promise<void> => {
    setAction('BATCH_WHITELIST');
    // TODO 白名单检查
    spend.mark(`BATCH_WHITELIST DONE`);
};

const doBatchApproving = async (
    setAction: (action: BatchSellingAction) => void,
    success: BatchNftSale[],
    failed: BatchNftSale[],
    setSuccess: (success: BatchNftSale[]) => void,
    setFailed: (failed: BatchNftSale[]) => void,
    identity: ConnectedIdentity,
    sales: BatchNftSale[],
    spend: Spend,
): Promise<void> => {
    setAction('BATCH_APPROVING');
    setSuccess(success);
    setFailed(failed);
    await doBatchApprove(identity, sales, (sale) => {
        if (sale.result === '') {
            success.push(sale);
            setSuccess([...success]);
        } else if (sale.result) {
            failed.push(sale);
            setFailed([...failed]);
        }
    });
    spend.mark(`BATCH_APPROVING DONE`);
};

const doBatchApprove = async (
    identity: ConnectedIdentity,
    sales: BatchNftSale[],
    update: (sale: BatchNftSale) => void,
): Promise<void> => {
    await Promise.all(sales.map((sale) => doSell(identity, sale, update)));
};

const doSell = async (
    identity: ConnectedIdentity,
    sale: BatchNftSale,
    update: (sale: BatchNftSale) => void,
): Promise<void> => {
    try {
        const spend = Spend.start(`batch sell: approve ${uniqueKey(sale.owner.token_id)}`);
        await doApprove(
            identity,
            sale.owner,
            sale.last,
            sale.token,
            sale.price,
            undefined,
            () => {}, // 不用设置状态
            spend,
        );
        spend.mark(`over: ${sale.owner.raw.standard}`);
        sale.result = '';
        update(sale);
    } catch (e) {
        console.error(`batch sell: approve ${uniqueKey(sale.owner.token_id)} failed`, e);
        sale.result = `${e}`;
        update(sale);
    }
};

const doYumiRecord = async (
    setAction: (action: BatchSellingAction) => void,
    success: BatchNftSale[],
    identity: ConnectedIdentity,
    spend: Spend,
): Promise<void> => {
    setAction('BATCH_YUMI_LISTING');
    const args = success
        .filter((item) => item.owner.raw.standard !== 'ogy') // ! ogy 的已经成功了, 过滤掉，不用在 yumi 记录
        .map((sale) => ({
            token_identifier: sale.owner.token_id.token_identifier,
            token: sale.token,
            price: sale.price,
        }));

    let records: string[] = [];
    if (args.length) {
        records = await batchListing(identity!, args);
    }
    spend.mark(`BATCH_YUMI_LISTING DONE`);

    // 把成功失败的设置 // ! 授权成功的下一步也许错误了, 需要再次标记一下
    success.forEach((sale) => {
        if (
            sale.owner.raw.standard !== 'ogy' &&
            !records.includes(sale.owner.token_id.token_identifier)
        ) {
            sale.result = 'Yumi listing failed';
        }
    });
};

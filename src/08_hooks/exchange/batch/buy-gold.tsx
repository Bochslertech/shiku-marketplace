import { useCallback, useMemo, useState } from 'react';
import { message } from 'antd';
import _ from 'lodash';
import { LedgerTokenBalance } from '@/01_types/canisters/ledgers';
import {
    BatchBuyingGoldAction,
    BatchBuyingGoldByTransactionExecutor,
    BatchBuyingGoldTransaction,
    BuyGoldNftExecutor,
    NftOwnerAndListing,
} from '@/01_types/exchange/batch-buy-gold';
import { BuyNftRawOgy } from '@/01_types/exchange/single-buy';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftListing, NftListingListing } from '@/01_types/listing';
import { NftIdentifier } from '@/01_types/nft';
import { NftTokenOwner } from '@/01_types/nft';
import { exponentNumber } from '@/02_common/data/numbers';
import { uniqueKey } from '@/02_common/nft/identifier';
import { Spend } from '@/02_common/react/spend';
import { bigint2string, string2bigint } from '@/02_common/types/bigint';
import { bidNftByOgy } from '@/03_canisters/nft/nft_ogy';
import {
    larkNoticeBatchBuyGold,
    larkNoticeBatchBuyGoldFailed,
    larkNoticeBatchBuyGoldInitial,
    larkNoticeBatchBuyGoldOver,
} from '@/04_apis/yumi-logs/batch-buy';
import { ERRS_NOT_SEND } from '@/04_apis/yumi-logs/special';
import { getBackendType } from '@/05_utils/app/backend';
import { icpAccountBalance } from '@/05_utils/canisters/ledgers/icp';
import { ogyAccountBalance } from '@/05_utils/canisters/ledgers/ogy';
import {
    getLedgerIcpCanisterId,
    getLedgerOgyCanisterId,
    getTokenDecimals,
} from '@/05_utils/canisters/ledgers/special';
import { queryRechargeAccountByOgy } from '@/05_utils/canisters/nft/ogy';
import { getOgyGoldCanisterId } from '@/05_utils/canisters/nft/special';
import { queryNftListingData } from '@/05_utils/nft/listing';
import { Transaction, useTransactionStore } from '@/07_stores/transaction';
import { useMessage } from '@/08_hooks/common/message';
import { useTransactionRecords } from '@/08_hooks/stores/transaction';
import { SupportedLedgerTokenSymbol } from '../../../01_types/canisters/ledgers';
import { useCheckIdentity } from '../../common/identity';
import { useCheckKyc } from '../../common/kyc';
import { checkWhitelist } from '../../common/whitelist';
import { LedgerTransferExecutor, useTransferByICP, useTransferByOGY } from '../../ledger/transfer';
import { transaction_executed, transaction_executing } from '../executing';
import { checkGoldIsSelf } from '../single/buy';
import useActionSteps, { MarkAction, useDoAction } from '../steps';

type NftOwnerAndListingListing = {
    owner: NftTokenOwner;
    listing: NftListingListing;
    raw: BuyNftRawOgy;
};

type GoldCollection = {
    collection: string;
    list: NftOwnerAndListingListing[];
    account: string;
    icp_need: string;
    ogy_need: string;
    pay_info?: { paid: boolean; info: string };
    bid_info?: { bided: boolean; info: string };
};

// export const useBatchBuyGoldNft = (): {
//     batchBuyGold: BuyGoldNftExecutor;
//     action: BatchBuyingGoldAction;
// } => {
//     const checkIdentity = useCheckIdentity();
//     const checkAction = useCheckAction();
//     const checkKyc = useCheckKyc();

//     // 标记当前状态
//     const [action, setAction] = useState<BatchBuyingGoldAction>(undefined);

//     // 需要使用转账
//     const {
//         balance: icpBalance,
//         fee: icpFee,
//         decimals: icpDecimals,
//         transfer: icpTransfer,
//     } = useTransferByICP();
//     const {
//         balance: ogyBalance,
//         fee: ogyFee,
//         decimals: ogyDecimals,
//         transfer: ogyTransfer,
//     } = useTransferByOGY();

//     const batchBuyGold = useCallback(
//         async (token_list: NftOwnerAndListing[]): Promise<NftIdentifier[] | undefined> => {
//             const identity = checkIdentity();
//             if (!checkArgs(identity, token_list)) return undefined;
//             checkAction(action, `Batch purchasing`); // 防止重复点击

//             setAction('DOING');
//             try {
//                 // ? 0. 检查白名单
//                 await checkWhitelist(identity, [
//                     ...token_list.map((item) => item.owner.token_id.collection),
//                     ...token_list.map((item) =>
//                         item.listing.type === 'listing' ? item.listing.token.canister : '',
//                     ),
//                 ]);

//                 const spend = Spend.start(
//                     `batch buy gold nft ${token_list
//                         .map((o) => o.owner.token_id)
//                         .map(uniqueKey)
//                         .join('|')}`,
//                 );

//                 // ? 1. 检查KYC
//                 await checkKyc({
//                     before: () => setAction('CHECKING_KYC'),
//                     requirement: true,
//                     after: () => spend.mark(`${action} DONE`),
//                 });

//                 // 下面的步骤需要按罐子进行分类
//                 const collections = parseArgs(token_list);

//                 // ? 2. 分别检查余额
//                 await checkBalance(
//                     setAction,
//                     identity,
//                     collections,
//                     icpBalance,
//                     icpFee,
//                     icpDecimals,
//                     ogyBalance,
//                     ogyFee,
//                     ogyDecimals,
//                     spend,
//                 );

//                 // ? 3. 查询付款地址
//                 await queryPayAccounts(setAction, identity, collections, spend);

//                 // ? 4. 付款
//                 await doPay(setAction, icpTransfer, ogyTransfer, collections, spend);

//                 // ? 5. 取回所购买的 NFT
//                 const success_id = await doBidNfts(setAction, identity, collections, spend);

//                 // ? 6. 圆满完成
//                 return success_id;
//             } catch (e) {
//                 console.debug(`🚀 ~ file: buy.tsx:138 ~ e:`, e);
//                 message.error(`Buy Gold NFT failed: ${e}`);
//             } finally {
//                 setAction(undefined); // 恢复状态
//             }
//         },
//         [
//             checkIdentity,
//             checkKyc,
//             action,
//             icpBalance,
//             icpFee,
//             icpDecimals,
//             icpTransfer,
//             ogyBalance,
//             ogyFee,
//             ogyDecimals,
//             ogyTransfer,
//         ],
//     );

//     return { batchBuyGold, action };
// };
export const useBatchBuyingGoldActionSteps = (
    action: BatchBuyingGoldAction,
): {
    show: boolean;
    hide: () => void;
    failed: boolean;
    fail: () => void;
    title: string;
    actions: MarkAction<BatchBuyingGoldAction>[];
} => {
    const { show, hide, failed, fail } = useActionSteps(action);

    const { title, actions }: { title: string; actions: MarkAction<BatchBuyingGoldAction>[] } =
        useMemo(() => {
            const title = 'Buy NFTs';
            const actions: MarkAction<BatchBuyingGoldAction>[] = [
                {
                    title: 'Check order status and check wallet balance',
                    actions: ['DOING', 'CHECKING_KYC', 'CHECKING_BALANCE', 'QUERY_PAY_ACCOUNTS'],
                },
                { title: 'Calling Ledger to validate transactions', actions: ['PAY'] },
                { title: 'Purchasing items', actions: ['BID_NFTS'] },
                { title: 'Checking all nfts purchased', actions: ['BID_NFTS_ALL_SUCCESS'] },
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

const getBatchGoldTotalPrice = (
    token_list: NftOwnerAndListing[],
    symbol: SupportedLedgerTokenSymbol,
) => {
    const price = token_list
        .filter((i) => (i.listing as NftListingListing).token.symbol.toLocaleUpperCase() === symbol)
        .map((l) => (l.listing as NftListingListing).price)
        .reduce((a, b) => bigint2string(string2bigint(a) + string2bigint(b)), '');
    return exponentNumber(price, -getTokenDecimals(symbol));
};

// 发出批量购买黄金交易
export const useBatchBuyGoldNftByTransaction = (): {
    batchBuyGold: BuyGoldNftExecutor;
    executing: boolean;
} => {
    const checkIdentity = useCheckIdentity();

    const message = useMessage();

    const insert = useTransactionStore((s) => s.insert);

    const [id, setId] = useState<string | undefined>(undefined);

    const { record } = useTransactionRecords(id);

    const batchBuyGold = useCallback(
        async (token_list: NftOwnerAndListing[]): Promise<NftIdentifier[] | undefined> => {
            const identity = checkIdentity();
            if (!checkArgs(identity, token_list)) return undefined;
            // 计算price
            const price_icp = getBatchGoldTotalPrice(token_list, 'ICP');

            const price_ogy = getBatchGoldTotalPrice(token_list, 'OGY');

            const id = await insert(identity.principal, {
                type: 'batch-buy-gold',
                args: { token_list },
                actions: [],
                paid: 0,
                bided: 0,
            }).catch((e) => {
                message.error(e.message);
                return undefined;
            });
            if (!id) return undefined;
            setId(id);
            // ? LARK 通知
            larkNoticeBatchBuyGoldInitial(
                getBackendType(),
                id,
                identity.principal,
                token_list,
                `icp: ${price_icp},ogy: ${price_ogy || '0'}`,
                '',
            );
            throw new Error(`already recorded transaction`);
        },
        [checkIdentity, insert],
    );

    return { batchBuyGold, executing: record?.status === 'successful' };
};

export const useDoBatchBuyGoldNftByTransaction = (): BatchBuyingGoldByTransactionExecutor => {
    const checkIdentity = useCheckIdentity();
    const checkKyc = useCheckKyc();

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

    const update = useTransactionStore((s) => s.update);

    // doAction方法
    const doAction = useDoAction<BatchBuyingGoldAction, any>();
    const doBatchBuy = useCallback(
        async (id: string, _created: number, transaction: BatchBuyingGoldTransaction) => {
            const identity = checkIdentity();
            const token_list = transaction.args.token_list;
            if (!checkArgs(identity, transaction.args.token_list)) return undefined;
            if (!transaction_executing(id)) return; // 已经执行了，不能重复执行

            // 计算price
            const price_icp = getBatchGoldTotalPrice(token_list, 'ICP');

            const price_ogy = getBatchGoldTotalPrice(token_list, 'OGY');

            const spend = Spend.start(
                `batch buy gold nft ${token_list
                    .map((o) => o.owner.token_id)
                    .map(uniqueKey)
                    .join('/')}`,
            );

            let done_action = false;

            const set_action_done = () => {
                done_action = true;
            };

            const setAction = () => {};
            const lark_notice_before = function (action: BatchBuyingGoldAction): number {
                return larkNoticeBatchBuyGold(0, getBackendType(), id, action ?? '');
            };
            const lark_notice_after = function (
                now: number,
                action: BatchBuyingGoldAction,
                data?: any,
            ): void {
                // collections字段太多不输出
                let n_data;
                if (data) {
                    n_data = { ...data };
                    delete n_data.collections;
                }
                larkNoticeBatchBuyGold(
                    now,
                    getBackendType(),
                    id,
                    action ?? '',
                    JSON.stringify(n_data),
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

                // 下面的步骤需要按罐子进行分类
                let collections = parseArgs(token_list);

                // 不是自己的才可以买
                collections = collections.map((c) => ({
                    ...c,
                    list: c.list.filter(
                        async (l) =>
                            !(await checkGoldIsSelf(
                                identity,
                                c.collection,
                                l.owner.token_id.token_identifier,
                            )),
                    ),
                }));
                // ? 3. 检查余额 // 每次都要检查
                await (async () => {
                    if (transaction.actions.find((a) => a.action === 'PAY')) return;
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
                        identity,
                        collections,
                        icpBalance,
                        icpFee,
                        icpDecimals,
                        ogyBalance,
                        ogyFee,
                        ogyDecimals,
                        spend,
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
                })();

                if (done_action) return;
                // ? 4. 查询付款地址
                const { collections: queried_collections } = await doAction(
                    'QUERY_PAY_ACCOUNTS',
                    transaction,
                    {
                        fetch_action: async (action) => action.data!,
                        do_action: async () => {
                            await queryPayAccounts(setAction, identity, collections, spend);
                            transaction.actions.push({
                                action: 'QUERY_PAY_ACCOUNTS',
                                timestamp: Date.now(),
                                data: { collections, accounts: collections.map((c) => c.account) },
                            });
                            await update(id, transaction, 'executing');
                            return { collections, accounts: collections.map((c) => c.account) };
                        },
                        set_action_done,
                        spend,
                        lark_notice_before,
                        lark_notice_after,
                    },
                );

                if (done_action) return;

                // ? 4. 付款
                // !转账可能部分未执行
                await (async () => {
                    const start = lark_notice_before('PAY');
                    const pay_info = await doPay(
                        setAction,
                        icpTransfer,
                        ogyTransfer,
                        queried_collections,
                        spend,
                        transaction,
                        update,
                        id,
                    );
                    transaction.paid++;
                    lark_notice_after(start, 'PAY', pay_info);
                })();

                // 只有全部转账执行了才走下一步
                if (
                    (
                        transaction.actions.find((a) => a.action === 'PAY')?.data
                            .collections as GoldCollection[]
                    ).every((i) => i.pay_info?.paid)
                ) {
                    update(id, transaction, 'executing');
                } else {
                    return;
                }

                // ? 5. 取回所购买的 NFT
                // !bid可能部分未执行
                await (async () => {
                    const start = lark_notice_before('BID_NFTS');
                    const success = await doBidNfts(
                        setAction,
                        identity,
                        queried_collections,
                        spend,
                        transaction,
                        update,
                        id,
                    );
                    transaction.bided++;
                    lark_notice_after(start, 'BID_NFTS', success);
                })();
                // //   i// !bid可能部分未执行
                await (async () => {
                    const start = lark_notice_before('BID_NFTS_ALL_SUCCESS');
                    const actions = transaction.actions;
                    const local_collections =
                        actions[actions.findIndex((a) => a.action === 'BID_NFTS')].data.collections;
                    // !bid接口返回时间过长所以是否bid成功依据owner是否是自己来判断
                    const r = await Promise.all(
                        collections.flatMap((c) =>
                            c.list.map((l) => {
                                return (async () => {
                                    const isListing =
                                        (await queryNftListingData('ogy', l.owner.token_id)).listing
                                            .type === 'listing';
                                    const isSelf = await checkGoldIsSelf(
                                        identity,
                                        c.collection,
                                        l.owner.token_id.token_identifier,
                                    );
                                    if (!isListing && !isSelf) {
                                        throw new Error(
                                            'batch buy gold failed,purchased by someone already.',
                                        );
                                    }
                                    return !isListing && isSelf;
                                })();
                            }),
                        ),
                    );

                    if (r.every((s) => s)) {
                        lark_notice_after(start, 'BID_NFTS_ALL_SUCCESS', undefined);
                        actions.push({
                            action: 'BID_NFTS_ALL_SUCCESS',
                            timestamp: Date.now(),
                            data: { collections: local_collections },
                        });
                        update(id, transaction, 'successful');
                        // ? LARK 通知
                        larkNoticeBatchBuyGoldOver(
                            _created,
                            getBackendType(),
                            id,
                            identity.principal,
                            transaction.args.token_list,
                            `icp: ${price_icp},ogy: ${price_ogy}`,
                            `Actions: ${transaction.actions
                                .map((a) => {
                                    let n_data;
                                    if (a.data) {
                                        n_data = {
                                            ...a.data,
                                        };
                                        if (n_data.collections) {
                                            delete n_data.collections;
                                        }
                                    }

                                    return `${a.action}(${a.timestamp})${
                                        n_data ? `: ${JSON.stringify(n_data)}` : ''
                                    }`;
                                })
                                .join('\n\t')}`,
                        );
                    }
                })();
            } catch (e: any) {
                const message = `${e.message ?? e}`;
                // 是否将err信息发送到错误日志
                const log_error = !ERRS_NOT_SEND.find((m) => message.indexOf(m) !== -1);
                // ? LARK 通知
                larkNoticeBatchBuyGoldFailed(
                    _created,
                    getBackendType(),
                    id,
                    identity.principal,
                    transaction.args.token_list,
                    `icp: ${price_icp},ogy: ${price_ogy} `,
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
    // 检查必须是 Gold 罐子
    for (const o of token_list) {
        if (!getOgyGoldCanisterId().includes(o.owner.token_id.collection)) {
            message.warning(`NFT is not Gold`);
            return false; // 防止购买自己的 NFT
        }
    }
    // 检查挂单代币只能是 ICP 或 OGY
    for (const o of token_list) {
        if (o.listing.type !== 'listing') {
            message.warning(`NFT is not listing`);
            return false; // 防止没有上架的 NFT
        }
        if (
            o.listing.token.canister !== getLedgerIcpCanisterId() &&
            o.listing.token.canister !== getLedgerOgyCanisterId()
        ) {
            message.warning(`Token is not supported`);
            return false; // 购买的代币不支持
        }
    }
    // 检查不能重复
    if (_.uniq(token_list.map((o) => o.owner.token_id).map(uniqueKey)).length < token_list.length) {
        message.warning(`NFT is repeated`);
        return false; //  NFT 不能重复
    }

    return true;
};

const parseArgs = (token_list: NftOwnerAndListing[]): GoldCollection[] => {
    const list: GoldCollection[] = [];
    for (const item of token_list) {
        let index = list.findIndex((part) => part.collection === item.owner.token_id.collection);
        if (index === -1) {
            list.push({
                collection: item.owner.token_id.collection,
                list: [],
                account: '', // 暂时置空
                icp_need: '0',
                ogy_need: '0',
            });
            index = list.length - 1;
        }
        const part = list[index];
        part.list.push({
            owner: item.owner,
            listing: item.listing as NftListingListing,
            raw: item.raw,
        });
    }
    return list;
};

const checkBalance = async (
    setAction: (action: BatchBuyingGoldAction) => void,
    identity: ConnectedIdentity,
    collections: GoldCollection[],
    icpBalance: LedgerTokenBalance | undefined,
    icpFee: string,
    icpDecimals: number,
    ogyBalance: LedgerTokenBalance | undefined,
    ogyFee: string,
    ogyDecimals: number,
    spend: Spend,
): Promise<void> => {
    setAction('CHECKING_BALANCE');
    // 先整理需要的额度
    let icpNeed = BigInt(0); // 所需要的 icp 余额
    let ogyNeed = BigInt(0); // 所需要的 ogy 余额

    const zero = BigInt(0);

    let price_ogy = BigInt(0);

    // 统计需要的金额
    for (const collection of collections) {
        const list: NftOwnerAndListingListing[] = collection.list;
        let icp = BigInt(0);
        let ogy = BigInt(0);
        for (const { listing } of list) {
            const price = BigInt(listing.price);
            if (listing.token.symbol === 'ICP') icp += price + BigInt(icpFee); // 每一个都要费用
            if (listing.token.symbol === 'OGY') {
                ogy += price + BigInt(ogyFee);
                price_ogy += price;
            } // 每一个都要费用
        }
        const icp_need = zero < icp ? icp : zero; // 如果有 icp 那么还要额外的一个手续费
        const ogy_need = zero < ogy ? ogy : zero; // 如果有 ogy 那么还要额外的一个手续费
        if (zero < icp_need) icpNeed += icp_need + BigInt(icpFee);
        if (zero < ogy_need) ogyNeed += ogy_need + BigInt(ogyFee);

        collection.icp_need = bigint2string(icp_need);
        collection.ogy_need = bigint2string(ogy_need);
    }

    await Promise.all([
        new Promise((resolve, reject) => {
            (async () => {
                return icpBalance?.e8s ?? (await icpAccountBalance(identity.account)).e8s; // 没有余额的话, 就主动获取一下吧
            })()
                .then((e8s) => {
                    const need = BigInt(icpNeed) + BigInt(icpFee);
                    if (BigInt(e8s) < need)
                        reject(
                            new Error(
                                `Insufficient balance.(needs ${exponentNumber(
                                    `${need}`,
                                    -icpDecimals,
                                )}ICP)`,
                            ),
                        );
                    else resolve(undefined);
                })
                .catch(reject);
        }),
        new Promise((resolve, reject) => {
            (async () => {
                return ogyBalance?.e8s ?? (await ogyAccountBalance(identity.account)).e8s; // 没有余额的话, 就主动获取一下吧
            })()
                .then((e8s) => {
                    const need = BigInt(ogyNeed) + BigInt(ogyFee);
                    // 不需要支付ogy则不报错
                    if (BigInt(e8s) < need && price_ogy > 0)
                        reject(
                            new Error(
                                `Insufficient balance.(needs ${exponentNumber(
                                    `${need}`,
                                    -ogyDecimals,
                                )}OGY)`,
                            ),
                        );
                    else resolve(undefined);
                })
                .catch(reject);
        }),
    ]);
    spend.mark(`CHECKING_BALANCE DONE`);
};

const queryPayAccounts = async (
    setAction: (action: BatchBuyingGoldAction) => void,
    identity: ConnectedIdentity,
    collections: GoldCollection[],
    spend: Spend,
) => {
    setAction('QUERY_PAY_ACCOUNTS');
    await Promise.all(
        collections.map((item) =>
            queryRechargeAccountByOgy(item.collection, identity.principal).then((account) => {
                item.account = account;
            }),
        ),
    );
    spend.mark(`QUERY_PAY_ACCOUNTS DONE`);
};

const doPay = async (
    setAction: (action: BatchBuyingGoldAction) => void,
    icpTransfer: LedgerTransferExecutor,
    ogyTransfer: LedgerTransferExecutor,
    collections: GoldCollection[],
    spend: Spend,
    transaction: BatchBuyingGoldTransaction,
    update: (
        id: string,
        transaction: Transaction,
        status: 'executing' | 'successful' | 'failed',
        message?: string | undefined,
    ) => Promise<void>,
    id: string,
): Promise<{ collections_pay_info: any[] }> => {
    setAction('PAY');
    // ! 付款地址是 获得的 ogy 子地址
    const actions = transaction.actions;
    if (!transaction.paid) {
        actions.push({
            action: 'PAY',
            timestamp: Date.now(),
            data: { collections: collections },
        });
    }
    const foundAction = actions[actions.findIndex((a) => a.action === 'PAY')];
    const local_collections = foundAction.data.collections;
    // 付过款的就不付了
    const not_pay_collections = local_collections.filter((i) => !i.pay_info?.paid);

    await Promise.all(
        not_pay_collections.flatMap((item) => {
            const zero = BigInt(0);
            const tasks: Promise<void>[] = [];
            if (zero < string2bigint(item.icp_need)) {
                tasks.push(
                    icpTransfer({
                        to: item.account,
                        amount: item.icp_need,
                    }).then((height) => {
                        const info = `transferred ${exponentNumber(
                            item.icp_need,
                            -getTokenDecimals(),
                        )} ICP to ${item.account}: ${height}`;
                        local_collections[
                            local_collections.findIndex((i) => i.account === item.account)
                        ].pay_info = {
                            paid: true,
                            info,
                        };
                        update(id, transaction, 'executing');
                        console.debug(info);
                    }),
                );
            }
            if (zero < string2bigint(item.ogy_need)) {
                tasks.push(
                    ogyTransfer({
                        to: item.account,
                        amount: item.ogy_need,
                    }).then((height) => {
                        const info = `transferred ${exponentNumber(
                            item.ogy_need,
                            -getTokenDecimals('OGY'),
                        )} OGY to ${item.account}: ${height}`;
                        local_collections[
                            local_collections.findIndex((i) => i.account === item.account)
                        ].pay_info = {
                            paid: true,
                            info,
                        };
                        update(id, transaction, 'executing');
                        console.debug(info);
                    }),
                );
            }
            return tasks;
        }),
    );
    spend.mark(`PAY DONE`);
    const collections_pay_info = local_collections.map((i) => ({
        collection: i.collection,
        pay_info: i.pay_info,
    }));
    foundAction.data.collections_pay_info = collections_pay_info;
    update(id, transaction, 'executing');
    return {
        collections_pay_info,
    };
};

// 单个，然后并发
const doBidNfts = async (
    setAction: (action: BatchBuyingGoldAction) => void,
    identity: ConnectedIdentity,
    collections: GoldCollection[],
    spend: Spend,
    transaction: BatchBuyingGoldTransaction,
    update: (
        id: string,
        transaction: Transaction,
        status: 'executing' | 'successful' | 'failed',
        message?: string | undefined,
    ) => Promise<void>,
    id: string,
): Promise<NftIdentifier[]> => {
    setAction('BID_NFTS');
    const actions = transaction.actions;

    if (!transaction.bided) {
        actions.push({
            action: 'BID_NFTS',
            timestamp: Date.now(),
            data: { collections },
        });
    }
    await update(id, transaction, 'executing');

    const local_collections =
        actions[actions.findIndex((a) => a.action === 'BID_NFTS')].data.collections;
    // bid过的的过滤掉
    const not_bid_collections = local_collections.filter((i) => !i.bid_info?.bided);

    const success = await Promise.all(
        not_bid_collections.flatMap((item) =>
            item.list.map((arg) => {
                // !正常情况下余额足前端才允许发送交易，所以乐观记录。只要发出就成功
                const info = `bided ${item.collection}`;
                local_collections[
                    local_collections.findIndex((i) => i.account === item.account)
                ].bid_info = {
                    bided: true,
                    info,
                };
                update(id, transaction, 'executing');
                return bidNftByOgy(identity, item.collection, {
                    sale_id: arg.raw.sale_id,
                    broker_id: arg.raw.broker_id,
                    token_identifier: arg.owner.token_id.token_identifier,
                    seller: arg.raw.seller,
                    buyer: identity.principal,
                    token: arg.listing.token,
                    amount: arg.listing.price, // 告诉 ogy 可以使用的余额
                }).catch((e) => console.debug({ e }));
            }),
        ),
    );
    spend.mark(`BID_NFTS DONE`);
    return success;
};

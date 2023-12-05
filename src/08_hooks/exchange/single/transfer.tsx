import { useCallback, useMemo, useState } from 'react';
import { message } from 'antd';
import {
    SingleTransferAction,
    SingleTransferTransaction,
    TransferNftByTransactionExecutor,
    TransferNftExecutor,
    TransferringAction,
} from '@/01_types/exchange/single-transfer';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftTokenOwner, SupportedNftStandard } from '@/01_types/nft';
import { ExtUser } from '@/01_types/nft-standard/ext';
import { isPrincipalText } from '@/02_common/ic/principals';
import { uniqueKey } from '@/02_common/nft/identifier';
import { Spend } from '@/02_common/react/spend';
import { transferFrom } from '@/03_canisters/nft/ext';
import { retrieveCccNft } from '@/03_canisters/yumi/yumi_ccc_proxy';
import { useTransactionStore } from '@/07_stores/transaction';
import { useCheckIdentity } from '@/08_hooks/common/identity';
import { useMessage } from '@/08_hooks/common/message';
import { useTransactionRecords } from '@/08_hooks/stores/transaction';
import { useCheckAction } from '../../common/action';
import { checkWhitelist } from '../../common/whitelist';
import useActionSteps, { MarkAction } from '../../exchange/steps';
import { transaction_executed, transaction_executing } from '../executing';

export const useTransferNft = (): {
    transfer: TransferNftExecutor;
    action: TransferringAction;
} => {
    const checkAction = useCheckAction();

    // 标记当前状态
    const [action, setAction] = useState<TransferringAction>(undefined);

    const transfer = useCallback(
        async (
            identity: ConnectedIdentity,
            owner: NftTokenOwner,
            to: string,
            is_batch?: boolean,
        ): Promise<boolean> => {
            checkAction(action, `Transferring`); // 防止重复点击

            setAction('DOING');
            try {
                // ? 0. 检查白名单
                !is_batch && (await checkWhitelist(identity, [owner.token_id.collection]));

                const spend = Spend.start(`transfer nft ${uniqueKey(owner.token_id)}`);

                // ? 0. 前置检查
                await checkStandardAndAddress(owner, to);

                // ? 1. 检查是否要取回
                await doRetrieve(setAction, identity, owner, spend);

                // ? 2. 进行转移
                await doTransfer(owner, identity, setAction, to, spend);

                // ? 3. 圆满完成
                return true;
            } catch (e) {
                console.debug(`🚀 ~ file: transfer.tsx:79 ~ e:`, e);
                message.error(`Transfer NFT failed: ${e}`);
            } finally {
                setAction(undefined); // 恢复状态
            }
            return false;
        },
        [action],
    );

    return { transfer, action };
};

const checkStandardAndAddress = async (owner: NftTokenOwner, to: string): Promise<void> => {
    // 不支持转移的代币要拦截
    if (owner.raw.standard === 'ogy') {
        throw new Error(`OGY NFT is not supported.`);
    }
    // CCC 标准的目标地址一定是 principal
    if (owner.raw.standard === 'ccc' && !isPrincipalText(to)) {
        throw new Error(`The new owner of CCC NFT must be principal`);
    }
};

const doRetrieve = async (
    setAction: (action: TransferringAction) => void,
    identity: ConnectedIdentity,
    owner: NftTokenOwner,
    spend: Spend,
): Promise<void> => {
    setAction('RETRIEVING');
    await retrieve(identity, owner, setAction, spend);
    spend.mark(`RETRIEVING DONE`);
};

// 某些 NFT 需要查看是否需要取回
const retrieve = async (
    identity: ConnectedIdentity,
    owner: NftTokenOwner,
    setAction: (action: TransferringAction) => void,
    spend: Spend,
): Promise<void> => {
    if (
        (owner.raw.standard === 'ccc' && owner.raw.data.proxy) ||
        (owner.raw.standard === 'ext' && owner.raw.data.proxy) // ! 没有 approve 的 ext 标准也要走 ccc 路径
    ) {
        // 有代理的罐子,就需要取回
        setAction('RETRIEVING_CCC');
        const retrieved = await retrieveCccNft(
            identity,
            owner.raw.data.proxy, // 传入指定的代理后端罐子
            owner.token_id.token_identifier,
        );
        spend.mark(`RETRIEVING_CCC DONE`);
        if (!retrieved) throw new Error(`Withdraw NFT failed`);
    }
};

const doTransfer = async (
    owner: NftTokenOwner,
    identity: ConnectedIdentity,
    setAction: (action: TransferringAction) => void,
    to: string,
    spend: Spend,
): Promise<void> => {
    const from: ExtUser = (() => {
        if (owner.raw.standard === 'ccc') {
            return { principal: identity.principal };
        }
        return { address: owner.owner };
    })();
    setAction('TRANSFERRING');
    const transferred = await transferFrom(identity, owner.token_id.collection, {
        token_identifier: owner.token_id.token_identifier,
        from,
        to: isPrincipalText(to) ? { principal: to } : { address: to },
        memo: [],
    });
    spend.mark(`TRANSFERRING DONE`);
    if (!transferred) throw new Error(`transfer failed`);
};

// ================== 状态显示弹窗 ==================

export const useTransferringActionSteps = (
    action: TransferringAction,
    standard: SupportedNftStandard,
): {
    show: boolean;
    hide: () => void;
    failed: boolean;
    fail: () => void;
    title: string;
    actions: MarkAction<TransferringAction>[];
} => {
    const { show, hide, failed, fail } = useActionSteps(action);

    const { title, actions }: { title: string; actions: MarkAction<TransferringAction>[] } =
        useMemo(() => {
            const title = 'Sell NFT';
            const actions: MarkAction<TransferringAction>[] =
                standard === 'ccc'
                    ? [
                          {
                              actions: ['RETRIEVING', 'RETRIEVING_CCC'],
                              title: 'Retrieve your NFT first',
                          },
                          { actions: ['TRANSFERRING'], title: 'Transferring NFT' },
                      ]
                    : [
                          {
                              actions: ['RETRIEVING', 'RETRIEVING_CCC'],
                              title: 'Checking NFT first',
                          },
                          { actions: ['TRANSFERRING'], title: 'Transferring NFT' },
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

// 发出转移交易
export const useTransferNftByTransaction = (): {
    transfer: TransferNftExecutor;
    action: TransferringAction;
} => {
    const message = useMessage();

    const insert = useTransactionStore((s) => s.insert);

    const [id, setId] = useState<string | undefined>(undefined);
    const { record } = useTransactionRecords(id);

    const transfer = useCallback(
        async (identity: ConnectedIdentity, owner: NftTokenOwner, to: string): Promise<boolean> => {
            try {
                // ? 0. 前置检查
                await checkStandardAndAddress(owner, to);
            } catch (e: any) {
                message.error(`${e.message}`);
                return false;
            }

            const id = await insert(identity.principal, {
                type: 'single-transfer',
                args: { owner, to },
                actions: [],
            }).catch((e) => {
                console.debug(`🚀 ~ file: transfer.tsx:456 ~ e:`, e);
                message.error(e.message);
                return undefined;
            });
            setId(id);
            throw new Error(`already recorded transaction`);
            return true;
        },
        [insert],
    );

    const action = useMemo(() => {
        if (record === undefined) return undefined;
        const transaction = record.transaction as SingleTransferTransaction;
        const actions = transaction.actions;
        if (actions.length === 0) return undefined;
        return actions[actions.length - 1].action;
    }, [record]);

    return { transfer, action };
};

// 交易执行
export const useDoTransferNftByTransaction = (): TransferNftByTransactionExecutor => {
    const checkIdentity = useCheckIdentity();

    const update = useTransactionStore((s) => s.update);

    const _doTransfer = useCallback(
        async (id: string, _created: number, transaction: SingleTransferTransaction) => {
            const identity = checkIdentity();
            if (!transaction_executing(id)) return; // 已经执行了，不能重复执行
            const spend = Spend.start(
                `transfer nft by transaction ${uniqueKey(transaction.args.owner.token_id)}`,
            );
            let done_action = false;

            function doAction<T>(
                action: TransferringAction,
                fetch_action: (action: SingleTransferAction<T>) => Promise<T>,
                do_action: () => Promise<T>,
            ): Promise<T> {
                return new Promise((resolve, reject) => {
                    const action_with_data = transaction.actions.find((a) => a.action === action);
                    if (action_with_data) {
                        spend.mark(`already done ${action}`);
                        fetch_action(action_with_data).then(resolve).catch(reject);
                    } else {
                        done_action = true;
                        do_action().then(resolve).catch(reject);
                    }
                });
            }

            const setAction = () => {};

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

                // ? 1. 检查是否要取回
                await doAction(
                    'RETRIEVING',
                    async () => {},
                    async () => {
                        await doRetrieve(setAction, identity, transaction.args.owner, spend);
                        transaction.actions.push({ action: 'RETRIEVING', timestamp: Date.now() });
                        await update(id, transaction, 'executing');
                    },
                );
                if (done_action) return;

                // ? 2. 进行转移
                await doAction(
                    'TRANSFERRING',
                    async () => {},
                    async () => {
                        await doTransfer(
                            transaction.args.owner,
                            identity,
                            setAction,
                            transaction.args.to,
                            spend,
                        );
                        transaction.actions.push({ action: 'TRANSFERRING', timestamp: Date.now() });
                        await update(id, transaction, 'successful');
                    },
                );
            } catch (e: any) {
                console.debug(`🚀 ~ file: transfer.tsx:619 ~ e:`, e);
                const message = `${e.message ?? e}`;
                await update(id, transaction, 'failed', message);
            } finally {
                transaction_executed(id);
            }
        },
        [checkIdentity, update],
    );

    return _doTransfer;
};

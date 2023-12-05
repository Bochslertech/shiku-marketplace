import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { LedgerTokenBalance } from '@/01_types/canisters/ledgers';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftIdentifier } from '@/01_types/nft';
import { exponentNumber } from '@/02_common/data/numbers';
import { principal2account } from '@/02_common/ic/account';
import { parse_token_identifier } from '@/02_common/nft/ext';
import { Spend } from '@/02_common/react/spend';
import {
    LaunchpadCollectionInfo,
    LaunchpadCollectionStatus,
} from '@/03_canisters/yumi/yumi_launchpad';
import { icpAccountBalance } from '@/05_utils/canisters/ledgers/icp';
import {
    claimLaunchpadNFT,
    queryOpenUserRemainAmount,
    queryWhitelistUserRemainAmount,
} from '@/05_utils/canisters/yumi/launchpad';
import { getYumiLaunchpadCanisterId } from '@/05_utils/canisters/yumi/special';
import { useIdentityStore } from '@/07_stores/identity';
import { useCheckAction } from '../common/action';
import { useCheckIdentity } from '../common/identity';
import { useCheckKyc } from '../common/kyc';
import { LedgerTransferExecutor, useTransferByICP } from '../ledger/transfer';

// 默认最大购买限制
const MAX_PURCHASE = 50;

// 购买 Launchpad 状态

export type LaunchpadBuyAction =
    | undefined // 未开始
    | 'DOING' // 开始
    | 'CHECKING_KYC' // 检查KYC
    | 'CHECKING_PURCHASE' // 检查可购买的数量，如果不检查钱给了，没买成就不负责任
    | 'CHECKING_BALANCE' // 检查余额是否充足
    | 'PAY' // 付款
    | 'CLAIMING'; // 取回所购买的NFT

export type BuyLaunchpadNftExecutor = (count: number) => Promise<NftIdentifier[] | undefined>;

export const useLaunchpadPurchase = (
    info: LaunchpadCollectionInfo,
    status: LaunchpadCollectionStatus,
): {
    max: number; // 当前用户的最大购买数量
    price: string; // 定价
    buy: BuyLaunchpadNftExecutor; // 购买
    action: LaunchpadBuyAction;
} => {
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const checkIdentity = useCheckIdentity();
    const checkAction = useCheckAction();
    const checkKyc = useCheckKyc();

    // 白名单需要获取白名单的可用余额
    const [whitelist, setWhitelist] = useState<number | undefined>(undefined);
    useEffect(() => {
        if (!identity) return setWhitelist(undefined);
        if (status !== 'whitelist') return setWhitelist(undefined);
        wrappedQueryWhitelistUserRemainAmount(identity, info).then(setWhitelist);
    }, [identity, status, info]);

    // 公售需要获取公售的可用余额
    const [open, setOpen] = useState<number | undefined>(undefined);
    useEffect(() => {
        if (!identity) return setOpen(undefined);
        if (status !== 'open') return setOpen(undefined);
        wrappedQueryOpenUserRemainAmount(identity, info).then(setOpen);
    }, [identity, status, info]);

    // 综合计算可买数量
    const [max, setMax] = useState<number>(0);
    useEffect(() => {
        if (status === 'whitelist') {
            setMax(whitelist ?? Number(info.whitelist_limit));
        } else if (status === 'open') {
            setMax(
                open ??
                    (info.open_limit !== undefined
                        ? Math.min(MAX_PURCHASE, Number(info.open_limit))
                        : MAX_PURCHASE),
            );
        } else setMax(0);
    }, [status, info, whitelist, open]);

    // 提供给上级当前的单价,用于计算显示
    const [price, setPrice] = useState<string>('0');
    useEffect(() => {
        if (['upcoming', 'whitelist'].includes(status) && info.whitelist_supply !== '0')
            setPrice(info.whitelist_price);
        else if (['open'].includes(status)) setPrice(info.open_price);
        else setPrice('0');
    }, [status, info]);

    // 标记当前状态
    const [action, setAction] = useState<LaunchpadBuyAction>(undefined);

    // 需要使用转账
    const { balance, fee, decimals, transfer } = useTransferByICP();

    const buy = useCallback(
        async (count: number): Promise<NftIdentifier[] | undefined> => {
            const identity = checkIdentity();
            if (!checkArgs(count)) return undefined;
            checkAction(action, `Purchasing`); // 防止重复点击

            setAction('DOING');
            try {
                const spend = Spend.start(`launchpad purchase ${info.collection} ${count}`);

                // ? 1. 检查KYC
                await checkKyc({
                    before: () => setAction('CHECKING_KYC'),
                    requirement: true,
                    after: () => spend.mark(`${action} DONE`),
                });

                // ? 2. 检查可购买数量
                await checkPurchase(
                    setAction,
                    identity,
                    info,
                    max,
                    status,
                    whitelist,
                    setWhitelist,
                    setOpen,
                    spend,
                    count,
                );

                // ? 3. 检查余额
                const amount = await checkBalance(
                    setAction,
                    balance,
                    identity,
                    spend,
                    price,
                    count,
                    fee,
                    decimals,
                );

                // ? 4. 付款
                const height = await doPay(setAction, transfer, amount, info.index, spend);

                if (!height) {
                    throw new Error(`height is undefined`);
                }
                // ? 5. 取回所购买的 NFT
                const token_index_list = await doClaim(setAction, identity, height, spend);

                // ? 6. 后处理, 清空老数据
                await doClean(status, identity, info, setWhitelist, setOpen);

                // ? 7. 圆满完成
                console.debug(`launchpad purchase claimed, token_index_list:`, token_index_list);
                return token_index_list.map((token_index) => ({
                    collection: info.collection,
                    token_identifier: parse_token_identifier(info.collection, token_index),
                })); // 返回结果
            } catch (e) {
                console.debug(`🚀 ~ file: launchpad.tsx:207 ~ e:`, e);
                message.error(`Purchase failed: ${e}`);
            } finally {
                setAction(undefined); // 恢复状态
            }
        },
        [
            checkIdentity,
            checkKyc,
            action,
            max,
            status,
            whitelist,
            open,
            info,
            balance,
            price,
            fee,
            decimals,
        ],
    );

    return {
        max,
        price,
        buy,
        action,
    };
};

const checkArgs = (count: number): boolean => {
    if (count <= 0) {
        message.warning(`Purchasing wrong number: ${count}`);
        return false; // 数量不对
    }
    return true;
};

const checkPurchase = async (
    setAction: (action: LaunchpadBuyAction) => void,
    identity: ConnectedIdentity,
    info: LaunchpadCollectionInfo,
    max: number,
    status: LaunchpadCollectionStatus,
    whitelist: number | undefined,
    setWhitelist: (whitelist: number | undefined) => void,
    setOpen: (open: number | undefined) => void,
    spend: Spend,
    count: number,
) => {
    setAction('CHECKING_PURCHASE');
    let max_purchase = max;
    if (status === 'whitelist' && whitelist === undefined) {
        // 说明 max 不靠谱,得重新计算一下
        max_purchase = await wrappedQueryWhitelistUserRemainAmount(identity, info);
        setWhitelist(max_purchase); // 替换最新的结果
    }
    if (status === 'open' && open === undefined) {
        // 说明 max 不靠谱,得重新计算一下
        max_purchase = await wrappedQueryOpenUserRemainAmount(identity, info);
        setOpen(max_purchase); // 替换最新的结果
    }
    spend.mark(`CHECKING_PURCHASE`);
    if (max_purchase < count) throw new Error(`purchase too many.(max purchase: ${max_purchase})`);
};

// 调用参数态度,封装一下
const wrappedQueryWhitelistUserRemainAmount = (
    identity: ConnectedIdentity,
    info: LaunchpadCollectionInfo,
) => {
    return queryWhitelistUserRemainAmount(identity, {
        collection: info.collection,
        whitelist_limit: info.whitelist_limit,
        supply: info.supply,
        remain: info.remain,
        whitelist_supply: info.whitelist_supply,
    });
};

// 调用参数态度,封装一下
const wrappedQueryOpenUserRemainAmount = (
    identity: ConnectedIdentity,
    info: LaunchpadCollectionInfo,
) => {
    return queryOpenUserRemainAmount(identity, {
        collection: info.collection,
        open_limit: info.open_limit ?? `${MAX_PURCHASE}`,
        supply: info.supply,
        remain: info.remain,
        open_supply: info.open_supply,
    });
};

const checkBalance = async (
    setAction: (action: LaunchpadBuyAction) => void,
    balance: LedgerTokenBalance | undefined,
    identity: ConnectedIdentity,
    spend: Spend,
    price: string,
    count: number,
    fee: string,
    decimals: number,
): Promise<string> => {
    setAction('CHECKING_BALANCE');
    const e8s = balance?.e8s ?? (await icpAccountBalance(identity.account)).e8s; // 没有余额的话,就主动获取一下吧

    spend.mark(`CHECKING_BALANCE`);
    const need = BigInt(price) * BigInt(count) + BigInt(fee);
    if (BigInt(e8s) < need)
        throw new Error(`Insufficient balance.(needs ${exponentNumber(`${need}`, -decimals)}ICP)`);

    return `${need}`;
};

const doPay = async (
    setAction: (action: LaunchpadBuyAction) => void,
    transfer: LedgerTransferExecutor,
    amount: string,
    memo: string, // info.index 标记购买的哪个 Launchpad
    spend: Spend,
): Promise<string | undefined> => {
    setAction('PAY');
    // ! 付款地址是 Launchpad 罐子
    const yumi_account = principal2account(getYumiLaunchpadCanisterId());
    const height = await transfer({
        to: yumi_account,
        amount,
        memo,
    });
    console.debug(`launchpad purchase paid, height:`, height);
    spend.mark(`PAY`);

    return height;
};

const doClaim = async (
    setAction: (action: LaunchpadBuyAction) => void,
    identity: ConnectedIdentity,
    height: string,
    spend: Spend,
): Promise<number[]> => {
    setAction('CLAIMING');
    const token_index_list = await claimLaunchpadNFT(identity, height);
    spend.mark(`CLAIMING`);

    return token_index_list;
};

const doClean = async (
    status: LaunchpadCollectionStatus,
    identity: ConnectedIdentity,
    info: LaunchpadCollectionInfo,
    setWhitelist: (whitelist: number | undefined) => void,
    setOpen: (open: number | undefined) => void,
) => {
    if (status === 'whitelist') {
        setWhitelist(undefined); // 防止再次购买使用上次的数据
        wrappedQueryWhitelistUserRemainAmount(identity, info).then(setWhitelist);
    }
    if (status === 'open') {
        setOpen(undefined); // 防止再次购买使用上次的数据
        wrappedQueryOpenUserRemainAmount(identity, info).then(setOpen);
    }
};

import { useCallback, useState } from 'react';
import { message } from 'antd';
import { LedgerTokenBalance } from '@/01_types/canisters/ledgers';
import { BiddingShikuAction, BidShikuNftExecutor } from '@/01_types/exchange/single-bid-shiku';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftIdentifier, TokenInfo } from '@/01_types/nft';
import { exponentNumber } from '@/02_common/data/numbers';
import { isSameNft, uniqueKey } from '@/02_common/nft/identifier';
import { Spend } from '@/02_common/react/spend';
import { icpAccountBalance } from '@/05_utils/canisters/ledgers/icp';
import { ogyAccountBalance } from '@/05_utils/canisters/ledgers/ogy';
import {
    queryAllAuctionOfferList,
    queryShikuLandsPayAccount,
    shikuLandsMakeOffer,
    shikuLandsUpdateOffer,
} from '@/05_utils/canisters/yumi/core';
import { useCheckAction } from '../../common/action';
import { useCheckIdentity } from '../../common/identity';
import { useCheckKyc } from '../../common/kyc';
import { checkWhitelist } from '../../common/whitelist';
import { LedgerTransferExecutor, useTransferByICP, useTransferByOGY } from '../../ledger/transfer';

export const useBidShikuNft = (): {
    bid: BidShikuNftExecutor;
    action: BiddingShikuAction;
} => {
    const checkIdentity = useCheckIdentity();
    const checkAction = useCheckAction();
    const checkKyc = useCheckKyc();

    // 标记当前状态
    const [action, setAction] = useState<BiddingShikuAction>(undefined);

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

    const bid = useCallback(
        async (
            token_id: NftIdentifier,
            owner: string,
            token: TokenInfo,
            price: string,
            ttl: string, // 出价持续要拍卖结束
        ): Promise<boolean> => {
            const identity = checkIdentity();
            if (!checkArgs(identity, owner)) return false;
            checkAction(action, `Bidding`); // 防止重复点击

            setAction('DOING');
            try {
                // ? 0. 检查白名单
                await checkWhitelist(identity, [token_id.collection, token.canister]);

                const spend = Spend.start(`bid shiku nft ${uniqueKey(token_id)}`);

                // ? 1. 检查KYC
                await checkKyc({
                    before: () => setAction('CHECKING_KYC'),
                    requirement: true,
                    after: () => spend.mark(`${action} DONE`),
                });

                // ? 2. 查询有没有之前的出价数据
                const offer_id = await queryOfferId(setAction, identity, token_id, spend);

                // ? 3. 获取付款地址
                const account = await queryYumiCorePayAccount(setAction, identity, spend);

                // 有条件付款
                if (offer_id) {
                    // ? 4. 检查付款地址余额
                    const balance = await checkPayAccountBalance(setAction, token, account, spend);

                    // 如果余额不足, 才需要补足差额
                    if (BigInt(balance) < BigInt(price)) {
                        const need = `${BigInt(price) - BigInt(balance)}`;
                        // ? 5. 检查用户可用余额
                        const { transfer } = await checkBalance(
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
                            need,
                        );

                        // ? 6. 付款
                        await pay2YumiCoreAccount(setAction, transfer, account, need, spend);
                    }
                } else {
                    // ? 5. 检查用户可用余额
                    const { transfer } = await checkBalance(
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
                    );

                    // ? 6. 付款
                    await pay2YumiCoreAccount(setAction, transfer, account, price, spend);
                }

                // ? 7. 出价
                if (offer_id) {
                    await yumiShikuUpdateOffer(setAction, identity, offer_id, price, spend);
                } else {
                    await yumiShikuMakeOffer(
                        setAction,
                        identity,
                        {
                            seller: owner,
                            token_id,
                            token,
                            price,
                            ttl,
                        },
                        spend,
                    );
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

    return { bid, action };
};

const checkArgs = (identity: ConnectedIdentity, owner: string | undefined): boolean => {
    // 检查不能是自己的 NFT
    if (owner && identity.account === owner) {
        message.warning(`You can't buy your own NFT`);
        return false; // 防止购买自己的 NFT
    }

    return true;
};

const queryOfferId = async (
    setAction: (action: BiddingShikuAction) => void,
    identity: ConnectedIdentity,
    token_id: NftIdentifier,
    spend: Spend,
): Promise<string | undefined> => {
    setAction('CHECKING_OFFER_ID');
    const offers = await queryAllAuctionOfferList(identity.principal);
    const offer = offers.find(
        (o) =>
            isSameNft(o.token_id, token_id) &&
            ['ineffect', 'accepted'].includes(o.status) /* cspell: disable-line */ &&
            o.bidder === identity.principal,
    );
    spend.mark(`CHECKING_OFFER_ID DONE: got -> ${offers.length} -> ${offer?.offerId}`);

    return offer?.offerId;
};

const queryYumiCorePayAccount = async (
    setAction: (action: BiddingShikuAction) => void,
    identity: ConnectedIdentity,
    spend: Spend,
): Promise<string> => {
    setAction('CHECKING_PAY_ACCOUNT');
    const account = (await queryShikuLandsPayAccount(identity)).toLowerCase();
    spend.mark(`CHECKING_PAY_ACCOUNT DONE: got pay account -> ${account}`);

    return account;
};

const checkPayAccountBalance = async (
    setAction: (action: BiddingShikuAction) => void,
    token: TokenInfo,
    account: string,
    spend: Spend,
): Promise<string> => {
    setAction('CHECKING_PAY_ACCOUNT_BALANCE');
    const { accountBalance } = (() => {
        switch (token.symbol) {
            case 'ICP':
                return {
                    accountBalance: icpAccountBalance,
                };
            case 'OGY':
                return {
                    accountBalance: ogyAccountBalance,
                };
            default:
                throw new Error(`unsupported token: ${token.symbol}`);
        }
    })();
    const e8s = (await accountBalance(account)).e8s; // 主动获取一下
    spend.mark(`CHECKING_PAY_ACCOUNT_BALANCE DONE: balance -> ${e8s}`);

    return e8s;
};

const checkBalance = async (
    setAction: (action: BiddingShikuAction) => void,
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
): Promise<{ fee: string; transfer: LedgerTransferExecutor }> => {
    setAction('CHECKING_BALANCE');
    const { balance, fee, decimals, transfer, accountBalance } = (() => {
        switch (token.symbol) {
            case 'ICP':
                return {
                    balance: icpBalance,
                    fee: icpFee,
                    decimals: icpDecimals,
                    transfer: icpTransfer,
                    accountBalance: icpAccountBalance,
                };
            case 'OGY':
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
        BigInt(fee); // 本次转账费用;
    if (BigInt(e8s) < need)
        throw new Error(
            `Insufficient balance.(needs ${exponentNumber(`${need}`, -decimals)}${token.symbol})`,
        );

    return { fee, transfer };
};

const pay2YumiCoreAccount = async (
    setAction: (action: BiddingShikuAction) => void,
    transfer: LedgerTransferExecutor,
    to: string,
    price: string,
    spend: Spend,
): Promise<string> => {
    setAction('PAY');
    // ! 付款地址是从 Core 查到的子账户地址
    const height = await transfer({
        to,
        amount: price,
    });
    console.debug(`buy nft paid ${price}, height:`, height);
    spend.mark(`PAY DONE: ${height}`);

    return height;
};

const yumiShikuMakeOffer = async (
    setAction: (action: BiddingShikuAction) => void,
    identity: ConnectedIdentity,
    args: {
        seller: string; // account_hex
        token_id: NftIdentifier;
        token: TokenInfo;
        price: string;
        ttl: string;
    },
    spend: Spend,
): Promise<void> => {
    setAction('MAKE_OFFER');
    await shikuLandsMakeOffer(identity, args);
    spend.mark(`MAKE_OFFER DONE`);
};

const yumiShikuUpdateOffer = async (
    setAction: (action: BiddingShikuAction) => void,
    identity: ConnectedIdentity,
    offer_id: string,
    price: string,
    spend: Spend,
): Promise<void> => {
    setAction('UPDATE_OFFER');
    await shikuLandsUpdateOffer(identity, { offer_id, price });
    spend.mark(`UPDATE_OFFER DONE`);
};

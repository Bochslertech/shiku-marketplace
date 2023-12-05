import { SupportedBackend } from '@/01_types/app';
import { NftOwnerAndListing } from '@/01_types/exchange/batch-buy-gold';
import { UserInfo } from '@/01_types/exchange/common';
import { NftIdentifier } from '@/01_types/nft';
import { exponentNumber } from '@/02_common/data/numbers';
import { uniqueKey } from '@/02_common/nft/identifier';
import { readLastConnectType } from '@/05_utils/app/storage';
import { getLedgerIcpDecimals } from '@/05_utils/canisters/ledgers/special';
import { getLarkUrl, getLarkUrlError } from '.';
import { sendLarkMessage } from './lark';

const send = (
    last: number,
    args: {
        env: SupportedBackend;
        isGold?: boolean;
        id: string;
        action: string;
        message: string;
        user_info?: UserInfo;
    },
    url?: string,
): number => {
    const now = Date.now();
    sendLarkMessage(url ?? getLarkUrl(), {
        env: args.env,
        exchange: args.isGold ? 'batch-buy-gold' : 'batch-buy',
        user_info: args.user_info,
        id: args.id,
        action: args.action,
        timestamp: now,
        duration: last ? now - last : 0,
        message: args.message,
    });
    return now;
};

// 开始购买
export const larkNoticeBatchBuyInitial = (
    env: SupportedBackend,
    id: string,
    principal: string,
    token_id_list: NftIdentifier[],
    price: string,
    other: string,
) => {
    send(0, {
        env,
        id,
        action: 'INITIAL',
        message: `purchaser: ${principal}
\ttoken_id_list: ${token_id_list.map(uniqueKey).join('|')}
\tprice: ${exponentNumber(price, -getLedgerIcpDecimals())} ${'ICP'}${
            other ? `\nOther: ${other}` : ''
        }`,
        user_info: {
            wallet: readLastConnectType(),
            agent: navigator.userAgent,
        },
    });
};

export const larkNoticeBatchBuyOver = (
    last: number,
    env: SupportedBackend,
    id: string,
    principal: string,
    token_id_list: NftIdentifier[],
    price: string,
    actions: string,
) => {
    setTimeout(() => {
        send(last, {
            env,
            id,
            action: 'OVER',
            message: `purchaser: ${principal}
\ttoken_id_list: ${token_id_list.map(uniqueKey).join('|')}
\tprice: ${exponentNumber(price, -getLedgerIcpDecimals())} ${'ICP'}${
                actions ? `\n${actions}` : ''
            }`,
        });
    }, 1000);
};

export const larkNoticeBatchBuy = (
    last: number,
    env: SupportedBackend,
    id: string,
    action: string,
    data?: string,
): number => {
    return send(last, {
        env,
        id,
        action,
        message: data ? `data: ${JSON.stringify(data)}` : '',
    });
};

export const larkNoticeBatchBuyFailed = (
    last: number,
    env: SupportedBackend,
    id: string,
    principal: string,
    token_id_list: NftIdentifier[],
    price: string,
    actions: string,
    error: string,
    log_error: boolean,
) => {
    setTimeout(() => {
        const args = {
            env,
            id,
            action: 'FAILED',
            message: `purchaser: ${principal}
\ttoken_id_list: ${token_id_list.map(uniqueKey).join('|')}
\tprice: ${exponentNumber(price, -getLedgerIcpDecimals())} ${'ICP'}${actions ? `\n${actions}` : ''}
Error: ${error}`,
        };
        send(last, args);
        log_error && send(last, args, getLarkUrlError());
    }, 1000);
};

// -------------------------- 黄金购买 --------------------------

export const larkNoticeBatchBuyGoldInitial = (
    env: SupportedBackend,
    id: string,
    principal: string,
    token_id_list: NftOwnerAndListing[],
    price: string,
    other: string,
) => {
    send(0, {
        env,
        id,
        isGold: true,
        action: 'INITIAL',
        message: `purchaser: ${principal}
\ttoken_id_list: Gold ${token_id_list.map((i) => i.owner.token_id.token_identifier).join('|')}
\ttotal price : ${exponentNumber(price, -getLedgerIcpDecimals())}${
            other ? `\nOther: ${other}` : ''
        }`,
    });
};

export const larkNoticeBatchBuyGoldOver = (
    last: number,
    env: SupportedBackend,
    id: string,
    principal: string,
    token_id_list: NftOwnerAndListing[],
    price: string,
    actions: string,
) => {
    setTimeout(() => {
        send(last, {
            env,
            id,
            isGold: true,
            action: 'OVER',
            message: `purchaser: ${principal}
\ttoken_id_list: ${token_id_list.map((i) => i.owner.token_id.token_identifier).join('|')}
\ttotal price: ${exponentNumber(price, -getLedgerIcpDecimals())} ${actions ? `\n${actions}` : ''}`,
        });
    }, 1000);
};

export const larkNoticeBatchBuyGold = (
    last: number,
    env: SupportedBackend,
    id: string,
    action: string,
    data?: any,
): number => {
    return send(last, {
        env,
        id,
        isGold: true,
        action,
        message: data ? `data: ${JSON.stringify(data)}` : '',
    });
};

export const larkNoticeBatchBuyGoldFailed = (
    last: number,
    env: SupportedBackend,
    id: string,
    principal: string,
    token_id_list: NftOwnerAndListing[],
    price: string,
    actions: string,
    error: string,
    log_error: boolean,
) => {
    setTimeout(() => {
        const args = {
            env,
            id,
            isGold: true,
            action: 'FAILED',
            message: `purchaser: ${principal}
\ttoken_id_list: ${token_id_list.map((i) => i.owner.token_id.token_identifier).join('|')}
\ttotal price: ${exponentNumber(price, -getLedgerIcpDecimals())}${actions ? `\n${actions}` : ''}
Error: ${error}`,
        };
        send(last, args);
        log_error && send(last, args, getLarkUrlError());
    }, 1000);
};

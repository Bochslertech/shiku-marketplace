import dayjs from 'dayjs';
import { SupportedBackend } from '@/01_types/app';
import { UserInfo } from '@/01_types/exchange/common';

// 需要队列发消息, 不要乱了
type LarkMessage = {
    url: string;
    body: string;
};

const messages: LarkMessage[] = [];
let last = 0;
const SEND_DURATION = 1000; // 每秒发送 1 条

const send = () => {
    if (messages.length === 0) return;
    const now = Date.now();
    if (now < last + SEND_DURATION) return setTimeout(send, SEND_DURATION);
    last = now; // 更新时间
    const lark_message = messages.splice(0, 1)[0]; // 取出一个
    fetch(lark_message.url, {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: lark_message.body,
    }).catch((e) => console.debug('🚀 ~ file: lark.ts:25 ~ send ~ e:', e));

    setTimeout(send, SEND_DURATION);
};

export const sendLarkMessage = (
    url: string,
    args: {
        env: SupportedBackend;
        exchange:
            | 'single-buy'
            | 'single-sell'
            | 'single-transfer'
            | 'batch-buy'
            | 'batch-buy-gold'
            | 'batch-sell';
        id: string;
        action: string;
        timestamp: number;
        duration: number; // 0 表示没有时间范围
        message: string;
        user_info?: UserInfo;
    },
) => {
    const message = `Env: ${args.env}
Ex: ${args.exchange}
Id: ${args.id}
Action: ${args.action}${args.duration ? ` over` : ''}
Timestamp: ${dayjs(new Date(args.timestamp)).format('YY-MM-DD HH:mm:ss.SSS')}${
        args.duration ? `\nSpend: ${args.duration}ms` : ''
    }${args.user_info ? '\nUserinfo: ' + JSON.stringify(args.user_info) : ''}${
        args.message ? `\nMsg: ${args.message}` : ''
    }`;

    console.debug('send lark message', message);

    // 如果有通知地址,则发送请求
    if (url) {
        messages.push({
            url,
            body: JSON.stringify({ msg_type: 'text', content: { text: message } }),
        });
        send();
    }
};

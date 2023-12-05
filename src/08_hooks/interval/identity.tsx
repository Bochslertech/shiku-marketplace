import { useCallback, useEffect } from 'react';
import { useInterval } from 'usehooks-ts';
import { useIdentityStore } from '@/07_stores/identity';

// 身份信息轮询
export const watchIdentityProfile = () => {
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const profile = useIdentityStore((s) => s.identityProfile);
    const reloadIdentityProfile = useIdentityStore((s) => s.reloadIdentityProfile);
    useInterval(() => {
        // 如果登录了,但是没有获取到信息,就不断尝试
        if (identity && !profile) reloadIdentityProfile();
    }, 13000); // 每 13 秒检查一次
};

// 查询用户余额

const useRefreshLedgerBalance = (): (() => void) => {
    const identity = useIdentityStore((s) => s.connectedIdentity);

    const reloadIcpBalance = useIdentityStore((s) => s.reloadIcpBalance);
    const reloadOgyBalance = useIdentityStore((s) => s.reloadOgyBalance);

    const refresh = useCallback(() => {
        if (!identity) return;
        reloadIcpBalance();
        reloadOgyBalance();
    }, [identity]);

    return refresh;
};

let identity_balance_used = 0;
let identity_balance_reloading = false;
export const useQueryIdentityBalance = (delay = 60000) => {
    const refresh = useRefreshLedgerBalance();

    // 定时更新
    useInterval(() => {
        if (identity_balance_used <= 0) return;
        if (identity_balance_reloading) return;
        identity_balance_reloading = true;
        try {
            refresh();
        } finally {
            identity_balance_reloading = false;
        }
    }, delay);

    // 记录使用次数
    useEffect(() => {
        identity_balance_used++;
        return () => {
            identity_balance_used--;
        };
    }, []);
};

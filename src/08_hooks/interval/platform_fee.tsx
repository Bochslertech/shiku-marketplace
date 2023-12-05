import { useEffect } from 'react';
import { useInterval } from 'usehooks-ts';
import { YumiPlatformFee } from '@/03_canisters/yumi/yumi_core';
import { queryYumiPlatformFee } from '@/05_utils/canisters/yumi/core';
import { useAppStore } from '@/07_stores/app';

let used = 0;
let reloading = false;
export const useYumiPlatformFee = (): YumiPlatformFee | undefined => {
    const yumiPlatformFee = useAppStore((s) => s.yumi_platform_fee);

    const setYumiPlatformFee = useAppStore((s) => s.setYumiPlatformFee);

    const fetchYumiPlatformFee = () => queryYumiPlatformFee().then((v) => setYumiPlatformFee(v));

    // 定时更新
    useInterval(() => {
        if (used <= 0) return;
        if (reloading) return;
        reloading = true;
        try {
            fetchYumiPlatformFee()
                .catch(() => fetchYumiPlatformFee())
                .catch(() => fetchYumiPlatformFee());
        } finally {
            reloading = false;
        }
    }, 1000 * 3600); // 每小时轮询一次

    // 记录使用次数
    useEffect(() => {
        used++;
        return () => {
            used--;
        };
    }, []);

    return yumiPlatformFee;
};

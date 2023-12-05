import { useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { queryIcpPriceInUsd } from '@/05_utils/apis/yumi/alchemy';
import { queryTokenUsdRate } from '@/05_utils/apis/yumi/api';
import { useAppStore } from '@/07_stores/app';

const DELAY = 17000;
let used = 0;
let reloading = 0;
export const useTokenRate = (): { icp_usd: string | undefined; ogy_usd: string | undefined } => {
    const icp_usd = useAppStore((s) => s.icp_usd);
    const ogy_usd = useAppStore((s) => s.ogy_usd);

    const setIcpUsd = useAppStore((s) => s.setIcpUsd);
    const setOgyUsd = useAppStore((s) => s.setOgyUsd);

    const fetchIcpUsd = () => queryTokenUsdRate('ICP').then((v) => setIcpUsd(v));
    const fetchOgyUsd = () => queryTokenUsdRate('OGY').then((v) => setOgyUsd(v));

    // 定时更新
    useInterval(() => {
        if (used <= 0) return;
        const now = Date.now();
        if (now < reloading + DELAY) return;
        reloading = now;
        fetchIcpUsd();
        fetchOgyUsd();
    }, DELAY);

    // 记录使用次数
    useEffect(() => {
        used++;
        return () => {
            used--;
        };
    }, []);

    return {
        icp_usd,
        ogy_usd,
    };
};

let reloading_alchemy = 0;
export const useIcpPriceInAlchemy = () => {
    const [icpUsd, setIcpUsd] = useState<string>();
    useEffect(() => {
        queryIcpPriceInUsd().then(setIcpUsd);
    }, []);
    // 定时更新
    useInterval(async () => {
        const now = Date.now();
        if (now < reloading_alchemy + DELAY) return;
        reloading_alchemy = now;
        setIcpUsd(await queryIcpPriceInUsd());
    }, DELAY);
    return icpUsd;
};

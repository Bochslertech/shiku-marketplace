import { useCallback, useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { MILLISECONDS } from '@/02_common/data/dates';

// 主页 banner 自动切换
export const useHomeBannerCurrent = (length: number | undefined): number => {
    const [current, setCurrent] = useState<number>(0);

    const next = useCallback(
        () => length && setCurrent((current) => (current + 1) % length),
        [length],
    );

    // interval change banner
    useInterval(next, 3000);

    return current;
};

// 主页 Featured 自动切换
export const useHomeFeaturedCurrent = (
    length: number | undefined,
): {
    current: number;
    next: () => void;
    previous: () => void;
} => {
    const [current, setCurrent] = useState<number>(0);
    useEffect(() => {
        length && setCurrent(Math.floor(length / 3 + 1));
    }, [length]);

    useEffect(() => {
        if (!length) return;
        if (current === 1) setCurrent(Math.floor(length / 3 + 1));
        else if (current === length - 2) setCurrent(Math.floor((2 * length) / 3 - 2));
    }, [current]);

    // 标记手动操作时间
    const [manual, setManual] = useState<number>(0);

    const next = useCallback(() => {
        setManual(Date.now());
        length && setCurrent((current) => (current + 1) % length);
    }, [length]);

    const previous = useCallback(() => {
        setManual(Date.now());
        length && setCurrent((current) => (current - 1) % length);
    }, [length]);

    // interval change featured
    useInterval(() => {
        const now = Date.now();
        if (now < manual + MILLISECONDS * 10) return; //手动操作 10 秒内, 不触发
        length && setCurrent((current) => (current + 1) % length);
    }, 3000);

    return {
        current,
        next,
        previous,
    };
};

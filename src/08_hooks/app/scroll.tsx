import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// 每次进入新的路由, 都回到最顶端

const isSamePage = (last: string, pathname: string, key: string): boolean => {
    return last.indexOf(key) >= 0 && pathname.indexOf(key) >= 0;
};

export const watchScrollToTop = () => {
    const { pathname } = useLocation();

    const [last, setLast] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (last === pathname) return;

        const top = ((): boolean => {
            if (last) {
                // 判断是否需要回到顶部
                // 1. 个人中心的 tab 切换不用回到顶部
                if (isSamePage(last, pathname, '/profile')) return false;
                // 2. explore的 tab 切换不用回到顶部
                if (isSamePage(last, pathname, '/explore')) return false;
                // 3. shiku的 tab 切换不用回到顶部
                if (isSamePage(last, pathname, '/shiku')) return false;
            }
            return true;
        })();

        if (top) window.scrollTo(0, 0);
        setLast(pathname);
    }, [last, pathname]);
};

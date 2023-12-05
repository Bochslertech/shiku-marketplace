import { useEffect } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { useDeviceStore } from '@/07_stores/device';

// 监听设备变化
export const watchDevice = () => {
    const size = useWindowSize();

    const reload = useDeviceStore((s) => s.reloadDeviceInfo);

    useEffect(reload, [size]);
};

// PC 显示
export const BrowserView = ({ children }) => {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);
    if (isMobile) return <></>;
    return <>{children}</>;
};

// 手机显示
export const MobileView = ({ children }) => {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);
    if (!isMobile) return <></>;
    return <>{children}</>;
};

import { useCallback } from 'react';
import { useMessage } from './message';

// 检查是否已经执行了
export const useCheckAction = (): ((action: string | undefined, tips: string) => void) => {
    const message = useMessage();

    const checkAction = useCallback(
        (action: string | undefined, tips: string) => {
            if (action !== undefined) {
                message.warning(tips);
                throw new Error(`already executing`); // 防止重复点击
            }
        },
        [message],
    );

    return checkAction;
};

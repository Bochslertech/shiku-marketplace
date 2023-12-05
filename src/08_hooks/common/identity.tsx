import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectedIdentity } from '@/01_types/identity';
import { useIdentityStore } from '@/07_stores/identity';

// 检查身份是否登录
export const useCheckIdentity = (): (() => ConnectedIdentity) => {
    const navigate = useNavigate();

    const identity = useIdentityStore((s) => s.connectedIdentity);

    const checkIdentity = useCallback(() => {
        if (!identity) {
            navigate('/connect');
            throw new Error(`please connect your identity`); // 未登录
        }
        return identity;
    }, [identity]);

    return checkIdentity;
};

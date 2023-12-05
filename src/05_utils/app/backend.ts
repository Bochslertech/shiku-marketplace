import { SupportedBackend } from '@/01_types/app';
import { getBuildMode, getCommand } from './env';
import { BACKEND_TYPE, readStorage } from './storage';

// let backendType: SupportedBackend = 'production';
let backendType: SupportedBackend | undefined = undefined; // 不允许返回不正确的数据

// 设置后端类型, 必须在所有的调用前设置
export const setBackendType = (backend: SupportedBackend) => (backendType = backend);

// 读取后端类型
export const getBackendType = (): SupportedBackend => {
    if (backendType === undefined) throw new Error('backend type can not be undefined');
    return backendType;
};

// 获取默认的后端
export const getInitialBackendType = (): SupportedBackend => {
    const origin = location.origin;
    if (
        [
            'https://yumi.io',
            'https://tppkg-ziaaa-aaaal-qatrq-cai.ic0.app',
            'https://6rxmp-vaaaa-aaaai-qpbfq-cai.icp0.io',
        ].includes(origin)
    ) {
        return 'production';
    }
    if (
        ['https://staging.yuminft.xyz', 'https://h6mxt-byaaa-aaaah-abzha-cai.ic0.app'].includes(
            origin,
        )
    ) {
        return 'staging';
    }
    if (
        [
            'https://staging.yumi.io',
            'https://zc6lp-xyaaa-aaaah-aaneq-cai.ic0.app',
            'https://zfwjp-miaaa-aaaai-qpbwa-cai.icp0.io',
        ].includes(origin)
    ) {
        return 'test';
    }
    return 'production';
};

// 初始化后端设置 // ! 必须最先设置后端类型，否则登录组件获取到的白名单就是错误的
export const initBackendType = () => {
    const backendType = JSON.parse(
        readStorage(BACKEND_TYPE) ?? JSON.stringify(getInitialBackendType()),
    ); // useLocalStorage 设置的值外边有引号
    setBackendType(backendType as SupportedBackend);

    console.debug(`>>>>> frontend: ${getBuildMode()} <<<<<`);
    console.debug(`>>>>> backend: ${backendType} <<<<<`);
    console.debug(`>>>>> command: ${getCommand()} <<<<<`);
};

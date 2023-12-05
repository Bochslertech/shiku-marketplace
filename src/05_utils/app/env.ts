import { BuildMode } from '@/vite-env';
import { getBackendType } from './backend';

// 只有在正式环境下
const IS_PRODUCTION = [
    'https://yumi.io',
    'https://tppkg-ziaaa-aaaal-qatrq-cai.ic0.app',
    'https://tppkg-ziaaa-aaaal-qatrq-cai.raw.ic0.app',
    'https://6rxmp-vaaaa-aaaai-qpbfq-cai.icp0.io',
    'https://6rxmp-vaaaa-aaaai-qpbfq-cai.raw.icp0.io',
].includes(location.origin);
// 只有在预发布环境下
const IS_STAGING = [
    'https://staging.yuminft.xyz',
    'https://h6mxt-byaaa-aaaah-abzha-cai.ic0.app',
    'https://h6mxt-byaaa-aaaah-abzha-cai.raw.ic0.app',
].includes(location.origin);
// 只有在测试环境下
const IS_TEST = [
    'https://staging.yumi.io',
    'https://zc6lp-xyaaa-aaaah-aaneq-cai.ic0.app',
    'https://zc6lp-xyaaa-aaaah-aaneq-cai.raw.ic0.app',
].includes(location.origin);
// 只有在开发环境环境下
const IS_DEVELOPMENT = !IS_PRODUCTION && !IS_STAGING && !IS_TEST;

// 构建命令
export const getCommand = (): 'serve' | 'build' => (process?.env?.NODE_ENV ? 'serve' : 'build');

// 当前构建模式
export const getBuildMode = (): BuildMode => {
    if (IS_PRODUCTION) return 'production';
    if (IS_TEST) return 'staging';
    if (IS_TEST) return 'test';
    if (IS_DEVELOPMENT) return 'development';

    const mode = import.meta.env.BUILD_MODE;
    // console.warn('ENV_MODE', mode);
    switch (mode) {
        case 'production':
        case 'staging':
        case 'test':
        case 'development':
            return mode;
    }
    console.error(`Unknown mode: ${mode}. Parse backend mode failed.`);
    return 'production';
};

// 是否开发模式
export const isDevMode = (): boolean => getBuildMode() !== 'production';

// 获取当前后端模式下的登录衍生地址
// 封装一下登录判断
// 核心逻辑是, 根据域名和后端类型判断应该使用的代理
const CHECKED_DERIVATION_ORIGINS = [
    'yumi.io', // ! 正式环境
    'tppkg-ziaaa-aaaal-qatrq-cai', // ! 正式环境 - 登录锚点
    '6rxmp-vaaaa-aaaai-qpbfq-cai', // ! 正式环境 - 重构部署
    'h6mxt-byaaa-aaaah-abzha-cai', // * 预发布环境
    'staging.yumi.io', // ? 测试环境
    'zc6lp-xyaaa-aaaah-aaneq-cai', // ? 测试环境
    'zfwjp-miaaa-aaaai-qpbwa-cai', // 开发环境
];
export const getConnectDerivationOrigin = (): string | undefined => {
    if (getCommand() === 'build') {
        const origin = window.location.origin;
        const backendType = (() => {
            const mode = getBuildMode();
            if (mode === 'production') return mode;
            if (mode === 'staging') return mode;
            if (mode === 'test') return mode;
            const backendType = getBackendType();
            switch (backendType) {
                case 'production':
                case 'staging':
                case 'test':
                    return backendType;
            }
            throw new Error(`can not find backend type: ${backendType}`);
        })();
        for (const derivationOrigin of CHECKED_DERIVATION_ORIGINS) {
            if (origin.indexOf(derivationOrigin) >= 0) {
                switch (backendType) {
                    case 'production':
                        return 'https://tppkg-ziaaa-aaaal-qatrq-cai.raw.ic0.app'; // ! 正式环境使用的登录锚点
                    case 'staging':
                        return 'https://h6mxt-byaaa-aaaah-abzha-cai.raw.ic0.app'; // * 预发布环境使用的登录锚点
                    case 'test':
                        return 'https://zc6lp-xyaaa-aaaah-aaneq-cai.raw.ic0.app'; // ? 测试环境使用的登录锚点
                }
            }
        }
    }
    return import.meta.env.CONNECT_DERIVATION_ORIGIN
        ? import.meta.env.CONNECT_DERIVATION_ORIGIN
        : undefined;
};

// ic 官网的链接地址 // https://boundary.ic0.app // https://icp-api.io/
export const getConnectHost = (): string | undefined =>
    import.meta.env.CONNECT_HOST ? import.meta.env.CONNECT_HOST : undefined;

export const isGoldTheme = () => import.meta.env.YUMI_GOLD_THEME;

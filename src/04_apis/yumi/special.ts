import { SupportedBackend } from '@/01_types/app';
import { BuildMode } from '@/vite-env';

export type SpecialHosts = {
    // 1. 查询 ICP 汇率
    // 2. 查询 OGY 支持的代币
    // 3. Gold 相关接口
    yumi_api: string; // ? API_URL
    // 1. 查询集合交易统计信息
    // 2. 查询集合地板价统计信息
    yumi_api2: string;
    // 1. 查询 kyc
    yumi_kyc: string;
    // 1. 首页 Banner
    // 2. 首页热门集合
    // 3. 首页热门 Featured Card
    // 4. 指定集合的地板价
    // 5. 指定集合历史交易记录
    // 6. 指定 NFT 历史交易记录
    // 7. Explore Banner
    // 7. Explore Art 大卡片
    yumi_aws: string; // ? AWS_API_URL
    // 1. 查询icp价格
    yumi_alchemy_host: string;
};

const hosts_production: SpecialHosts = {
    yumi_api: 'https://api.yumi.io/api', // ? API_URL
    yumi_api2: 'https://api2.yumi.io',
    yumi_kyc: 'https://api2.yumi.io/v2/kyc',
    yumi_aws: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com',
    yumi_alchemy_host: 'https://api.alchemypay.org/index/v2',
};

const hosts_staging: SpecialHosts = {
    yumi_api: 'https://api.yumi.io/api', // ? API_URL
    yumi_api2: 'https://api2.yumi.io',
    yumi_kyc: 'https://api2.yumi.io/v2/kyc',
    yumi_aws: 'https://yumi-frontend-assets-stage.s3.ap-east-1.amazonaws.com',
    yumi_alchemy_host: 'https://api.alchemypay.org/index/v2',
};

const hosts_test: SpecialHosts = {
    yumi_api: 'https://api-dev.yumi.io/api', // ? API_URL
    yumi_api2: 'https://staging.api2.yumi.io',
    yumi_kyc: 'https://staging.api2.yumi.io/v2/kyc',
    yumi_aws: 'https://yumi-frontend-assets-dev.s3.ap-east-1.amazonaws.com',
    yumi_alchemy_host: 'https://api.alchemypay.org/index/v2',
};

export const findSpecialHosts = (mode: BuildMode, backendType: SupportedBackend): SpecialHosts => {
    if (mode === 'production') return hosts_production;
    if (mode === 'staging') return hosts_staging;
    if (mode === 'test') return hosts_test;

    // 开发构建可以自由配置选择后端
    switch (backendType) {
        case 'production':
            return hosts_production;
        case 'staging':
            return hosts_staging;
        case 'test':
            return hosts_test;
    }
    throw new Error(`can not find special hosts: ${backendType}`);
};

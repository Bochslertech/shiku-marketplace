import {
    NFT_OGY_GOLD_PRODUCTION,
    NFT_OGY_GOLD_STAGING,
    NFT_OGY_GOLD_TEST,
} from '@/03_canisters/nft/special';
import { getBackendType } from '../../app/backend';
import { getBuildMode } from '../../app/env';

// 当前后端环境所需要的黄金罐子
export const getOgyGoldCanisterId = (): string[] => {
    const mode = getBuildMode();
    if (mode === 'production') return NFT_OGY_GOLD_PRODUCTION;
    if (mode === 'staging') return NFT_OGY_GOLD_STAGING;
    if (mode === 'test') return NFT_OGY_GOLD_TEST;

    // 开发构建可以自由配置选择
    const backendType = getBackendType();
    switch (backendType) {
        case 'production':
            return NFT_OGY_GOLD_PRODUCTION;
        case 'staging':
            return NFT_OGY_GOLD_STAGING;
        case 'test':
            return NFT_OGY_GOLD_TEST;
    }
    throw new Error(`can not find special canisters: ${backendType}`);
};

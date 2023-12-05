import { findSpecialCanisters, SpecialCanisters } from '@/03_canisters/yumi/special';
import { getBackendType } from '../../app/backend';
import { getBuildMode } from '../../app/env';

const findCanisters = (): SpecialCanisters =>
    findSpecialCanisters(getBuildMode(), getBackendType());

export const getYumiCoreCanisterId = (): string => findCanisters().yumi_core;
export const getYumiCreditPointsCanisterId = (): string => findCanisters().yumi_credit_points;
export const getYumiArtistRouterCanisterId = (): string => findCanisters().yumi_artist_router;
export const getYumiUserRecordCanisterId = (): string => findCanisters().yumi_user_record;
export const getYumiOrigynArtCanisterId = (): string => findCanisters().yumi_origyn_art;
export const getYumiOrigynArtProposalCanisterId = (): string =>
    findCanisters().yumi_origyn_art_proposal;
export const getYumiCccProxyCanisterId = (): string => findCanisters().yumi_ccc_proxy;
export const getYumiLaunchpadCanisterId = (): string => findCanisters().yumi_launchpad;
export const getYumiApplicationCanisterId = (): string => findCanisters().yumi_application;
export const getYumiOatCanisterId = (): string => findCanisters().yumi_oat;
export const getYumiShikuLandsCollection = (): string => findCanisters().yumi_shiku_lands;
export const getYumiJwtTokenCanisterId = (): string => findCanisters().yumi_jwt_token;

// export const getYumiKycCanisterId = (): string => findSpecialCanisters().yumi_kyc;

// ========================== Gold 回购白名单 ==========================

// 黄金要只显示卖家, 如果是 yumi 控制的就是直接展示 yumi 即可
export const SHOW_YUMI_SELLERS = [
    '55c9042b813ef2d6c29e517941460d755a6f561c2811fdb7600a9a8771f3c0af', // kvxmz-2wzgu-k5bco-b6xeo-rwxof-jt65n-c5i7j-b6vac-zemky-tutht-7qe
    '0335b0c61dd0eaf0b4a381a885039ca8b83ee3bf1eb7164d9430933789b6608f', // nka23-rvoky-suzg7-qvnev-ldniw-vhaft-idot4-zenzk-oyryp-7hqpc-iqe
];

const GOLD_BUY_BACK_ALLOW_LIST_PROD = [
    'kvxmz-2wzgu-k5bco-b6xeo-rwxof-jt65n-c5i7j-b6vac-zemky-tutht-7qe',
];
const GOLD_BUY_BACK_ALLOW_LIST_TEST = [
    'nka23-rvoky-suzg7-qvnev-ldniw-vhaft-idot4-zenzk-oyryp-7hqpc-iqe',
];
export const getGoldBuyBackAllowList = (): string[] => {
    const mode = getBuildMode();
    if (mode === 'production') return GOLD_BUY_BACK_ALLOW_LIST_PROD;
    if (mode === 'staging') return GOLD_BUY_BACK_ALLOW_LIST_PROD;
    if (mode === 'test') return GOLD_BUY_BACK_ALLOW_LIST_TEST;

    // 开发构建可以自由配置选择后端
    const backendType = getBackendType();
    switch (backendType) {
        case 'production':
            return GOLD_BUY_BACK_ALLOW_LIST_PROD;
        case 'staging':
            return GOLD_BUY_BACK_ALLOW_LIST_PROD;
        case 'test':
            return GOLD_BUY_BACK_ALLOW_LIST_TEST;
    }
    throw new Error(`can not find special buy back allow list: ${backendType}`);
};

import { SupportedBackend } from '@/01_types/app';
import { isCanisterIdText } from '@/02_common/ic/principals';
import { BuildMode } from '@/vite-env';

// yumi 功能相关的罐子
export type SpecialCanisters = {
    // 目前已知的功能有:
    // 1. 查询用户的基本信息
    // 2. 查询当前 Collection Id // ! 初始罐子 id
    // 3. 查询二级市场 Collection Data
    // 4. 查询 NFT 的上架信息 ogy 除外
    yumi_core: string; // ? SHIKU_CANISTER_ID
    // 1. 查询用户信用积分余额
    yumi_credit_points: string; // ? POINT_CANISTER_ID
    // 1. 查询所有的 Artist 罐子 // ! 初始罐子 id
    yumi_artist_router: string; // ? ARTIST_ROUTER_CANISTER_ID
    // 1. 查询用户事件记录
    yumi_user_record: string; // ? NEW_RECORD_CANISTER_ID
    // 1. 查询 co-owned 相关的罐子 // ! 初始罐子 id
    yumi_origyn_art: string; // ? ORIGYN_YUMI_CANISTER_ID
    // 1. 小皮裙投票罐子
    yumi_origyn_art_proposal: string;
    // 1. 代持 CCC 的 NFT 才能交易
    yumi_ccc_proxy: string; // ? CCC_PROXY_CANISTER_ID
    // 1. 和 launchpad 相关数据
    yumi_launchpad: string; // ? LAUNCHPAD_CANISTER_ID
    // 1. 查询可用的存储罐
    yumi_application: string; // ? APPLY_CANISTER_ID
    // 1. 查询 oat 罐子
    yumi_oat: string; // ? OAT_CANISTER_ID
    // 1. Shiku 罐子
    yumi_shiku_lands: string; // ? LANDS_CANISTER_ID
    // 1. 生成用户jwt token
    yumi_jwt_token: string;

    // 1. 查询用户是否 KYC
    // yumi_kyc: string; // ? KYC_CANISTER_ID
    // yumi_gallery: string; // ? GALLERY_CANISTER_ID
};

// ! 生产环境
const canisters_production: SpecialCanisters = {
    yumi_core: 'udtw4-baaaa-aaaah-abc3q-cai', // ? SHIKU_CANISTER_ID
    yumi_credit_points: 'qqamp-7iaaa-aaaah-qakha-cai', // ? POINT_CANISTER_ID
    yumi_artist_router: 'qnblj-lyaaa-aaaah-aa74a-cai', // ? ARTIST_ROUTER_CANISTER_ID
    yumi_user_record: '56www-tyaaa-aaaap-aai4q-cai', // ? NEW_RECORD_CANISTER_ID
    yumi_origyn_art: 'od7d3-vaaaa-aaaap-aamfq-cai', // ? ORIGYN_YUMI_CANISTER_ID
    yumi_origyn_art_proposal: 'pzzyl-yyaaa-aaaah-adn6q-cai',
    yumi_ccc_proxy: 'owefd-waaaa-aaaah-abu2q-cai', // ? CCC_PROXY_CANISTER_ID
    yumi_launchpad: 'pczmq-maaaa-aaaah-abhwa-cai', // ? LAUNCHPAD_CANISTER_ID
    yumi_application: 'cxgiz-nyaaa-aaaah-abg6q-cai', // ? APPLY_CANISTER_ID
    yumi_oat: 'v43fl-cyaaa-aaaah-abc7a-cai', // ? OAT_CANISTER_ID
    yumi_shiku_lands: '3j32q-6iaaa-aaaap-aaijq-cai', // ? LANDS_CANISTER_ID
    yumi_jwt_token: 'rsyqn-haaaa-aaaah-adpsa-cai',

    // yumi_kyc: 'ucs6g-wiaaa-aaaah-abwpa-cai', // ? KYC_CANISTER_ID
    // yumi_gallery: string; // ? GALLERY_CANISTER_ID
};

// * 预发布环境
const canisters_staging: SpecialCanisters = {
    yumi_core: 'pfsjt-fqaaa-aaaap-aaapq-cai', // ? SHIKU_CANISTER_ID
    yumi_credit_points: 'k52eo-fyaaa-aaaag-qagha-cai', // ? POINT_CANISTER_ID
    yumi_artist_router: 'st74o-biaaa-aaaah-abcoa-cai', // ? ARTIST_ROUTER_CANISTER_ID
    yumi_user_record: 'd4uvm-2iaaa-aaaap-aakrq-cai', // ? NEW_RECORD_CANISTER_ID
    yumi_origyn_art: 'owysw-uiaaa-aaaap-aamga-cai', // ? ORIGYN_YUMI_CANISTER_ID
    yumi_origyn_art_proposal: 'pm6jg-zqaaa-aaaah-adn5a-cai',
    yumi_ccc_proxy: 'porhv-2iaaa-aaaap-aamca-cai', // ? CCC_PROXY_CANISTER_ID
    yumi_launchpad: '4aatc-iyaaa-aaaao-aabsa-cai', // ? LAUNCHPAD_CANISTER_ID
    yumi_application: 'cxgiz-nyaaa-aaaah-abg6q-cai', // ? APPLY_CANISTER_ID
    yumi_oat: 'xbgld-rqaaa-aaaah-abcqq-cai', // ? OAT_CANISTER_ID
    yumi_shiku_lands: '3j32q-6iaaa-aaaap-aaijq-cai', // ? LANDS_CANISTER_ID
    yumi_jwt_token: 'rsyqn-haaaa-aaaah-adpsa-cai',

    // yumi_kyc: 'ucs6g-wiaaa-aaaah-abwpa-cai', // ? KYC_CANISTER_ID
    // yumi_gallery: string; // ? GALLERY_CANISTER_ID
};

// ? 测试环境
const canisters_test: SpecialCanisters = {
    yumi_core: 'ajy76-hiaaa-aaaah-aa3mq-cai', // ? SHIKU_CANISTER_ID
    yumi_credit_points: 'l2pzh-6iaaa-aaaah-abhpq-cai', // ? POINT_CANISTER_ID
    yumi_artist_router: 'v32d7-paaaa-aaaah-abc7q-cai', // ? ARTIST_ROUTER_CANISTER_ID
    yumi_user_record: 'sgynd-aaaaa-aaaah-abcnq-cai', // ? NEW_RECORD_CANISTER_ID
    yumi_origyn_art: 'patk5-byaaa-aaaap-aamda-cai', // ? ORIGYN_YUMI_CANISTER_ID
    yumi_origyn_art_proposal: 'pm6jg-zqaaa-aaaah-adn5a-cai',
    yumi_ccc_proxy: 'tut64-gqaaa-aaaah-ab2qq-cai', // ? CCC_PROXY_CANISTER_ID
    yumi_launchpad: 'o2qzt-caaaa-aaaah-abhsa-cai', // ? LAUNCHPAD_CANISTER_ID
    yumi_application: 'qhbz2-eiaaa-aaaah-abcaa-cai', // ? APPLY_CANISTER_ID
    yumi_oat: 'xlsz5-7aaaa-aaaah-abfma-cai', // ? OAT_CANISTER_ID
    yumi_shiku_lands: 'vpkok-7aaaa-aaaah-abjna-cai', // ? LANDS_CANISTER_ID
    yumi_jwt_token: 'rsyqn-haaaa-aaaah-adpsa-cai',

    // yumi_kyc: 'uftys-3qaaa-aaaah-abwpq-cai', // ? KYC_CANISTER_ID
    // yumi_gallery: string; // ? GALLERY_CANISTER_ID
};

const checkText = (canisters: SpecialCanisters, mode: SupportedBackend) => {
    for (const key in canisters) {
        let canister_id = canisters[key];
        if (key.startsWith('ledger')) canister_id = canister_id.canister_id;
        if (!isCanisterIdText(canister_id)) {
            throw new Error(`special canisters error: ${mode} => ${key} => ${canister_id}`);
        }
    }
};

checkText(canisters_production, 'production');
checkText(canisters_staging, 'staging');
checkText(canisters_test, 'test');

export const findSpecialCanisters = (
    mode: BuildMode,
    backendType: SupportedBackend,
): SpecialCanisters => {
    if (mode === 'production') return canisters_production;
    if (mode === 'staging') return canisters_staging;
    if (mode === 'test') return canisters_test;

    // 开发构建可以自由配置选择后端
    switch (backendType) {
        case 'production':
            return canisters_production;
        case 'staging':
            return canisters_staging;
        case 'test':
            return canisters_test;
    }
    throw new Error(`can not find special canisters: ${backendType}`);
};

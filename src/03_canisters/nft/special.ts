import { parse_nft_identifier } from '@/02_common/nft/ext';

export const NFT_ICNAMING = [
    'ft6xr-taaaa-aaaam-aafmq-cai', // 正式环境
    'ecujo-liaaa-aaaam-aafja-cai', // ? 测试环境
];

export const NFT_CCC = [
    'bjcsj-rqaaa-aaaah-qcxqq-cai', // ! 正式环境
    'ml2cx-yqaaa-aaaah-qc2xq-cai', // ! 正式环境
    'o7ehd-5qaaa-aaaah-qc2zq-cai', // ! 正式环境
    'nusra-3iaaa-aaaah-qc2ta-cai', // ! 正式环境 DMail
];

// ! entrepot有的标准没有实现 approve 方法, 因此也要仿照 ccc 标准走代理
export const NFT_EXT_WITHOUT_APPROVE = [
    '7h4ue-aqaaa-aaaai-qpbaq-cai', // ! Test 测试 NFT, 是 ext 标准, 这里当做 ccc 来测试进行交易

    'pk6rk-6aaaa-aaaae-qaazq-cai', // BTC Flower
    'bzsui-sqaaa-aaaah-qce2a-cai', // Poked Bots
    // 'oeee4-qaaaa-aaaak-qaaeq-cai', // Motoko Ghosts // ! 罐子有问题
    'dhiaa-ryaaa-aaaae-qabva-cai', // ETH Flower
    'skjpp-haaaa-aaaae-qac7q-cai', // Pineapple Punks
    'rw623-hyaaa-aaaah-qctcq-cai', // OG MEDALS
    'bxdf4-baaaa-aaaah-qaruq-cai', // ICPunks

    'llf4i-riaaa-aaaag-qb4cq-cai', // Bear Pals // 测试

    'nf35t-jqaaa-aaaag-qbp4q-cai', // Pixamers: Dark Earth /** Cspell: disable-line */
];

// origyn art
export const NFT_OGY_ART = [
    '2htsr-ziaaa-aaaaj-azrkq-cai', // ! 正式环境 一级
    '2oqzn-paaaa-aaaaj-azrla-cai', // ! 正式环境 二级
    '3d65d-aiaaa-aaaaj-azrmq-cai', // * 预发布环境 一级
    '3e73x-nqaaa-aaaaj-azrma-cai', // * 预发布环境 二级
    'zkpdr-hqaaa-aaaak-ac4lq-cai', // ? 测试环境 一级
    'lcaww-uyaaa-aaaag-aaylq-cai', // ? 测试环境 二级
];

// ============== 黄金罐子 ==============

export const NFT_OGY_GOLD_PRODUCTION = [
    'io7gn-vyaaa-aaaak-qcbiq-cai', // ! 正式环境
    'sy3ra-iqaaa-aaaao-aixda-cai', // ! 正式环境
    'zhfjc-liaaa-aaaal-acgja-cai', // ! 正式环境
    '7i7jl-6qaaa-aaaam-abjma-cai', // ! 正式环境
];

export const NFT_OGY_GOLD_STAGING = [
    'io7gn-vyaaa-aaaak-qcbiq-cai', // * 预发布环境 和正式环境相同
    'sy3ra-iqaaa-aaaao-aixda-cai', // * 预发布环境 和正式环境相同
    'zhfjc-liaaa-aaaal-acgja-cai', // * 预发布环境 和正式环境相同
    '7i7jl-6qaaa-aaaam-abjma-cai', // * 预发布环境 和正式环境相同
];

export const NFT_OGY_GOLD_TEST = [
    'io7gn-vyaaa-aaaak-qcbiq-cai', // ? 测试环境 和正式环境相同
    'himny-aiaaa-aaaak-aepca-cai', // ? 测试环境
    'yf3vu-uqaaa-aaaam-abfra-cai', // ? 测试环境
    '7i7jl-6qaaa-aaaam-abjma-cai', // ? 测试环境 和正式环境相同
];

// ogy gold
export const NFT_OGY_GOLD = [
    ...NFT_OGY_GOLD_PRODUCTION,
    ...NFT_OGY_GOLD_STAGING,
    ...NFT_OGY_GOLD_TEST,
];

export const NFT_OGY_BUTTERFLY = [
    'j2zek-uqaaa-aaaal-acoxa-cai', // ! 正式环境
    's5eo5-gqaaa-aaaag-qa3za-cai', // ! 正式环境
    '2l7gd-5aaaa-aaaak-qcfvq-cai', // ? 测试环境
];

export const NFT_OGY = [
    ...NFT_OGY_BUTTERFLY,
    // origyn art
    ...NFT_OGY_ART,
    // ogy gold
    ...NFT_OGY_GOLD_PRODUCTION,
    ...NFT_OGY_GOLD_STAGING,
    ...NFT_OGY_GOLD_TEST,
];

export const NFT_SHIKU_LAND = [
    '3j32q-6iaaa-aaaap-aaijq-cai', // ! 正式环境
    'vpkok-7aaaa-aaaah-abjna-cai', // ? 测试环境
];

// * 3sxmo-naaaa-aaaao-aakqa-cai 预发布环境的，被删除了，8 year gang ext魔改
// * m5vur-6qaaa-aaaap-aalxa-cai 预发布环境的，不是 NFT 罐子

// =========================== 有的罐子已经不支持了，需要过滤一下 ===========================

const NOT_SUPPORTED_CANISTER = [
    'xzrh4-zyaaa-aaaaj-qagaa-cai', // ! nft gaga 罐子，已经移除
];

export const filterNotSupportedTokenIdentifier = (token_identifier: string): boolean => {
    const token_id = parse_nft_identifier(token_identifier);
    if (NOT_SUPPORTED_CANISTER.includes(token_id.collection)) {
        return false;
    }
    return true;
};

export const filterOgyTokenIdentifier = (token_identifier: string): boolean => {
    const token_id = parse_nft_identifier(token_identifier);
    if (NFT_OGY.includes(token_id.collection)) {
        return false;
    }
    return true;
};

import { SupportedBackend } from '@/01_types/app';
import { isCanisterIdText } from '@/02_common/ic/principals';
import { BuildMode } from '@/vite-env';

type LedgerCanister = {
    canister_id: string;
    decimals: number;
    fee: string; // 转账费用
};

export type SpecialCanisters = {
    // 账本罐子
    ledger_icp: LedgerCanister; // LEDGER_CANISTER_ID
    ledger_ogy: LedgerCanister; // OGY_Balance
};

const canisters_production: SpecialCanisters = {
    // 账本罐子
    ledger_icp: {
        canister_id: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
        decimals: 8,
        fee: '10000',
    }, //! ICP 罐子 // LEDGER_CANISTER_ID
    ledger_ogy: {
        canister_id: 'jwcfb-hyaaa-aaaaj-aac4q-cai',
        decimals: 8,
        fee: '200000',
    }, //! OGY 罐子 // OGY_Balance
};

const canisters_staging: SpecialCanisters = {
    // 账本罐子
    ledger_icp: {
        canister_id: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
        decimals: 8,
        fee: '10000',
    }, //! ICP 罐子 // LEDGER_CANISTER_ID
    ledger_ogy: {
        canister_id: 'jwcfb-hyaaa-aaaaj-aac4q-cai',
        decimals: 8,
        fee: '200000',
    }, //! OGY 罐子 // OGY_Balance
};

const canisters_test: SpecialCanisters = {
    // 账本罐子
    ledger_icp: {
        canister_id: 'irzpe-yqaaa-aaaah-abhfa-cai',
        decimals: 8,
        fee: '10000',
    }, // * 自己部署的测试罐子 // LEDGER_CANISTER_ID
    ledger_ogy: {
        canister_id: 'jwcfb-hyaaa-aaaaj-aac4q-cai',
        decimals: 8,
        fee: '200000',
    }, //! OGY 罐子 // OGY_Balance
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

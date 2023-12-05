import { SupportedLedgerTokenSymbol } from '@/01_types/canisters/ledgers';
import { TokenInfo } from '@/01_types/nft';
import { findSpecialCanisters, SpecialCanisters } from '@/03_canisters/ledgers/special';
import { getBackendType } from '../../app/backend';
import { getBuildMode } from '../../app/env';

const findCanisters = (): SpecialCanisters =>
    findSpecialCanisters(getBuildMode(), getBackendType());

export const getLedgerIcpCanisterId = (): string => findCanisters().ledger_icp.canister_id;
export const getLedgerIcpDecimals = (): number => findCanisters().ledger_icp.decimals;
export const getLedgerIcpFee = (): string => findCanisters().ledger_icp.fee;
export const getLedgerOgyCanisterId = (): string => findCanisters().ledger_ogy.canister_id;
export const getLedgerOgyDecimals = (): number => findCanisters().ledger_ogy.decimals;
export const getLedgerOgyFee = (): string => findCanisters().ledger_ogy.fee;

export const getLedgerTokenIcp = (): TokenInfo => ({
    symbol: 'ICP',
    canister: getLedgerIcpCanisterId(),
    standard: { type: 'Ledger' },
    decimals: `${getLedgerIcpDecimals()}`,
    fee: getLedgerIcpFee(),
});
export const getLedgerTokenOgy = (): TokenInfo => ({
    symbol: 'OGY',
    canister: getLedgerOgyCanisterId(),
    standard: { type: 'Ledger' },
    decimals: `${getLedgerOgyDecimals()}`,
    fee: getLedgerOgyFee(),
});

// 获取代币精度
export const getTokenDecimals = (symbol?: SupportedLedgerTokenSymbol): number => {
    switch (symbol) {
        case 'ICP':
            return getLedgerIcpDecimals();
        case 'OGY':
            return getLedgerOgyDecimals();
        default:
            return 8;
    }
};

// 获取代币手续费
export const getTokenFee = (symbol: SupportedLedgerTokenSymbol): string => {
    switch (symbol) {
        case 'ICP':
            return getLedgerIcpFee();
        case 'OGY':
            return getLedgerOgyFee();
        default:
            return '0';
    }
};

import { shallow } from 'zustand/shallow';
import { SupportedLedgerTokenSymbol } from '@/01_types/canisters/ledgers';
import { useIdentityStore } from '@/07_stores/identity';

// 返回 balance 带精度
export const useTokenBalance = (symbol: SupportedLedgerTokenSymbol): string => {
    const { icpBalance, ogyBalance } = useIdentityStore(
        (s) => ({
            icpBalance: s.icpBalance,
            ogyBalance: s.ogyBalance,
        }),
        shallow,
    );
    switch (symbol) {
        case 'ICP':
            return icpBalance ? icpBalance.e8s : '0';
        case 'OGY':
            return ogyBalance ? ogyBalance.e8s : '0';
        default:
            return '0';
    }
};

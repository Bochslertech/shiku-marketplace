import { LedgerTokenBalance } from '@/01_types/canisters/ledgers';
import { queryCreditPoints } from '@/03_canisters/yumi/yumi_credit_points';
import { anonymous } from '../../connect/anonymous';
import { getYumiCreditPointsCanisterId } from './special';

export const queryCreditPointsByPrincipal = async (
    principal: string,
): Promise<LedgerTokenBalance> => {
    const backend_canister_id = getYumiCreditPointsCanisterId();
    return queryCreditPoints(anonymous, backend_canister_id, {
        type: 'principal',
        principal,
    });
};

export const queryCreditPointsByAccount = async (account: string): Promise<LedgerTokenBalance> => {
    const backend_canister_id = getYumiCreditPointsCanisterId();
    return queryCreditPoints(anonymous, backend_canister_id, { type: 'address', account });
};

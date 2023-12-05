import * as ogy from '@/03_canisters/ledgers/ledger_ogy';
import { LedgerTokenBalance, LedgerTransferArgs } from '@/01_types/canisters/ledgers';
import { ConnectedIdentity } from '@/01_types/identity';
import { anonymous } from '../../connect/anonymous';
import { getLedgerOgyCanisterId } from './special';

// ================= 查询余额 =================

export const ogyAccountBalance = async (account: string): Promise<LedgerTokenBalance> => {
    const backend_canister_id = getLedgerOgyCanisterId();
    return ogy.ogyLedgerAccountBalance(anonymous, backend_canister_id, account);
};

// ================= 进行转账 =================

export const ogyTransfer = async (
    identity: ConnectedIdentity,
    args: LedgerTransferArgs,
): Promise<string> => {
    const backend_canister_id = getLedgerOgyCanisterId();
    return ogy.ogyTransfer(identity, backend_canister_id, args);
};

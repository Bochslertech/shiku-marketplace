import * as icp from '@/03_canisters/ledgers/ledger_icp';
import { LedgerTokenBalance, LedgerTransferArgs } from '@/01_types/canisters/ledgers';
import { ConnectedIdentity } from '@/01_types/identity';
import { anonymous } from '../../connect/anonymous';
import { getLedgerIcpCanisterId } from './special';

// ================= 查询余额 =================

export const icpAccountBalance = async (account: string): Promise<LedgerTokenBalance> => {
    const backend_canister_id = getLedgerIcpCanisterId();
    return icp.icpLedgerAccountBalance(anonymous, backend_canister_id, account);
};

// ================= 进行转账 =================

export const icpTransfer = async (
    identity: ConnectedIdentity,
    args: LedgerTransferArgs,
): Promise<string> => {
    const backend_canister_id = getLedgerIcpCanisterId();
    return icp.icpTransfer(identity, backend_canister_id, args);
};

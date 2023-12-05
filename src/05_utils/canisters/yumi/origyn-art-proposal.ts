import * as origyn_art_proposal from '@/03_canisters/yumi/yumi_origyn_art_proposal';
import { ConnectedIdentity } from '@/01_types/identity';
import {
    ProposalInfo,
    ProposalSnapshot,
    ProposalStatus,
    ProposalVoteRecord,
} from '@/03_canisters/yumi/yumi_origyn_art_proposal';
import { anonymous } from '../../connect/anonymous';
import { getYumiOrigynArtProposalCanisterId } from './special';

// =========================== 查询下个提案 id ===========================

export const queryNextProposalId = async (): Promise<string> => {
    const backend_canister_id = getYumiOrigynArtProposalCanisterId();
    return origyn_art_proposal.queryNextProposalId(anonymous, backend_canister_id);
};

// =========================== 查询指定提案的详细信息 ===========================

export const queryProposalInfo = async (proposal_id: string): Promise<ProposalInfo | undefined> => {
    const backend_canister_id = getYumiOrigynArtProposalCanisterId();
    return origyn_art_proposal.queryProposalInfo(anonymous, backend_canister_id, proposal_id);
};

// =========================== 查询指定提案的快照 ===========================

export const queryProposalSnapshot = async (
    proposal_id: string,
): Promise<ProposalSnapshot | undefined> => {
    const backend_canister_id = getYumiOrigynArtProposalCanisterId();
    return origyn_art_proposal.queryProposalSnapshot(anonymous, backend_canister_id, proposal_id);
};

// =========================== 查询指定提案的投票记录 ===========================

export const queryProposalVoteRecords = async (
    proposal_id: string,
): Promise<ProposalVoteRecord[] | undefined> => {
    const backend_canister_id = getYumiOrigynArtProposalCanisterId();
    return origyn_art_proposal.queryProposalVoteRecords(
        anonymous,
        backend_canister_id,
        proposal_id,
    );
};

// =========================== 进行投票 ===========================

export const voteProposal = async (
    identity: ConnectedIdentity,
    args: {
        proposal_id: string; // ? bigint -> string
        option_id: string; // ? bigint -> string
        vote: 'yes' | 'no';
    },
): Promise<ProposalStatus> => {
    const backend_canister_id = getYumiOrigynArtProposalCanisterId();
    return origyn_art_proposal.voteProposal(identity, backend_canister_id, args);
};

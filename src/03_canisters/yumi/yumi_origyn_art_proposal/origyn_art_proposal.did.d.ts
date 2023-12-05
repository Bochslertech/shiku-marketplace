import type { Principal } from '@dfinity/principal';

// export interface Account {
//     owner: Principal;
// }
// export interface BasicDaoStableStorage {
//     accounts: Array<Account>;
// }
export type List = [] | [[VoteRecord, List]];
export type List_1 = [] | [[Principal, List_1]];
export interface NFT {
    canister_id: Principal;
    standard: NFTStandard;
}
export type NFTStandard = { ogy: null };
export interface OptProposalResponse {
    proposal: Proposal;
    options: Array<ProposalOption>;
}
export interface Proposal {
    id: bigint;
    title: string;
    end_timestamp: Time;
    vote_nft: NFT;
    start_timestamp: Time;
    vote_rate: bigint;
    state: ProposalState;
    details: Array<number>;
    proposer: Principal;
    options: Array<bigint>;
    payload: [] | [ProposalPayload];
}
// export interface ProposalCreate {
//     title: string;
//     end_timestamp: Time;
//     vote_nft: NFT;
//     start_timestamp: Time;
//     vote_rate: bigint;
//     option_contents: Array<string>;
//     details: Array<number>;
//     payload: [] | [ProposalPayload];
// }
export interface ProposalOption {
    id: bigint;
    content: string;
    votes: bigint;
    voters: List_1;
    proposal_id: bigint;
}
export interface ProposalPayload {
    method: string;
    canister_id: Principal;
    message: Array<number>;
}
// export interface ProposalResponse {
//     proposal: [] | [Proposal];
//     options: Array<[] | [ProposalOption]>;
// }
export interface ProposalSnapshot {
    accounts: Array<SnapshotAccount>;
    proposal_id: bigint;
    snapshot_at: Time;
}
export type ProposalState =
    | { open: null }
    | { rejected: null }
    | { executing: null }
    | { accepted: null }
    | { failed: string }
    | { succeeded: null };
export type Result = { ok: ProposalState } | { err: string };
// export type Result_1 = { ok: bigint } | { err: string };
// export type Result_2 = { ok: Principal } | { err: string };
export interface SnapshotAccount {
    owner: Principal;
    amount: bigint;
}
// export interface SnapshotArgs {
//     account: Principal;
//     votes_count: bigint;
// }
export type Time = bigint;
export type Vote = { no: null } | { yes: null };
export interface VoteArgs {
    vote: Vote;
    proposal_id: bigint;
    proposal_opt_id: bigint;
}
export interface VoteRecord {
    voter: Principal;
    count: bigint;
    option_id: bigint;
    vote_at: bigint;
    proposal_id: bigint;
}
export default interface _SERVICE {
    // account_nft_balance: (arg_0: NFT) => Promise<bigint>;
    // add_account: (arg_0: Principal) => Promise<Result_2>;
    // getOwner: () => Promise<Principal>;
    // get_next_option_id: () => Promise<bigint>;
    get_next_proposal_id: () => Promise<bigint>;
    get_opt_proposal_detail: (arg_0: bigint) => Promise<[] | [OptProposalResponse]>;
    // get_proposal: (arg_0: bigint) => Promise<[] | [Proposal]>;
    // get_proposal_detail: (arg_0: bigint) => Promise<ProposalResponse>;
    // get_proposal_option: (arg_0: bigint) => Promise<[] | [ProposalOption]>;
    get_snapshot: (arg_0: bigint) => Promise<[] | [ProposalSnapshot]>;
    get_vote_logger: (arg_0: bigint) => Promise<[] | [List]>;
    // list_accounts: () => Promise<Array<Principal>>;
    // list_proposals: () => Promise<Array<Proposal>>;
    // remove_account: (arg_0: Principal) => Promise<Result_2>;
    // setOwner: (arg_0: Principal) => Promise<undefined>;
    // snapshot: (arg_0: bigint, arg_1: Array<SnapshotArgs>) => Promise<Result_1>;
    // submit_proposal: (arg_0: ProposalCreate) => Promise<Result_1>;
    // update_proposal: (arg_0: bigint, arg_1: ProposalCreate) => Promise<Result_1>;
    vote: (arg_0: VoteArgs) => Promise<Result>;
}

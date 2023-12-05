export default ({ IDL }) => {
    const List = IDL.Rec();
    const List_1 = IDL.Rec();
    const NFTStandard = IDL.Variant({ ogy: IDL.Null });
    const NFT = IDL.Record({
        canister_id: IDL.Principal,
        standard: NFTStandard,
    });
    // const Result_2 = IDL.Variant({ ok: IDL.Principal, err: IDL.Text });
    const Time = IDL.Int;
    const ProposalState = IDL.Variant({
        open: IDL.Null,
        rejected: IDL.Null,
        executing: IDL.Null,
        accepted: IDL.Null,
        failed: IDL.Text,
        succeeded: IDL.Null,
    });
    const ProposalPayload = IDL.Record({
        method: IDL.Text,
        canister_id: IDL.Principal,
        message: IDL.Vec(IDL.Nat8),
    });
    const Proposal = IDL.Record({
        id: IDL.Nat,
        title: IDL.Text,
        end_timestamp: Time,
        vote_nft: NFT,
        start_timestamp: Time,
        vote_rate: IDL.Nat,
        state: ProposalState,
        details: IDL.Vec(IDL.Nat8),
        proposer: IDL.Principal,
        options: IDL.Vec(IDL.Nat),
        payload: IDL.Opt(ProposalPayload),
    });
    List_1.fill(IDL.Opt(IDL.Tuple(IDL.Principal, List_1)));
    const ProposalOption = IDL.Record({
        id: IDL.Nat,
        content: IDL.Text,
        votes: IDL.Nat,
        voters: List_1,
        proposal_id: IDL.Nat,
    });
    const OptProposalResponse = IDL.Record({
        proposal: Proposal,
        options: IDL.Vec(ProposalOption),
    });
    // const ProposalResponse = IDL.Record({
    //     proposal: IDL.Opt(Proposal),
    //     options: IDL.Vec(IDL.Opt(ProposalOption)),
    // });
    const SnapshotAccount = IDL.Record({
        owner: IDL.Principal,
        amount: IDL.Nat,
    });
    const ProposalSnapshot = IDL.Record({
        accounts: IDL.Vec(SnapshotAccount),
        proposal_id: IDL.Nat,
        snapshot_at: Time,
    });
    const VoteRecord = IDL.Record({
        voter: IDL.Principal,
        count: IDL.Int,
        option_id: IDL.Nat,
        vote_at: IDL.Int,
        proposal_id: IDL.Nat,
    });
    List.fill(IDL.Opt(IDL.Tuple(VoteRecord, List)));
    // const SnapshotArgs = IDL.Record({
    //     account: IDL.Principal,
    //     votes_count: IDL.Nat,
    // });
    // const Result_1 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
    // const ProposalCreate = IDL.Record({
    //     title: IDL.Text,
    //     end_timestamp: Time,
    //     vote_nft: NFT,
    //     start_timestamp: Time,
    //     vote_rate: IDL.Nat,
    //     option_contents: IDL.Vec(IDL.Text),
    //     details: IDL.Vec(IDL.Nat8),
    //     payload: IDL.Opt(ProposalPayload),
    // });
    const Vote = IDL.Variant({ no: IDL.Null, yes: IDL.Null });
    const VoteArgs = IDL.Record({
        vote: Vote,
        proposal_id: IDL.Nat,
        proposal_opt_id: IDL.Nat,
    });
    const Result = IDL.Variant({ ok: ProposalState, err: IDL.Text });
    return IDL.Service({
        // account_nft_balance: IDL.Func([NFT], [IDL.Nat], []),
        // add_account: IDL.Func([IDL.Principal], [Result_2], []),
        // getOwner: IDL.Func([], [IDL.Principal], ['query']),
        // get_next_option_id: IDL.Func([], [IDL.Nat], ['query']),
        get_next_proposal_id: IDL.Func([], [IDL.Nat], ['query']),
        get_opt_proposal_detail: IDL.Func([IDL.Nat], [IDL.Opt(OptProposalResponse)], ['query']),
        // get_proposal: IDL.Func([IDL.Nat], [IDL.Opt(Proposal)], ['query']),
        // get_proposal_detail: IDL.Func([IDL.Nat], [ProposalResponse], ['query']),
        // get_proposal_option: IDL.Func([IDL.Nat], [IDL.Opt(ProposalOption)], ['query']),
        get_snapshot: IDL.Func([IDL.Nat], [IDL.Opt(ProposalSnapshot)], ['query']),
        get_vote_logger: IDL.Func([IDL.Nat], [IDL.Opt(List)], ['query']),
        // list_accounts: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // list_proposals: IDL.Func([], [IDL.Vec(Proposal)], ['query']),
        // remove_account: IDL.Func([IDL.Principal], [Result_2], []),
        // setOwner: IDL.Func([IDL.Principal], [], []),
        // snapshot: IDL.Func([IDL.Nat, IDL.Vec(SnapshotArgs)], [Result_1], []),
        // submit_proposal: IDL.Func([ProposalCreate], [Result_1], []),
        // update_proposal: IDL.Func([IDL.Nat, ProposalCreate], [Result_1], []),
        vote: IDL.Func([VoteArgs], [Result], []),
    });
};

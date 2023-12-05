export default ({ IDL }) => {
    // const NFTOwnable = IDL.Rec();
    const ExtUser = IDL.Variant({
        principal: IDL.Principal,
        address: IDL.Text,
    });
    const ExtAllowanceArgs = IDL.Record({
        token: IDL.Text,
        owner: ExtUser,
        spender: IDL.Principal,
    });
    const ExtCommonError = IDL.Variant({
        InvalidToken: IDL.Text,
        Other: IDL.Text,
    });
    const MotokoResult = IDL.Variant({ ok: IDL.Nat, err: ExtCommonError });
    const ExtApproveArgs = IDL.Record({
        token: IDL.Text,
        subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        allowance: IDL.Nat,
        spender: IDL.Principal,
    });
    // const ExtBalanceArgs = IDL.Record({ token: IDL.Text, user: ExtUser });
    // const ExtBatchError = IDL.Variant({ Error: IDL.Text });
    // const MotokoResult_1 = IDL.Variant({
    //     ok: IDL.Vec(MotokoResult),
    //     err: ExtBatchError,
    // });
    const ExtTransferArgs = IDL.Record({
        to: ExtUser,
        token: IDL.Text,
        notify: IDL.Bool,
        from: ExtUser,
        memo: IDL.Vec(IDL.Nat8),
        subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        amount: IDL.Nat,
    });
    const ExtTransferError = IDL.Variant({
        CannotNotify: IDL.Text,
        InsufficientBalance: IDL.Null,
        InvalidToken: IDL.Text,
        Rejected: IDL.Null,
        Unauthorized: IDL.Text,
        Other: IDL.Text,
    });
    const MotokoResult_2 = IDL.Variant({
        ok: IDL.Nat,
        err: ExtTransferError,
    });
    const MotokoResult_3 = IDL.Variant({
        ok: IDL.Text,
        err: ExtCommonError,
    });
    // const CanisterStatusType = IDL.Variant({
    //     stopped: IDL.Null,
    //     stopping: IDL.Null,
    //     running: IDL.Null,
    // });
    // const DefiniteCanisterSettings = IDL.Record({
    //     freezing_threshold: IDL.Nat,
    //     controllers: IDL.Vec(IDL.Principal),
    //     memory_allocation: IDL.Nat,
    //     compute_allocation: IDL.Nat,
    // });
    // const CanisterStatusResponse = IDL.Record({
    //     status: CanisterStatusType,
    //     memory_size: IDL.Nat,
    //     cycles: IDL.Nat,
    //     settings: DefiniteCanisterSettings,
    //     idle_cycles_burned_per_day: IDL.Nat,
    //     module_hash: IDL.Opt(IDL.Vec(IDL.Nat8)),
    // });
    const ExtTokenMetadata = IDL.Variant({
        fungible: IDL.Record({
            decimals: IDL.Nat8,
            metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
            name: IDL.Text,
            symbol: IDL.Text,
        }),
        nonfungible: IDL.Record({ metadata: IDL.Opt(IDL.Vec(IDL.Nat8)) }),
    });
    // const CustomHttpRequest = IDL.Record({
    //     url: IDL.Text,
    //     method: IDL.Text,
    //     body: IDL.Vec(IDL.Nat8),
    //     headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    // });
    // const CustomHttpResponse = IDL.Record({
    //     body: IDL.Vec(IDL.Nat8),
    //     headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    //     status_code: IDL.Nat16,
    // });
    const MotokoResult_4 = IDL.Variant({
        ok: ExtTokenMetadata,
        err: ExtCommonError,
    });
    // const ExtMintArgs = IDL.Record({
    //     to: ExtUser,
    //     metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
    // });
    // const NftView = IDL.Record({
    //     owner: IDL.Text,
    //     name: IDL.Text,
    //     approved: IDL.Opt(IDL.Text),
    // });
    // const InnerData = IDL.Record({
    //     data: IDL.Vec(IDL.Nat8),
    //     headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    // });
    // const OuterData = IDL.Record({
    //     url: IDL.Text,
    //     headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    // });
    // const MediaData = IDL.Variant({ Inner: InnerData, Outer: OuterData });
    // const LimitDuration = IDL.Record({ end: IDL.Nat64, start: IDL.Nat64 });
    // NFTOwnable.fill(
    //     IDL.Variant({
    //         Data: IDL.Vec(IDL.Nat8),
    //         List: IDL.Vec(NFTOwnable),
    //         None: IDL.Null,
    //         Text: IDL.Text,
    //         Media: MediaData,
    //     }),
    // );
    // const NftTicketStatus = IDL.Variant({
    //     Anonymous: IDL.Tuple(IDL.Nat64, NFTOwnable),
    //     NoBody: IDL.Nat64,
    //     InvalidToken: IDL.Null,
    //     Owner: IDL.Tuple(IDL.Nat64, NFTOwnable),
    //     Forbidden: IDL.Nat64,
    // });
    // const MotokoResult_5 = IDL.Variant({
    //     ok: IDL.Vec(IDL.Nat32),
    //     err: ExtCommonError,
    // });
    const ExtListing = IDL.Record({
        locked: IDL.Opt(IDL.Int),
        seller: IDL.Principal,
        price: IDL.Nat64,
    });
    const MotokoResult_6 = IDL.Variant({
        ok: IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Opt(ExtListing), IDL.Opt(IDL.Vec(IDL.Nat8)))),
        err: ExtCommonError,
    });
    // const MotokoResult_7 = IDL.Variant({
    //     ok: IDL.Vec(MotokoResult_2),
    //     err: ExtBatchError,
    // });
    // const WalletReceiveResult = IDL.Record({ accepted: IDL.Nat64 });
    return IDL.Service({
        // __get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ['query']),
        allowance: IDL.Func([ExtAllowanceArgs], [MotokoResult], ['query']),
        approve: IDL.Func([ExtApproveArgs], [IDL.Bool], []),
        // approveAll: IDL.Func([IDL.Vec(ExtApproveArgs)], [IDL.Vec(IDL.Nat32)], []),
        // balance: IDL.Func([ExtBalanceArgs], [MotokoResult], ['query']),
        // balance_batch: IDL.Func([IDL.Vec(ExtBalanceArgs)], [MotokoResult_1], ['query']),
        // batchTransfer: IDL.Func([IDL.Vec(ExtTransferArgs)], [IDL.Vec(MotokoResult_2)], []),
        bearer: IDL.Func([IDL.Text], [MotokoResult_3], ['query']),
        // calcTokenIdentifier: IDL.Func([IDL.Nat32], [IDL.Text], ['query']),
        // canister_status: IDL.Func([], [CanisterStatusResponse], []),
        // extensions: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
        // getAllowances: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Principal))], ['query']),
        // getMetadata: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat32, ExtTokenMetadata))], ['query']),
        getMinter: IDL.Func([], [IDL.Principal], ['query']),
        // getProperties: IDL.Func(
        //     [],
        //     [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))))],
        //     ['query'],
        // ),
        getRegistry: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Text))], ['query']),
        getScore: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Float64))], ['query']),
        getTokens: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat32, ExtTokenMetadata))], ['query']),
        getTokensByIds: IDL.Func(
            [IDL.Vec(IDL.Nat32)],
            [IDL.Vec(IDL.Tuple(IDL.Nat32, ExtTokenMetadata))],
            ['query'],
        ),
        // http_request: IDL.Func([CustomHttpRequest], [CustomHttpResponse], ['query']),
        // maintainable_is_maintaining: IDL.Func([], [IDL.Bool], ['query']),
        // maintainable_set_maintaining: IDL.Func([IDL.Bool], [], []),
        metadata: IDL.Func([IDL.Text], [MotokoResult_4], ['query']),
        // mintNFT: IDL.Func([ExtMintArgs], [], []),
        // nft_get_all_tokens: IDL.Func([], [IDL.Vec(NftView)], ['query']),
        // nft_get_metadata: IDL.Func([IDL.Text, IDL.Nat32], [IDL.Opt(MediaData)], ['query']),
        // nft_get_rarity: IDL.Func([IDL.Text], [IDL.Text], ['query']),
        // nft_info_get_name: IDL.Func([], [IDL.Text], ['query']),
        // nft_info_get_symbol: IDL.Func([], [IDL.Text], ['query']),
        // nft_info_set_logo: IDL.Func([IDL.Opt(MediaData)], [], []),
        // nft_info_set_maintaining: IDL.Func([IDL.Opt(MediaData)], [], []),
        // nft_info_set_name: IDL.Func([IDL.Text], [], []),
        // nft_info_set_symbol: IDL.Func([IDL.Text], [], []),
        // nft_info_set_thumbnail: IDL.Func([IDL.Opt(MediaData)], [], []),
        // nft_limit_minter_get: IDL.Func([], [IDL.Vec(LimitDuration)], ['query']),
        // nft_limit_minter_set: IDL.Func([IDL.Vec(LimitDuration)], [], []),
        // nft_mint_batch: IDL.Func([ExtMintArgs, IDL.Nat32, IDL.Nat32], [], []),
        // nft_set_content: IDL.Func(
        //     [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(IDL.Vec(IDL.Nat8))))],
        //     [],
        //     [],
        // ),
        // nft_set_content_by_token_index: IDL.Func(
        //     [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))))],
        //     [],
        //     [],
        // ),
        // nft_set_content_by_url_and_thumbnail: IDL.Func([IDL.Text, IDL.Text], [], []),
        // nft_set_metadata: IDL.Func(
        //     [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat32, IDL.Opt(MediaData)))],
        //     [],
        //     [],
        // ),
        // nft_set_metadata_by_token_index: IDL.Func(
        //     [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Nat32, IDL.Opt(MediaData)))],
        //     [],
        //     [],
        // ),
        // nft_set_ownable: IDL.Func([IDL.Text, NFTOwnable], [], []),
        // nft_set_ownable_by_token_index: IDL.Func([IDL.Nat32, NFTOwnable], [], []),
        // nft_set_rarity: IDL.Func([IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], [], []),
        // nft_set_rarity_by_token_index: IDL.Func([IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Text))], [], []),
        // nft_set_thumbnail: IDL.Func([IDL.Text, IDL.Opt(MediaData)], [], []),
        // nft_set_thumbnail_by_token_index: IDL.Func([IDL.Nat32, IDL.Opt(MediaData)], [], []),
        // nft_ticket: IDL.Func([IDL.Text], [NftTicketStatus], ['query']),
        // nft_ticket_get_activity: IDL.Func([], [IDL.Nat64, IDL.Nat64], ['query']),
        // nft_ticket_get_transfer_forbidden: IDL.Func([], [IDL.Vec(LimitDuration)], ['query']),
        // nft_ticket_set_activity: IDL.Func([IDL.Nat64, IDL.Nat64], [], []),
        // nft_ticket_set_transfer_forbidden: IDL.Func([IDL.Vec(LimitDuration)], [], []),
        // permission_get_admins: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // permission_get_minters: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // permission_is_admin: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
        // permission_is_minter: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
        // permission_remove_admin: IDL.Func([IDL.Principal], [], []),
        // permission_remove_minter: IDL.Func([IDL.Principal], [], []),
        // permission_set_admin: IDL.Func([IDL.Principal], [], []),
        // permission_set_minter: IDL.Func([IDL.Principal], [], []),
        // supply: IDL.Func([IDL.Text], [MotokoResult], ['query']),
        // toAddress: IDL.Func([IDL.Text, IDL.Nat], [IDL.Text], ['query']),
        // tokens: IDL.Func([IDL.Text], [MotokoResult_5], ['query']),
        tokens_ext: IDL.Func([IDL.Text], [MotokoResult_6], ['query']),
        transfer: IDL.Func([ExtTransferArgs], [MotokoResult_2], []),
        // transfer_batch: IDL.Func([IDL.Vec(ExtTransferArgs)], [MotokoResult_7], []),
        // upload_data_by_slice: IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
        // upload_data_by_slice_query: IDL.Func(
        //     [IDL.Nat32, IDL.Nat32],
        //     [IDL.Vec(IDL.Nat8)],
        //     ['query'],
        // ),
        // wallet_balance: IDL.Func([], [IDL.Nat], ['query']),
        // wallet_receive: IDL.Func([], [WalletReceiveResult], ['query']),
        // whoami: IDL.Func([], [IDL.Principal], []),
    });
};

export default ({ IDL }) => {
    const CandyShared = IDL.Rec();
    const CollectionMetadata = IDL.Record({
        artworkMedium: IDL.Text,
        artworkDescription: IDL.Text,
        media: IDL.Vec(IDL.Text),
        artworkList: IDL.Text,
        artworkSize: IDL.Text,
        authorPicture: IDL.Text,
        artworkDetails: IDL.Text,
        name: IDL.Text,
        description: IDL.Text,
        authorBirth: IDL.Text,
        coverImage: IDL.Text,
        copyright: IDL.Text,
        artAuthor: IDL.Text,
        authorProvenance: IDL.Text,
    });
    const PropertyShared = IDL.Record({
        value: CandyShared,
        name: IDL.Text,
        immutable: IDL.Bool,
    });
    CandyShared.fill(
        IDL.Variant({
            Int: IDL.Int,
            Map: IDL.Vec(IDL.Tuple(CandyShared, CandyShared)),
            Nat: IDL.Nat,
            Set: IDL.Vec(CandyShared),
            Nat16: IDL.Nat16,
            Nat32: IDL.Nat32,
            Nat64: IDL.Nat64,
            Blob: IDL.Vec(IDL.Nat8),
            Bool: IDL.Bool,
            Int8: IDL.Int8,
            Ints: IDL.Vec(IDL.Int),
            Nat8: IDL.Nat8,
            Nats: IDL.Vec(IDL.Nat),
            Text: IDL.Text,
            Bytes: IDL.Vec(IDL.Nat8),
            Int16: IDL.Int16,
            Int32: IDL.Int32,
            Int64: IDL.Int64,
            Option: IDL.Opt(CandyShared),
            Floats: IDL.Vec(IDL.Float64),
            Float: IDL.Float64,
            Principal: IDL.Principal,
            Array: IDL.Vec(CandyShared),
            Class: IDL.Vec(PropertyShared),
        }),
    );
    const ICTokenSpec__1 = IDL.Record({
        id: IDL.Opt(IDL.Nat),
        fee: IDL.Opt(IDL.Nat),
        decimals: IDL.Nat,
        canister: IDL.Principal,
        standard: IDL.Variant({
            ICRC1: IDL.Null,
            EXTFungible: IDL.Null,
            DIP20: IDL.Null,
            Other: CandyShared,
            Ledger: IDL.Null,
        }),
        symbol: IDL.Text,
    });
    const Time = IDL.Int;
    const PrimarySale = IDL.Record({
        fee: IDL.Record({ rate: IDL.Nat, precision: IDL.Nat }),
        egg_canister: IDL.Principal,
        token: ICTokenSpec__1,
        owner: IDL.Principal,
        end_time: Time,
        available: IDL.Nat,
        threshold_trade: IDL.Nat,
        start_time: Time,
        threshold_percentage: IDL.Nat,
        fraction_canister: IDL.Principal,
        unit_price: IDL.Nat,
        volumeTrade: IDL.Nat,
        total_supply: IDL.Nat,
    });
    // const Result_2 = IDL.Variant({ ok: IDL.Null, err: IDL.Text });
    const ICTokenSpec = IDL.Record({
        id: IDL.Opt(IDL.Nat),
        fee: IDL.Opt(IDL.Nat),
        decimals: IDL.Nat,
        canister: IDL.Principal,
        standard: IDL.Variant({
            ICRC1: IDL.Null,
            EXTFungible: IDL.Null,
            DIP20: IDL.Null,
            Other: CandyShared,
            Ledger: IDL.Null,
        }),
        symbol: IDL.Text,
    });
    // const Ogy_Token = IDL.Record({
    //     ogy_canister: IDL.Principal,
    //     token_id: IDL.Text,
    // });
    // const Errors = IDL.Variant({
    //     nyi: IDL.Null,
    //     storage_configuration_error: IDL.Null,
    //     escrow_withdraw_payment_failed: IDL.Null,
    //     token_not_found: IDL.Null,
    //     owner_not_found: IDL.Null,
    //     content_not_found: IDL.Null,
    //     auction_ended: IDL.Null,
    //     out_of_range: IDL.Null,
    //     sale_id_does_not_match: IDL.Null,
    //     sale_not_found: IDL.Null,
    //     item_not_owned: IDL.Null,
    //     property_not_found: IDL.Null,
    //     validate_trx_wrong_host: IDL.Null,
    //     withdraw_too_large: IDL.Null,
    //     content_not_deserializable: IDL.Null,
    //     bid_too_low: IDL.Null,
    //     nft_sale_not_start: IDL.Null,
    //     validate_deposit_wrong_amount: IDL.Null,
    //     existing_sale_found: IDL.Null,
    //     nft_sale_not_end: IDL.Null,
    //     asset_mismatch: IDL.Null,
    //     escrow_cannot_be_removed: IDL.Null,
    //     deposit_burned: IDL.Null,
    //     nft_sale_ended: IDL.Null,
    //     cannot_restage_minted_token: IDL.Null,
    //     nft_locked: IDL.Null,
    //     cannot_find_status_in_metadata: IDL.Null,
    //     receipt_data_mismatch: IDL.Null,
    //     validate_deposit_failed: IDL.Null,
    //     unreachable: IDL.Null,
    //     unauthorized_access: IDL.Null,
    //     item_already_minted: IDL.Null,
    //     no_escrow_found: IDL.Null,
    //     escrow_owner_not_the_owner: IDL.Null,
    //     improper_interface: IDL.Null,
    //     app_id_not_found: IDL.Null,
    //     token_non_transferable: IDL.Null,
    //     sale_not_over: IDL.Null,
    //     update_class_error: IDL.Null,
    //     malformed_metadata: IDL.Null,
    //     not_enough_nfts: IDL.Null,
    //     token_id_mismatch: IDL.Null,
    //     id_not_found_in_metadata: IDL.Null,
    //     auction_not_started: IDL.Null,
    //     library_not_found: IDL.Null,
    //     attempt_to_stage_system_data: IDL.Null,
    //     validate_deposit_wrong_buyer: IDL.Null,
    //     not_enough_storage: IDL.Null,
    //     sales_withdraw_payment_failed: IDL.Null,
    // });
    // const OrigynError = IDL.Record({
    //     text: IDL.Text,
    //     error: Errors,
    //     number: IDL.Nat32,
    //     flag_point: IDL.Text,
    // });
    // const Result_1 = IDL.Variant({ ok: Ogy_Token, err: OrigynError });
    // const GetLogMessagesFilter = IDL.Record({
    //     analyzeCount: IDL.Nat32,
    //     messageRegex: IDL.Opt(IDL.Text),
    //     messageContains: IDL.Opt(IDL.Text),
    // });
    // const Nanos = IDL.Nat64;
    // const GetLogMessagesParameters = IDL.Record({
    //     count: IDL.Nat32,
    //     filter: IDL.Opt(GetLogMessagesFilter),
    //     fromTimeNanos: IDL.Opt(Nanos),
    // });
    // const GetLatestLogMessagesParameters = IDL.Record({
    //     upToTimeNanos: IDL.Opt(Nanos),
    //     count: IDL.Nat32,
    //     filter: IDL.Opt(GetLogMessagesFilter),
    // });
    // const CanisterLogRequest = IDL.Variant({
    //     getMessagesInfo: IDL.Null,
    //     getMessages: GetLogMessagesParameters,
    //     getLatestMessages: GetLatestLogMessagesParameters,
    // });
    // const CanisterLogFeature = IDL.Variant({
    //     filterMessageByContains: IDL.Null,
    //     filterMessageByRegex: IDL.Null,
    // });
    // const CanisterLogMessagesInfo = IDL.Record({
    //     features: IDL.Vec(IDL.Opt(CanisterLogFeature)),
    //     lastTimeNanos: IDL.Opt(Nanos),
    //     count: IDL.Nat32,
    //     firstTimeNanos: IDL.Opt(Nanos),
    // });
    // const LogMessagesData = IDL.Record({
    //     timeNanos: Nanos,
    //     message: IDL.Text,
    // });
    // const CanisterLogMessages = IDL.Record({
    //     data: IDL.Vec(LogMessagesData),
    //     lastAnalyzedMessageTimeNanos: IDL.Opt(Nanos),
    // });
    // const CanisterLogResponse = IDL.Variant({
    //     messagesInfo: CanisterLogMessagesInfo,
    //     messages: CanisterLogMessages,
    // });
    // const AccountIdentifier__1 = IDL.Text;
    // const User = IDL.Variant({
    //     principal: IDL.Principal,
    //     address: AccountIdentifier__1,
    // });
    // const PointSale = IDL.Record({
    //     user: User,
    //     price: IDL.Nat64,
    //     retry: IDL.Nat64,
    // });
    // const AccountIdentifier = IDL.Text;
    // const TokenIdentifier = IDL.Text;
    // const RecordEventType = IDL.Variant({
    //     auctionDeal: IDL.Null,
    //     dutchAuction: IDL.Null,
    //     offer: IDL.Null,
    //     list: IDL.Null,
    //     claim: IDL.Null,
    //     mint: IDL.Null,
    //     sold: IDL.Null,
    //     acceptOffer: IDL.Null,
    //     point: IDL.Null,
    //     auction: IDL.Null,
    //     transfer: IDL.Null,
    // });
    // const RecordEventInit = IDL.Record({
    //     to: IDL.Opt(IDL.Principal),
    //     toAID: IDL.Opt(AccountIdentifier),
    //     collection: IDL.Principal,
    //     date: IDL.Int,
    //     from: IDL.Opt(IDL.Principal),
    //     item: TokenIdentifier,
    //     fromAID: IDL.Opt(AccountIdentifier),
    //     price: IDL.Opt(IDL.Nat64),
    //     eventType: RecordEventType,
    // });
    // const RecordSettle = IDL.Record({
    //     retry: IDL.Nat64,
    //     record: RecordEventInit,
    // });
    // const Result = IDL.Variant({ ok: IDL.Text, err: OrigynError });
    // const YumiPointFee = IDL.Record({
    //     creator: IDL.Principal,
    //     rate: IDL.Nat64,
    //     precision: IDL.Nat64,
    // });
    // const SettlePointResult = IDL.Variant({
    //     ok: IDL.Null,
    //     err: IDL.Variant({
    //         NoSettlePoint: IDL.Null,
    //         SettleErr: IDL.Null,
    //         RetryExceed: IDL.Null,
    //     }),
    // });
    // const SettleRecordResult = IDL.Variant({
    //     ok: IDL.Null,
    //     err: IDL.Variant({
    //         NoSettleRecord: IDL.Null,
    //         SettleErr: IDL.Null,
    //         RetryExceed: IDL.Null,
    //     }),
    // });
    return IDL.Service({
        // addCollectionMetadata: IDL.Func([IDL.Principal, CollectionMetadata], [], []),
        // addManager: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // addMintedNFT: IDL.Func([IDL.Principal, IDL.Vec(IDL.Text)], [], ['oneway']),
        // addOgyCanisters: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // addPointSettlementV: IDL.Func([IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat64))], [], []),
        // addPrimarySale: IDL.Func([PrimarySale], [Result_2], []),
        // addPrimarySaleBlock: IDL.Func([IDL.Principal, IDL.Bool], [], ['oneway']),
        // addSupportedTokens: IDL.Func([IDL.Vec(ICTokenSpec)], [], []),
        // addWhitelist: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // batchSettleRecord: IDL.Func([IDL.Vec(IDL.Nat)], [], []),
        // buy_primary_nft_origyn: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Vec(Result_1)], []),
        // delManager: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // delOgyCanisters: IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Vec(IDL.Principal)], []),
        // delPrimarySale: IDL.Func([IDL.Principal], [], []),
        // delwhitelist: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // flushPointSettlement: IDL.Func([], [], []),
        // flushRecordSettlement: IDL.Func([], [], []),
        // getCanisterLog: IDL.Func(
        //     [IDL.Opt(CanisterLogRequest)],
        //     [IDL.Opt(CanisterLogResponse)],
        //     ['query'],
        // ),
        // getManager: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // getOwner: IDL.Func([], [IDL.Principal], []),
        // getPointSettlements: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, PointSale))], ['query']),
        // getRecordSettlement: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, RecordSettle))], ['query']),
        // getStagedTokens: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Text)], []),
        // getrecordMarks: IDL.Func(
        //     [],
        //     [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))))],
        //     ['query'],
        // ),
        // getwhitelist: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // handleSecondPoint: IDL.Func([IDL.Principal], [], []),
        listCollections: IDL.Func(
            [],
            [IDL.Vec(IDL.Tuple(IDL.Principal, CollectionMetadata))],
            ['query'],
        ),
        // listMintedAndStaged: IDL.Func(
        //     [IDL.Principal],
        //     [
        //         IDL.Record({
        //             staged: IDL.Opt(IDL.Vec(IDL.Text)),
        //             minted: IDL.Opt(IDL.Vec(IDL.Text)),
        //         }),
        //     ],
        //     [],
        // ),
        listOgyCanisters: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        listPrimarySale: IDL.Func([], [IDL.Vec(PrimarySale)], ['query']),
        listSupportedTokens: IDL.Func([], [IDL.Vec(ICTokenSpec)], ['query']),
        // mintFractionNFTByEggCanister: IDL.Func(
        //     [IDL.Principal, IDL.Record({ rate: IDL.Nat, precision: IDL.Nat })],
        //     [IDL.Vec(Result)],
        //     [],
        // ),
        // rmSupportedTokens: IDL.Func([IDL.Vec(IDL.Text)], [IDL.Vec(ICTokenSpec)], []),
        // setOwner: IDL.Func([IDL.Principal], [], []),
        // setPointSettlements: IDL.Func([IDL.Nat, IDL.Principal, IDL.Nat64], [], []),
        // setYumiPointFee: IDL.Func([IDL.Principal, YumiPointFee], [], []),
        // settlePoint: IDL.Func([IDL.Nat], [SettlePointResult], []),
        // settleRecord: IDL.Func([IDL.Nat], [SettleRecordResult], []),
    });
};

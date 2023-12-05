export default ({ IDL }) => {
    const CandyValue = IDL.Rec();
    const AccountIdentifier__1 = IDL.Text;
    // const SettleICPResult = IDL.Variant({
    //     ok: IDL.Null,
    //     err: IDL.Variant({
    //         NoSettleICP: IDL.Null,
    //         SettleErr: IDL.Null,
    //         RetryExceed: IDL.Null,
    //     }),
    // });
    const Price = IDL.Nat64;
    const TokenIdentifier__1 = IDL.Text;
    const VerifyResult = IDL.Variant({
        ok: IDL.Vec(IDL.Nat),
        err: IDL.Variant({
            VerifyTxErr: IDL.Null,
            kycNotPass: IDL.Null,
            SoldOut: IDL.Null,
            CannotNotify: AccountIdentifier__1,
            PaymentReturn: IDL.Null,
            VerifyTxErr1: IDL.Null,
            InsufficientBalance: IDL.Null,
            TxNotFound: IDL.Null,
            InvalidToken: TokenIdentifier__1,
            Rejected: IDL.Null,
            Unauthorized: AccountIdentifier__1,
            Other: IDL.Text,
            amlNotPass: IDL.Null,
            CollectionNoExist: IDL.Null,
            kycorAmlNotPass: IDL.Null,
        }),
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
    // const Result_2 = IDL.Variant({ ok: Ogy_Token, err: OrigynError });
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
    const Time = IDL.Int;
    const TokenIndex = IDL.Nat32;
    const Links = IDL.Record({
        twitter: IDL.Opt(IDL.Text),
        instagram: IDL.Opt(IDL.Text),
        discord: IDL.Opt(IDL.Text),
        yoursite: IDL.Opt(IDL.Text),
        telegram: IDL.Opt(IDL.Text),
        medium: IDL.Opt(IDL.Text),
    });
    const ICTokenSpec = IDL.Record({
        fee: IDL.Nat,
        decimals: IDL.Nat,
        canister: IDL.Principal,
        standard: IDL.Variant({
            ICRC1: IDL.Null,
            EXTFungible: IDL.Null,
            DIP20: IDL.Null,
            Ledger: IDL.Null,
        }),
        symbol: IDL.Text,
    });
    const Property = IDL.Record({
        value: CandyValue,
        name: IDL.Text,
        immutable: IDL.Bool,
    });
    CandyValue.fill(
        IDL.Variant({
            Int: IDL.Int,
            Nat: IDL.Nat,
            Empty: IDL.Null,
            Nat16: IDL.Nat16,
            Nat32: IDL.Nat32,
            Nat64: IDL.Nat64,
            Blob: IDL.Vec(IDL.Nat8),
            Bool: IDL.Bool,
            Int8: IDL.Int8,
            Nat8: IDL.Nat8,
            Nats: IDL.Variant({
                thawed: IDL.Vec(IDL.Nat),
                frozen: IDL.Vec(IDL.Nat),
            }),
            Text: IDL.Text,
            Bytes: IDL.Variant({
                thawed: IDL.Vec(IDL.Nat8),
                frozen: IDL.Vec(IDL.Nat8),
            }),
            Int16: IDL.Int16,
            Int32: IDL.Int32,
            Int64: IDL.Int64,
            Option: IDL.Opt(CandyValue),
            Floats: IDL.Variant({
                thawed: IDL.Vec(IDL.Float64),
                frozen: IDL.Vec(IDL.Float64),
            }),
            Float: IDL.Float64,
            Principal: IDL.Principal,
            Array: IDL.Variant({
                thawed: IDL.Vec(CandyValue),
                frozen: IDL.Vec(CandyValue),
            }),
            Class: IDL.Vec(Property),
        }),
    );
    const TokenSpec = IDL.Variant({
        ic: ICTokenSpec,
        extensible: CandyValue,
    });
    const OgyInfo = IDL.Record({
        fee: IDL.Record({ rate: IDL.Nat64, precision: IDL.Nat64 }),
        creator: IDL.Principal,
        token: TokenSpec,
        owner: IDL.Principal,
        totalFee: IDL.Record({ rate: IDL.Nat64, precision: IDL.Nat64 }),
    });
    const Standard = IDL.Variant({ ext: IDL.Null, ogy: OgyInfo });
    const CollectionInfo = IDL.Record({
        id: IDL.Principal,
        faq: IDL.Vec(IDL.Record({ Question: IDL.Text, Answer: IDL.Text })),
        whitelistTimeStart: Time,
        whitelistTimeEnd: Time,
        featured: IDL.Text,
        starTime: Time,
        endTime: Time,
        production: IDL.Text,
        typicalNFTs: IDL.Vec(
            IDL.Record({
                TokenIndex: TokenIndex,
                NFTName: IDL.Text,
                Canister: IDL.Principal,
                NFTUrl: IDL.Text,
            }),
        ),
        name: IDL.Text,
        team: IDL.Text,
        banner: IDL.Text,
        description: IDL.Text,
        totalSupply: IDL.Nat,
        whitelistCount: IDL.Nat,
        links: IDL.Opt(Links),
        addTime: Time,
        approved: IDL.Text,
        normalPerCount: IDL.Opt(IDL.Nat),
        featured_mobile: IDL.Text,
        index: IDL.Nat64,
        price: Price,
        teamImage: IDL.Vec(IDL.Text),
        normalCount: IDL.Nat,
        whitelistPerCount: IDL.Nat,
        standard: Standard,
        whitelistPrice: Price,
        avaliable: IDL.Nat,
    });
    // const TokenSpec__1 = IDL.Record({
    //     fee: IDL.Nat64,
    //     canister: IDL.Text,
    //     decimal: IDL.Nat,
    //     symbol: IDL.Text,
    // });
    // const AccountIdentifier__2 = IDL.Text;
    // const ICPRefund = IDL.Record({
    //     token: TokenSpec__1,
    //     memo: IDL.Nat64,
    //     user: AccountIdentifier__2,
    //     price: IDL.Nat64,
    //     retry: IDL.Nat64,
    // });
    // const AccountIdentifier = IDL.Text;
    // const User = IDL.Variant({
    //     principal: IDL.Principal,
    //     address: AccountIdentifier,
    // });
    // const ICPSale = IDL.Record({
    //     token: TokenSpec__1,
    //     memo: IDL.Nat64,
    //     user: User,
    //     price: IDL.Nat64,
    //     retry: IDL.Nat64,
    // });
    // const PointSale = IDL.Record({
    //     user: User,
    //     price: IDL.Nat64,
    //     retry: IDL.Nat64,
    // });
    // const TokenIdentifier = IDL.Text;
    // const Price__1 = IDL.Nat64;
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
    //     toAID: IDL.Opt(AccountIdentifier__2),
    //     collection: IDL.Principal,
    //     date: IDL.Int,
    //     from: IDL.Opt(IDL.Principal),
    //     item: TokenIdentifier,
    //     memo: IDL.Nat64,
    //     fromAID: IDL.Opt(AccountIdentifier__2),
    //     tokenSymbol: IDL.Opt(IDL.Text),
    //     price: IDL.Opt(Price__1),
    //     eventType: RecordEventType,
    // });
    // const RecordSettle = IDL.Record({
    //     retry: IDL.Nat64,
    //     record: RecordEventInit,
    // });
    // const CollectionErr = IDL.Variant({
    //     perMaxCollNum: IDL.Null,
    //     guestCannotCreateCollection: IDL.Null,
    //     maxCollNum: IDL.Null,
    // });
    // const Result_1 = IDL.Variant({ ok: IDL.Null, err: CollectionErr });
    const Result = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
    // const User__1 = IDL.Variant({
    //     principal: IDL.Principal,
    //     address: AccountIdentifier,
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
        // addCreator_whitelist: IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Vec(IDL.Principal)], []),
        // addHeights: IDL.Func([IDL.Vec(IDL.Nat64)], [], []),
        // addSecond_creator_whitelist: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        addWhitelist: IDL.Func([IDL.Principal, IDL.Vec(AccountIdentifier__1)], [], []),
        // auditCollection: IDL.Func([IDL.Principal, IDL.Text], [IDL.Bool], []),
        // batchSettleICP: IDL.Func([IDL.Vec(IDL.Nat)], [IDL.Vec(SettleICPResult)], []),
        // batchSettleICPRefund: IDL.Func([IDL.Vec(IDL.Nat)], [], []),
        // batchSettleRecord: IDL.Func([IDL.Vec(IDL.Nat)], [], []),
        // canClaim: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], ['query']),
        // claim: IDL.Func([IDL.Nat64, IDL.Principal, Price], [VerifyResult], []),
        claimWithHeight: IDL.Func([IDL.Nat64], [VerifyResult], []),
        // claim_origyn: IDL.Func([IDL.Principal, IDL.Nat64], [IDL.Vec(Result_2)], []),
        // delCreator_whitelist: IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Vec(IDL.Principal)], []),
        // delSecond_creator_whitelist: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // delWhitelist: IDL.Func([IDL.Principal], [], []),
        // flushICPRefundSettlement: IDL.Func([], [], []),
        // flushICPSettlement: IDL.Func([], [], []),
        // flushPointSettlement: IDL.Func([], [], []),
        // flushRecordSettlement: IDL.Func([], [], []),
        // getCanisterLog: IDL.Func(
        //     [IDL.Opt(CanisterLogRequest)],
        //     [IDL.Opt(CanisterLogResponse)],
        //     ['query'],
        // ),
        getCollection: IDL.Func([IDL.Principal], [IDL.Opt(CollectionInfo)], ['query']),
        // getConfig: IDL.Func(
        //     [],
        //     [
        //         IDL.Record({
        //             platformFeeAccount: IDL.Principal,
        //             owner: IDL.Principal,
        //             ledger: IDL.Text,
        //             block: IDL.Text,
        //             point: IDL.Principal,
        //             record: IDL.Principal,
        //         }),
        //     ],
        //     ['query'],
        // ),
        // getCreator_whitelist: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // getHeight: IDL.Func([], [IDL.Vec(IDL.Nat64)], ['query']),
        // getICPRefundSettlements: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, ICPRefund))], ['query']),
        // getICPSettlements: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, ICPSale))], ['query']),
        // getOwner: IDL.Func([], [IDL.Principal], []),
        // getPointSettlements: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, PointSale))], ['query']),
        // getRecordSettlement: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, RecordSettle))], ['query']),
        // getSecond_creator_whitelist: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // getStagedTokens: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Text)], []),
        // importCollection: IDL.Func([CollectionInfo], [Result_1], []),
        isWhitelist: IDL.Func([IDL.Principal], [Result], ['query']),
        listBought: IDL.Func(
            [IDL.Principal],
            [IDL.Vec(IDL.Tuple(AccountIdentifier__1, IDL.Nat))],
            ['query'],
        ),
        listCollections: IDL.Func([], [IDL.Vec(CollectionInfo)], ['query']),
        // listWhitelist: IDL.Func(
        //     [IDL.Principal],
        //     [IDL.Vec(IDL.Tuple(AccountIdentifier__1, IDL.Nat))],
        //     ['query'],
        // ),
        // massEnableClaim: IDL.Func([IDL.Principal, IDL.Vec(IDL.Nat)], [], ['oneway']),
        // migrateCollection: IDL.Func([], [], []),
        // migrate_img: IDL.Func([IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text, IDL.Text))], [], []),
        // queryPlatformFee: IDL.Func(
        //     [],
        //     [
        //         IDL.Record({
        //             fee: Price,
        //             precision: IDL.Nat64,
        //             account: AccountIdentifier__1,
        //         }),
        //     ],
        //     ['query'],
        // ),
        // queryPointRatio: IDL.Func([], [IDL.Nat64], ['query']),
        // remaingTokens: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Nat)], ['query']),
        // removeCollection: IDL.Func([IDL.Principal], [IDL.Bool], []),
        // rmHeights: IDL.Func([IDL.Vec(IDL.Nat64)], [], []),
        // setICPRefundSettlements: IDL.Func(
        //     [IDL.Nat, AccountIdentifier__1, IDL.Nat64, IDL.Nat64],
        //     [],
        //     [],
        // ),
        // setICPSettlements: IDL.Func([IDL.Nat, User__1, IDL.Nat64, IDL.Nat64], [], []),
        // setOwner: IDL.Func([IDL.Principal], [], []),
        // setPlatformAccount: IDL.Func([IDL.Principal], [], []),
        // setPlatformFee: IDL.Func([Price, IDL.Nat64], [], []),
        // setPointRatio: IDL.Func([IDL.Nat64], [], []),
        // setPointSettlements: IDL.Func([IDL.Nat, IDL.Principal, IDL.Nat64], [], []),
        // settleICP: IDL.Func([IDL.Nat], [SettleICPResult], []),
        // settleICPRefund: IDL.Func([IDL.Nat], [SettleICPResult], []),
        // settlePoint: IDL.Func([IDL.Nat], [SettlePointResult], []),
        // settleRecord: IDL.Func([IDL.Nat], [SettleRecordResult], []),
        // updateCollection: IDL.Func([CollectionInfo], [IDL.Bool], []),
        // withdraw: IDL.Func([User, Price, IDL.Nat64], [IDL.Bool], []),
    });
};

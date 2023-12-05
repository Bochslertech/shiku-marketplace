export default ({ IDL }) => {
    const CandyValue = IDL.Rec();
    const TokenIdentifier = IDL.Text;
    // const Result_2 = IDL.Variant({ ok: IDL.Null, err: IDL.Text });
    // const SettleICPResult = IDL.Variant({
    //     ok: IDL.Null,
    //     err: IDL.Variant({
    //         NoSettleICP: IDL.Null,
    //         SettleErr: IDL.Null,
    //         RetryExceed: IDL.Null,
    //     }),
    // });
    const Img = IDL.Text;
    const Links = IDL.Record({
        twitter: IDL.Opt(IDL.Text),
        instagram: IDL.Opt(IDL.Text),
        discord: IDL.Opt(IDL.Text),
        yoursite: IDL.Opt(IDL.Text),
        telegram: IDL.Opt(IDL.Text),
        medium: IDL.Opt(IDL.Text),
    });
    const Price = IDL.Nat64;
    const Category = IDL.Text;
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
    const Time = IDL.Int;
    const CollectionInit = IDL.Record({
        url: IDL.Opt(IDL.Text),
        featured: IDL.Opt(Img),
        logo: IDL.Opt(Img),
        name: IDL.Opt(IDL.Text),
        banner: IDL.Opt(Img),
        description: IDL.Opt(IDL.Text),
        links: IDL.Opt(Links),
        isVisible: IDL.Bool,
        royalties: Price,
        category: IDL.Opt(Category),
        standard: Standard,
        releaseTime: IDL.Opt(Time),
        openTime: IDL.Opt(Time),
    });
    const Result_1 = IDL.Variant({ ok: IDL.Principal, err: IDL.Text });
    const UserId = IDL.Principal;
    const CollectionInfo = IDL.Record({
        url: IDL.Opt(IDL.Text),
        creator: UserId,
        featured: IDL.Opt(Img),
        logo: IDL.Opt(Img),
        name: IDL.Text,
        banner: IDL.Opt(Img),
        description: IDL.Opt(IDL.Text),
        links: IDL.Opt(Links),
        isVisible: IDL.Bool,
        royalties: Price,
        category: IDL.Opt(Category),
        standard: Standard,
        releaseTime: IDL.Opt(Time),
        canisterId: IDL.Principal,
    });
    // const TokenSpec__1 = IDL.Record({
    //     fee: IDL.Nat64,
    //     canister: IDL.Text,
    //     decimal: IDL.Nat,
    //     symbol: IDL.Text,
    // });
    const AccountIdentifier = IDL.Text;
    // const User__1 = IDL.Variant({
    //     principal: IDL.Principal,
    //     address: AccountIdentifier,
    // });
    // const ICPSale = IDL.Record({
    //     token: TokenSpec__1,
    //     memo: IDL.Nat64,
    //     user: User__1,
    //     price: IDL.Nat64,
    //     retry: IDL.Nat64,
    // });
    const NoticeStatus = IDL.Variant({
        readed: IDL.Null,
        unreaded: IDL.Null,
    });
    const TokenIdentifier__1 = IDL.Text;
    const NoticeResult = IDL.Variant({
        reject: IDL.Text,
        accept: TokenIdentifier__1,
    });
    const AccountIdentifier__1 = IDL.Text;
    const Notice = IDL.Record({
        id: IDL.Nat,
        status: NoticeStatus,
        result: NoticeResult,
        minter: AccountIdentifier__1,
        timestamp: Time,
    });
    // const ImportNFTStatus = IDL.Variant({
    //     reject: IDL.Text,
    //     pending: IDL.Null,
    //     pass: IDL.Text,
    //     cancel: IDL.Text,
    // });
    // const ImportNFT = IDL.Record({
    //     result: ImportNFTStatus,
    //     applicant: IDL.Principal,
    //     tokenIdentifier: TokenIdentifier__1,
    // });
    // const PageParam = IDL.Record({ page: IDL.Nat, pageCount: IDL.Nat });
    const User = IDL.Variant({
        principal: IDL.Principal,
        address: AccountIdentifier,
    });
    const MintRequest = IDL.Record({
        to: User,
        metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
    });
    const TokenIndex = IDL.Nat32;
    const Result = IDL.Variant({ ok: TokenIndex, err: IDL.Text });
    return IDL.Service({
        // addArtist: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // addCanisterController: IDL.Func([IDL.Principal, IDL.Principal], [], ['oneway']),
        // addManager: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // addOperation: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // applyImportNFT: IDL.Func([TokenIdentifier], [Result_2], []),
        // audit: IDL.Func([TokenIdentifier, IDL.Bool, IDL.Text], [Result_2], []),
        // batchSettleICP: IDL.Func([IDL.Vec(IDL.Nat)], [IDL.Vec(SettleICPResult)], []),
        createCollection: IDL.Func([CollectionInit], [Result_1], []),
        // delArtist: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // delManager: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // delNFT: IDL.Func([IDL.Vec(TokenIdentifier)], [Result_2], []),
        // delOperation: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // flushICPSettlement: IDL.Func([], [], []),
        getArtists: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // getCollection: IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
        getCollectionByPid: IDL.Func([IDL.Principal], [IDL.Opt(IDL.Principal)], ['query']),
        // getCollectionInfo: IDL.Func([IDL.Principal], [IDL.Opt(CollectionInfo)], ['query']),
        getCollectionInfos: IDL.Func([], [IDL.Vec(CollectionInfo)], ['query']),
        // getICPSettlements: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, ICPSale))], ['query']),
        // getManager: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // getMinter: IDL.Func([], [IDL.Principal], ['query']),
        getNFTCost: IDL.Func([], [IDL.Nat64], ['query']),
        getNotice: IDL.Func([], [IDL.Vec(Notice)], ['query']),
        // getOperations: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // importCollection: IDL.Func([IDL.Principal, IDL.Principal, CollectionInfo], [Result_1], []),
        // listAllNFT: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIdentifier, ImportNFT))], ['query']),
        listCollections: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
        listNFT: IDL.Func([], [IDL.Vec(TokenIdentifier)], ['query']),
        // listNFTPageable: IDL.Func([PageParam], [IDL.Vec(TokenIdentifier)], ['query']),
        // migrateCollection: IDL.Func([], [], []),
        mintNFTWithICP: IDL.Func([IDL.Nat64, IDL.Text, MintRequest], [Result], []),
        // setMinter: IDL.Func([IDL.Principal], [], []),
        // setNFTCost: IDL.Func([IDL.Nat64], [], []),
        setNoticesReaded: IDL.Func([IDL.Vec(IDL.Nat)], [], []),
        // updateCollection: IDL.Func([IDL.Principal, CollectionInfo], [], []),
        // withdraw: IDL.Func([IDL.Principal, IDL.Nat64, IDL.Nat64], [IDL.Bool], []),
    });
};

export default ({ IDL }) => {
    // const CandyValue = IDL.Rec();
    const EventId = IDL.Nat;
    const AccountIdentifier = IDL.Text;
    // const SettleICPResult = IDL.Variant({
    //     ok: IDL.Null,
    //     err: IDL.Variant({
    //         NoSettleICP: IDL.Null,
    //         SettleErr: IDL.Null,
    //         RetryExceed: IDL.Null,
    //     }),
    // });
    const Time = IDL.Int;
    const TokenIdentifier = IDL.Text;
    const VerifyResult = IDL.Variant({
        ok: TokenIdentifier,
        err: IDL.Variant({
            CannotNotify: AccountIdentifier,
            InsufficientBalance: IDL.Null,
            TxNotFound: IDL.Null,
            InvalidToken: TokenIdentifier,
            Rejected: IDL.Null,
            Unauthorized: AccountIdentifier,
            EventNoExist: IDL.Null,
            Other: IDL.Text,
            CollectionNoExist: IDL.Null,
        }),
    });
    // const Img = IDL.Text;
    // const Links = IDL.Record({
    //     twitter: IDL.Opt(IDL.Text),
    //     instagram: IDL.Opt(IDL.Text),
    //     discord: IDL.Opt(IDL.Text),
    //     yoursite: IDL.Opt(IDL.Text),
    //     telegram: IDL.Opt(IDL.Text),
    //     medium: IDL.Opt(IDL.Text),
    // });
    // const Price = IDL.Nat64;
    // const Category = IDL.Text;
    // const ICTokenSpec = IDL.Record({
    //     fee: IDL.Nat,
    //     decimals: IDL.Nat,
    //     canister: IDL.Principal,
    //     standard: IDL.Variant({
    //         ICRC1: IDL.Null,
    //         EXTFungible: IDL.Null,
    //         DIP20: IDL.Null,
    //         Ledger: IDL.Null,
    //     }),
    //     symbol: IDL.Text,
    // });
    // const Property = IDL.Record({
    //     value: CandyValue,
    //     name: IDL.Text,
    //     immutable: IDL.Bool,
    // });
    // CandyValue.fill(
    //     IDL.Variant({
    //         Int: IDL.Int,
    //         Nat: IDL.Nat,
    //         Empty: IDL.Null,
    //         Nat16: IDL.Nat16,
    //         Nat32: IDL.Nat32,
    //         Nat64: IDL.Nat64,
    //         Blob: IDL.Vec(IDL.Nat8),
    //         Bool: IDL.Bool,
    //         Int8: IDL.Int8,
    //         Nat8: IDL.Nat8,
    //         Nats: IDL.Variant({
    //             thawed: IDL.Vec(IDL.Nat),
    //             frozen: IDL.Vec(IDL.Nat),
    //         }),
    //         Text: IDL.Text,
    //         Bytes: IDL.Variant({
    //             thawed: IDL.Vec(IDL.Nat8),
    //             frozen: IDL.Vec(IDL.Nat8),
    //         }),
    //         Int16: IDL.Int16,
    //         Int32: IDL.Int32,
    //         Int64: IDL.Int64,
    //         Option: IDL.Opt(CandyValue),
    //         Floats: IDL.Variant({
    //             thawed: IDL.Vec(IDL.Float64),
    //             frozen: IDL.Vec(IDL.Float64),
    //         }),
    //         Float: IDL.Float64,
    //         Principal: IDL.Principal,
    //         Array: IDL.Variant({
    //             thawed: IDL.Vec(CandyValue),
    //             frozen: IDL.Vec(CandyValue),
    //         }),
    //         Class: IDL.Vec(Property),
    //     }),
    // );
    // const TokenSpec__1 = IDL.Variant({
    //     ic: ICTokenSpec,
    //     extensible: CandyValue,
    // });
    // const OgyInfo = IDL.Record({
    //     fee: IDL.Record({ rate: IDL.Nat64, precision: IDL.Nat64 }),
    //     creator: IDL.Principal,
    //     token: TokenSpec__1,
    //     owner: IDL.Principal,
    //     totalFee: IDL.Record({ rate: IDL.Nat64, precision: IDL.Nat64 }),
    // });
    // const Standard = IDL.Variant({ ext: IDL.Null, ogy: OgyInfo });
    // const CollectionInit = IDL.Record({
    //     url: IDL.Opt(IDL.Text),
    //     featured: IDL.Opt(Img),
    //     logo: IDL.Opt(Img),
    //     name: IDL.Opt(IDL.Text),
    //     banner: IDL.Opt(Img),
    //     description: IDL.Opt(IDL.Text),
    //     links: IDL.Opt(Links),
    //     isVisible: IDL.Bool,
    //     royalties: Price,
    //     category: IDL.Opt(Category),
    //     standard: Standard,
    //     releaseTime: IDL.Opt(Time),
    //     openTime: IDL.Opt(Time),
    // });
    // const Result = IDL.Variant({ ok: IDL.Principal, err: IDL.Text });
    const ProjectId = IDL.Nat;
    // const EventInit = IDL.Record({
    //     oatReleaseStartTime: Time,
    //     eventStartTime: Time,
    //     featured: IDL.Text,
    //     camp: IDL.Nat,
    //     link: IDL.Text,
    //     name: IDL.Text,
    //     description: IDL.Text,
    //     oatReleaseEndTime: Time,
    //     canister: IDL.Principal,
    //     permisson: IDL.Variant({ wl: IDL.Null, nowl: IDL.Null }),
    //     eventEndTime: Time,
    //     eventType: IDL.Variant({ notStart: IDL.Null, ended: IDL.Null }),
    // });
    // const ProjectInit = IDL.Record({
    //     twitter: IDL.Opt(IDL.Text),
    //     instagram: IDL.Opt(IDL.Text),
    //     logo: IDL.Text,
    //     name: IDL.Text,
    //     banner: IDL.Text,
    //     description: IDL.Text,
    //     website: IDL.Opt(IDL.Text),
    //     discord: IDL.Opt(IDL.Text),
    //     telegram: IDL.Opt(IDL.Text),
    //     medium: IDL.Opt(IDL.Text),
    // });
    const OatEvent = IDL.Record({
        id: IDL.Nat,
        oatReleaseStartTime: Time,
        eventStartTime: Time,
        featured: IDL.Text,
        camp: IDL.Nat,
        link: IDL.Text,
        name: IDL.Text,
        description: IDL.Text,
        claimed: IDL.Nat,
        oatReleaseEndTime: Time,
        projectId: IDL.Nat,
        canister: IDL.Principal,
        permisson: IDL.Variant({ wl: IDL.Null, nowl: IDL.Null }),
        eventEndTime: Time,
        eventType: IDL.Variant({ notStart: IDL.Null, ended: IDL.Null }),
    });
    // const TokenSpec = IDL.Record({
    //     fee: IDL.Nat64,
    //     canister: IDL.Text,
    //     decimal: IDL.Nat,
    //     symbol: IDL.Text,
    // });
    // const AccountIdentifier__1 = IDL.Text;
    // const User = IDL.Variant({
    //     principal: IDL.Principal,
    //     address: AccountIdentifier__1,
    // });
    // const ICPSale = IDL.Record({
    //     token: TokenSpec,
    //     memo: IDL.Nat64,
    //     user: User,
    //     price: IDL.Nat64,
    //     retry: IDL.Nat64,
    // });
    // const PageParam = IDL.Record({ page: IDL.Nat, pageCount: IDL.Nat });
    const Project = IDL.Record({
        id: IDL.Nat,
        twitter: IDL.Opt(IDL.Text),
        owner: IDL.Principal,
        instagram: IDL.Opt(IDL.Text),
        logo: IDL.Text,
        name: IDL.Text,
        banner: IDL.Text,
        description: IDL.Text,
        website: IDL.Opt(IDL.Text),
        events: IDL.Vec(IDL.Nat),
        discord: IDL.Opt(IDL.Text),
        telegram: IDL.Opt(IDL.Text),
        medium: IDL.Opt(IDL.Text),
    });
    return IDL.Service({
        // addCanisterController: IDL.Func([IDL.Principal, IDL.Principal], [], ['oneway']),
        // addManager: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // addOatWhitelist: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        addWhitelist: IDL.Func([EventId, IDL.Vec(AccountIdentifier)], [], []),
        // batchSettleICP: IDL.Func([IDL.Vec(IDL.Nat)], [IDL.Vec(SettleICPResult)], []),
        canClaim: IDL.Func([EventId], [IDL.Bool], ['query']),
        // changeOatTime: IDL.Func([EventId, Time, Time, Time, Time], [IDL.Bool], []),
        claim: IDL.Func([EventId], [VerifyResult], []),
        // clearICPSettlements: IDL.Func([IDL.Vec(IDL.Nat)], [], []),
        // createCollection: IDL.Func([IDL.Nat64, CollectionInit], [Result], []),
        // createEvent: IDL.Func([ProjectId, EventInit], [EventId], []),
        // createProject: IDL.Func([ProjectInit], [ProjectId], []),
        // delEvent: IDL.Func([EventId], [], []),
        // delManager: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // delOatwhitelist: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // delProject: IDL.Func([ProjectId], [], []),
        // delWhitelist: IDL.Func([EventId], [], []),
        // eventAddCamp: IDL.Func([EventId, IDL.Nat, IDL.Text, Time, Time], [IDL.Bool], []),
        // eventRemoveCamp: IDL.Func([EventId, IDL.Nat], [IDL.Bool], []),
        // flushICPSettlement: IDL.Func([], [], []),
        // geManager: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // getCanister: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // getCollectionRemainingTokens: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Nat)], ['query']),
        // getConfig: IDL.Func(
        //     [],
        //     [
        //         IDL.Record({
        //             owner: IDL.Principal,
        //             yumi: IDL.Principal,
        //             record: IDL.Principal,
        //         }),
        //     ],
        //     ['query'],
        // ),
        // getEventCost: IDL.Func([], [IDL.Nat64], ['query']),
        getEvents: IDL.Func([], [IDL.Vec(OatEvent)], ['query']),
        getEventsByEventId: IDL.Func([IDL.Vec(EventId)], [IDL.Vec(OatEvent)], ['query']),
        getEventsByProjectId: IDL.Func([ProjectId], [IDL.Vec(OatEvent)], ['query']),
        // getICPSettlements: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, ICPSale))], ['query']),
        // getOatwhitelist: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        // getProjects: IDL.Func([IDL.Opt(PageParam)], [IDL.Vec(Project)], ['query']),
        // getProjectsByPid: IDL.Func([IDL.Principal], [IDL.Opt(Project)], ['query']),
        getProjectsByProjectId: IDL.Func([IDL.Vec(ProjectId)], [IDL.Vec(Project)], ['query']),
        // getWhoCanister: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Principal)], ['query']),
        listWhitelist: IDL.Func(
            [IDL.Principal],
            [IDL.Vec(IDL.Tuple(AccountIdentifier, IDL.Nat))],
            ['query'],
        ),
        // massEnableClaim: IDL.Func([EventId, IDL.Vec(IDL.Nat)], [], ['oneway']),
        // migrate_event_img: IDL.Func([IDL.Nat, IDL.Text], [], ['oneway']),
        // migrate_project_img: IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [], ['oneway']),
        // setEventCost: IDL.Func([IDL.Nat64], [], []),
        // updateEvent: IDL.Func([EventId, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
        // updateProject: IDL.Func([ProjectId, ProjectInit], [], []),
        // withdraw: IDL.Func([IDL.Principal, IDL.Nat64, IDL.Nat64], [], []),
    });
};

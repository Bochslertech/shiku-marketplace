export default ({ IDL }) => {
    // const EventType = IDL.Variant({
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
    // const TokenIdentifier__1 = IDL.Text;
    const AccountIdentifier__1 = IDL.Text;
    const Price = IDL.Nat64;
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
    const AccountIdentifier = IDL.Text;
    const Time = IDL.Int;
    const TokenIdentifier = IDL.Text;
    const RecordEventType = IDL.Variant({
        auctionDeal: IDL.Null,
        dutchAuction: IDL.Null,
        offer: IDL.Null,
        list: IDL.Null,
        claim: IDL.Null,
        mint: IDL.Null,
        sold: IDL.Null,
        acceptOffer: IDL.Null,
        point: IDL.Null,
        auction: IDL.Null,
        transfer: IDL.Null,
    });
    const Event = IDL.Record({
        to: IDL.Opt(IDL.Principal),
        toAid: IDL.Opt(AccountIdentifier),
        collection: IDL.Principal,
        date: Time,
        from: IDL.Opt(IDL.Principal),
        item: TokenIdentifier,
        memo: IDL.Nat64,
        fromAid: IDL.Opt(AccountIdentifier),
        tokenSymbol: IDL.Opt(IDL.Text),
        index: IDL.Nat,
        price: IDL.Opt(Price),
        eventType: RecordEventType,
    });
    // const PageParam = IDL.Record({ page: IDL.Nat, pageCount: IDL.Nat });
    return IDL.Service({
        // addEvent: IDL.Func(
        //     [
        //         EventType,
        //         TokenIdentifier__1,
        //         IDL.Opt(IDL.Principal),
        //         IDL.Opt(IDL.Principal),
        //         IDL.Opt(AccountIdentifier__1),
        //         IDL.Opt(AccountIdentifier__1),
        //         IDL.Opt(Price),
        //         IDL.Int,
        //         IDL.Principal,
        //         IDL.Opt(IDL.Text),
        //         IDL.Nat64,
        //     ],
        //     [],
        //     [],
        // ),
        // getBackupEventSize: IDL.Func([], [IDL.Nat], ['query']),
        // getCanisterLog: IDL.Func(
        //     [IDL.Opt(CanisterLogRequest)],
        //     [IDL.Opt(CanisterLogResponse)],
        //     ['query'],
        // ),
        // getCollectionEvents: IDL.Func([IDL.Principal], [IDL.Opt(IDL.Vec(Event))], ['query']),
        // getCollectionEventsPageable: IDL.Func(
        //     [IDL.Principal, PageParam],
        //     [IDL.Opt(IDL.Tuple(IDL.Vec(Event), IDL.Nat))],
        //     ['query'],
        // ),
        // getCollectionEventsSize: IDL.Func([IDL.Principal], [IDL.Opt(IDL.Nat)], ['query']),
        // getCollectionEventsWithIndex: IDL.Func(
        //     [IDL.Principal, IDL.Nat],
        //     [IDL.Opt(IDL.Vec(Event))],
        //     ['query'],
        // ),
        // getConfig: IDL.Func(
        //     [],
        //     [
        //         IDL.Record({
        //             oat: IDL.Principal,
        //             yumi: IDL.Principal,
        //             launchpad: IDL.Principal,
        //         }),
        //     ],
        //     ['query'],
        // ),
        // getEventByIndex: IDL.Func([IDL.Nat], [Event], ['query']),
        // getEventSize: IDL.Func([], [IDL.Nat], ['query']),
        // getEventsByParam: IDL.Func(
        //     [PageParam],
        //     [IDL.Opt(IDL.Tuple(IDL.Vec(Event), IDL.Nat))],
        //     ['query'],
        // ),
        // getEventsByRange: IDL.Func(
        //     [IDL.Nat, IDL.Nat],
        //     [IDL.Opt(IDL.Tuple(IDL.Vec(Event), IDL.Nat))],
        //     ['query'],
        // ),
        // getNftEvents: IDL.Func([TokenIdentifier__1], [IDL.Opt(IDL.Vec(Event))], ['query']),
        // getNftEventsPageable: IDL.Func(
        //     [TokenIdentifier__1, PageParam],
        //     [IDL.Opt(IDL.Tuple(IDL.Vec(Event), IDL.Nat))],
        //     ['query'],
        // ),
        getUserEvents: IDL.Func([AccountIdentifier__1], [IDL.Opt(IDL.Vec(Event))], ['query']),
        // getUserEventsPageable: IDL.Func(
        //     [AccountIdentifier__1, PageParam],
        //     [IDL.Opt(IDL.Tuple(IDL.Vec(Event), IDL.Nat))],
        //     ['query'],
        // ),
        // migrateEvent: IDL.Func([], [], []),
        // pushBackupEvent: IDL.Func([IDL.Vec(Event)], [], []),
        // recoveryBackupEvent: IDL.Func([], [], []),
        // recoveryMapping: IDL.Func([IDL.Nat, IDL.Nat], [], []),
        // remove_from_user: IDL.Func([IDL.Principal], [], []),
        // setIsOpen: IDL.Func([IDL.Principal], [], []),
        // sortByCollectionEventIndex: IDL.Func([], [], []),
        // sortByNFTEventIndex: IDL.Func([], [], []),
        // sortByUserEventIndex: IDL.Func([], [], []),
    });
};

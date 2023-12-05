export default ({ IDL }) => {
    // const thirdCollectionInfo = IDL.Record({
    //     creator: IDL.Principal,
    //     collectionType: IDL.Text,
    // });
    const TokenIdentifier__1 = IDL.Text;
    const AccountIdentifier = IDL.Text;
    // const User = IDL.Variant({
    //     principal: IDL.Principal,
    //     address: AccountIdentifier,
    // });
    // const AllowanceRequest = IDL.Record({
    //     token: TokenIdentifier__1,
    //     owner: User,
    //     spender: IDL.Principal,
    // });
    // const Balance__1 = IDL.Nat;
    // const CommonError = IDL.Variant({
    //     InvalidToken: TokenIdentifier__1,
    //     Other: IDL.Text,
    // });
    // const Result__1_1 = IDL.Variant({ ok: Balance__1, err: CommonError });
    const TokenIdentifier = IDL.Text;
    // const AccountIdentifier__1 = IDL.Text;
    // const Result__1 = IDL.Variant({
    //     ok: AccountIdentifier__1,
    //     err: CommonError,
    // });
    const FillDepositErr = IDL.Variant({
        ownerError: IDL.Null,
        getBearerErr: IDL.Null,
        noExistDeposit: IDL.Null,
        unSupportCollectionErr: IDL.Null,
    });
    const Result_1 = IDL.Variant({ ok: IDL.Null, err: FillDepositErr });
    const Time = IDL.Int;
    const DepositInfo = IDL.Record({
        ttl: Time,
        status: IDL.Bool,
        deposit: IDL.Principal,
    });
    const ReserveDepositErr = IDL.Variant({
        getBearerErr: IDL.Null,
        checkOwnerErr: IDL.Null,
        unSupportCollectionErr: IDL.Null,
    });
    const Result = IDL.Variant({ ok: IDL.Null, err: ReserveDepositErr });
    // const Memo = IDL.Vec(IDL.Nat8);
    // const SubAccount = IDL.Vec(IDL.Nat8);
    const Balance = IDL.Nat;
    // const TransferRequest = IDL.Record({
    //     to: User,
    //     token: TokenIdentifier__1,
    //     notify: IDL.Bool,
    //     from: User,
    //     memo: Memo,
    //     subaccount: IDL.Opt(SubAccount),
    //     amount: Balance,
    // });
    const TransferResponse = IDL.Variant({
        ok: Balance,
        err: IDL.Variant({
            CannotNotify: AccountIdentifier,
            InsufficientBalance: IDL.Null,
            InvalidToken: TokenIdentifier__1,
            Rejected: IDL.Null,
            Unauthorized: AccountIdentifier,
            Other: IDL.Text,
        }),
    });
    return IDL.Service({
        // addCreator_whitelist: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        // addThirdCollection: IDL.Func([IDL.Principal, thirdCollectionInfo], [], ['oneway']),
        // allowance: IDL.Func([AllowanceRequest], [Result__1_1], []),
        // balance: IDL.Func([], [IDL.Nat], []),
        // bearer: IDL.Func([TokenIdentifier], [Result__1], []),
        // delCreator_whitelist: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        fillDeposit: IDL.Func([IDL.Principal, IDL.Nat32], [Result_1], []),
        getAllDeposit: IDL.Func(
            [],
            [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat32, IDL.Principal))],
            ['query'],
        ),
        // getCreator_whitelist: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        getDeposit: IDL.Func([IDL.Principal, IDL.Nat32], [IDL.Opt(DepositInfo)], ['query']),
        // getMinter: IDL.Func([IDL.Principal], [IDL.Principal], ['query']),
        // getOwner: IDL.Func([], [IDL.Principal], []),
        // getThirdCollections: IDL.Func(
        //     [],
        //     [IDL.Vec(IDL.Tuple(IDL.Principal, thirdCollectionInfo))],
        //     ['query'],
        // ),
        // getTokenIdentifierByUser: IDL.Func([IDL.Principal], [IDL.Vec(TokenIdentifier)], ['query']),
        // removeThirdCollection: IDL.Func(
        //     [IDL.Principal],
        //     [IDL.Vec(IDL.Tuple(IDL.Principal, thirdCollectionInfo))],
        //     [],
        // ),
        reserveDeposit: IDL.Func([IDL.Principal, IDL.Nat32], [Result], []),
        // setOwner: IDL.Func([IDL.Principal], [], []),
        // setYumiOwner: IDL.Func([IDL.Principal], [], []),
        // transfer: IDL.Func([TransferRequest], [TransferResponse], []),
        // wallet_receive: IDL.Func([], [IDL.Nat], []),
        withdraw: IDL.Func([TokenIdentifier], [TransferResponse], []),
    });
};

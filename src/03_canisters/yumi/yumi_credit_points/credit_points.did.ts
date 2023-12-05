export default ({ IDL }) => {
    const AccountIdentifier = IDL.Text;
    const User = IDL.Variant({
        principal: IDL.Principal,
        address: AccountIdentifier,
    });
    const Balance__1 = IDL.Nat64;
    const TokenIdentifier = IDL.Text;
    const CommonError__1 = IDL.Variant({
        InvalidToken: TokenIdentifier,
        Other: IDL.Text,
    });
    const BalanceResponse = IDL.Variant({
        ok: Balance__1,
        err: CommonError__1,
    });
    // const Balance = IDL.Nat64;
    // const Metadata = IDL.Variant({
    //     fungible: IDL.Record({
    //         decimals: IDL.Nat8,
    //         metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
    //         name: IDL.Text,
    //         symbol: IDL.Text,
    //     }),
    //     nonfungible: IDL.Record({ metadata: IDL.Opt(IDL.Vec(IDL.Nat8)) }),
    // });
    // const CommonError = IDL.Variant({
    //     InvalidToken: TokenIdentifier,
    //     Other: IDL.Text,
    // });
    // const Result_1 = IDL.Variant({ ok: Metadata, err: CommonError });
    // const Result = IDL.Variant({ ok: Balance, err: CommonError });
    return IDL.Service({
        // acceptCycles: IDL.Func([], [], []),
        // availableCycles: IDL.Func([], [IDL.Nat], ['query']),
        balance: IDL.Func([User], [BalanceResponse], ['query']),
        // balances: IDL.Func([], [IDL.Vec(IDL.Tuple(AccountIdentifier, Balance))], ['query']),
        // burn: IDL.Func([User, Balance], [BalanceResponse], []),
        // getConfig: IDL.Func(
        //     [],
        //     [
        //         IDL.Record({
        //             origyn: IDL.Principal,
        //             yumi: IDL.Principal,
        //             lanuchpad: IDL.Principal,
        //         }),
        //     ],
        //     ['query'],
        // ),
        // metadata: IDL.Func([], [Result_1], ['query']),
        // mint: IDL.Func([User, Balance], [BalanceResponse], []),
        // setLanuchpadOwner: IDL.Func([IDL.Principal], [], []),
        // setOrigyn: IDL.Func([IDL.Principal], [], []),
        // setYumiOwner: IDL.Func([IDL.Principal], [], []),
        // supply: IDL.Func([], [Result], ['query']),
    });
};

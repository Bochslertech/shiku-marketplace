export default ({ IDL }) => {
    // const JWTServiceStorage = IDL.Record({
    //     owner: IDL.Principal,
    //     jwt_secret: IDL.Text,
    // });
    // const Result = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text });
    const UserJWT = IDL.Record({ token: IDL.Text, token_exp: IDL.Nat64 });
    const Result_1 = IDL.Variant({ Ok: UserJWT, Err: IDL.Text });
    return IDL.Service({
        generate_jwt: IDL.Func([], [IDL.Text], []),
        // get_jwt_secret: IDL.Func([], [Result], ['query']),
        get_my_jwt: IDL.Func([], [Result_1], ['query']),
        // get_owner: IDL.Func([], [IDL.Principal], ['query']),
        // get_user_jwt: IDL.Func([IDL.Principal], [Result], ['query']),
        // set_jwt_secret: IDL.Func([IDL.Text], [Result], []),
        // set_owner: IDL.Func([IDL.Principal], [Result], []),
    });
};

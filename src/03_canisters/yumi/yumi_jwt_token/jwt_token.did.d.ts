import type { Principal } from '@dfinity/agent';

// export interface JWTServiceStorage {
//     owner: Principal;
//     jwt_secret: string;
// }
// export type Result = { Ok: string } | { Err: string };
export type Result_1 = { Ok: UserJWT } | { Err: string };
export interface UserJWT {
    token: string;
    token_exp: bigint;
}
export default interface _SERVICE {
    generate_jwt: () => Promise<string>;
    // get_jwt_secret: () => Promise<Result>;
    get_my_jwt: () => Promise<Result_1>;
    // get_owner: () => Promise<Principal>;
    // get_user_jwt: (arg_0: Principal) => Promise<Result>;
    // set_jwt_secret: (arg_0: string) => Promise<Result>;
    // set_owner: (arg_0: Principal) => Promise<Result>;
}

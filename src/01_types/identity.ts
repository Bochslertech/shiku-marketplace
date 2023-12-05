import { ActorSubclass } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';

// >>>>>>>>>>>>>>>>> 用户登录相关类型 <<<<<<<<<<<<<<<<<

// 登录方式
export type ConnectType = 'ii' | 'plug' | 'me' | 'infinity' | 'nfid' | 'stoic';

// 登录后获取的凭证, 就是能以登录的身份创建 actor, actor 可以调用罐子方法
export type ActorCreator = <T>(
    idlFactory: IDL.InterfaceFactory, // candid接口
    canister_id: string, // 目标罐子
) => Promise<ActorSubclass<T>>;

// 整个系统传递的身份对象
export type ConnectedIdentity = {
    connectType: ConnectType; // 当前登录方式
    principal: string; // 当前登录身份的 principal id
    account: string;
    creator: ActorCreator; // 登录的凭证
    requestWhitelist: (whitelist: string[]) => Promise<boolean>;
};

// 记录每次的登录方式和时间
export type ConnectedRecord = {
    connectType: ConnectType; // 登录方式
    principal: string; // 登录的 principal
    timestamp: number; // 登录时间, 每次登录都保存
};

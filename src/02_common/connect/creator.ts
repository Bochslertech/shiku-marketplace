import { IConnector } from '@connect2ic/core';
import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { ActorCreator, ConnectedIdentity } from '@/01_types/identity';

// Internet Identity 提供 agent
export const getActorCreatorByAgent = (agent: HttpAgent): ActorCreator => {
    return async <T>(idlFactory: IDL.InterfaceFactory, canisterId: string) => {
        return Actor.createActor<T>(idlFactory, { agent, canisterId });
    };
};

// connect2ic 提供 activeProvider
export const getActorCreatorByActiveProvider = (activeProvider: IConnector): ActorCreator => {
    return async <T>(idlFactory: IDL.InterfaceFactory, canisterId: string) => {
        const result = await activeProvider.createActor<ActorSubclass<T>>(
            canisterId,
            idlFactory as any,
        );
        if (result.isOk()) return result.value;
        throw new Error(result.error.message);
    };
};

// 创建匿名身份
export const getAnonymousActorCreatorByAgent = (
    host: string | undefined,
    fetchRootKey: boolean = false,
): ActorCreator => {
    return async <T>(idlFactory: IDL.InterfaceFactory, canisterId: string) => {
        const agent = new HttpAgent({ host });
        if (fetchRootKey) await agent.fetchRootKey();
        return Actor.createActor<T>(idlFactory, { agent, canisterId });
    };
};

// 创建匿名身份
export const createAnonymousIdentity = (
    host: string | undefined,
    fetchRootKey: boolean = false,
): ConnectedIdentity => {
    return {
        connectType: 'ii',
        principal: '2vxsx-fae', // 匿名身份
        account: '1c7a48ba6a562aa9eaa2481a9049cdf0433b9738c992d698c31d8abf89cadc79', // 匿名身份
        creator: getAnonymousActorCreatorByAgent(host, fetchRootKey),
        requestWhitelist: async () => true,
    };
};

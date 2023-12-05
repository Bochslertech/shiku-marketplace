import { message } from 'antd';
import {
    BalanceError,
    ConnectError,
    CreateActorError,
    DisconnectError,
    InitError,
    TransferError,
} from '@connect2ic/core';
import { ActorSubclass, Agent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { err, ok } from 'neverthrow';
import { readLastConnectType, writeLastConnectType } from '../../app/storage';
import plugLogoDark from './svg/plug-dark.min.svg';
import plugLogoLight from './svg/plug-light.min.svg';

// Plug 对象
type Plug = {
    createActor: <T>(args: {
        canisterId: string;
        interfaceFactory: IDL.InterfaceFactory;
    }) => Promise<ActorSubclass<T>>;
    agent: Agent;
    createAgent: (options: { host: string; whitelist: Array<string> }) => Promise<Agent>;
    getPrincipal: () => Promise<Principal>;
    isConnected: () => Promise<boolean>;
    disconnect: () => Promise<void>;
    requestConnect: (config: { whitelist?: string[]; host?: string }) => Promise<boolean>;
    accountId: string;
    requestTransfer: (args: {
        to: string;
        amount: number;
        opts?: {
            fee?: number;
            memo?: string;
            from_subaccount?: number;
            created_at_time?: {
                timestamp_nanos: number;
            };
        };
    }) => Promise<{
        height: number;
    }>;
    requestBalance: () => Promise<
        Array<{
            amount: number;
            canisterId: string;
            decimals: number;
            image?: string;
            name: string;
            symbol: string;
        }>
    >;
    getManagementCanister: () => Promise<ActorSubclass | undefined>;
};

export class CustomPlugWallet {
    public meta = {
        features: ['wallet'],
        icon: {
            light: plugLogoLight,
            dark: plugLogoDark,
        },
        id: 'plug',
        name: 'Plug Wallet',
    };

    #config: {
        whitelist: Array<string>;
        host: string;
        dev: boolean;
        onConnectionUpdate: () => void;
    };
    #identity?: any;
    #principal?: string;
    #client?: any;
    #ic?: Plug;
    #wallet?: {
        principal: string;
        accountId: string;
    };

    // plug 登录后的更新回调
    onUpdate = () => {
        const { agent, principal, accountId } = window.ic.plug.sessionManager.sessionData;
        // agent.getPrincipal().then((principal: Principal) => {
        //     console.debug(
        //         `🚀 ~ file: plug.ts:85 ~ CustomPlugWallet ~ agent.getPrincipal ~ principal:`,
        //         principal.toText(),
        //     );
        // });
        console.debug(`🚀 ~ file: plug.ts:87 ~ CustomPlugWallet ~ accountId:`, accountId);
        console.debug(`🚀 ~ file: plug.ts:87 ~ CustomPlugWallet ~ principal:`, principal);
        console.debug(`🚀 ~ file: plug.ts:87 ~ CustomPlugWallet ~ agent:`, agent);
        if (readLastConnectType() === 'plug') {
            writeLastConnectType('');
            // 之前是 plug 登录的情况下
            message.success({
                content: `The connected identity has changed, the wallet will log out.`,
                duration: 2,
                onClose: () => window.location.reload(),
            });
        }
    };

    get identity() {
        return this.#identity;
    }

    get wallets() {
        return this.#wallet ? [this.#wallet] : [];
    }

    get principal() {
        return this.#principal;
    }

    get client() {
        return this.#client;
    }

    get ic() {
        return this.#ic;
    }

    constructor(userConfig: { whitelist?: string[]; host?: string } = {}) {
        this.#config = {
            whitelist: [],
            host: window.location.origin,
            dev: true,
            onConnectionUpdate: () => {
                // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
                const { agent, principal, accountId } = window.ic.plug.sessionManager.sessionData;
                // TO DO: recreate actors
                // TO DO: handle account switching
                this.onUpdate();
            },
            ...userConfig,
        };
        this.#ic = window.ic?.plug;
    }

    set config(config: { whitelist?: string[]; host?: string }) {
        this.#config = { ...this.#config, ...config };
    }

    get config() {
        return this.#config;
    }

    // 初始化
    async init() {
        // console.error('plug init');
        // TO DO: handle account switching
        try {
            if (!this.#ic) {
                return err({ kind: InitError.NotInstalled });
            }
            (this.#ic as any).sessionManager.onConnectionUpdate = this.onUpdate; // 设置回调
            const status = await this.status(); // 获取状态

            // console.warn(
            //     'plug provider init status',
            //     status,
            //     (this.#ic as any).sessionManager.sessionData,
            // );

            if (status !== 'disconnected' && status !== 'locked') {
                await this.#ic.createAgent({
                    host: this.#config.host,
                    whitelist: this.#config.whitelist,
                });
            }
            if (status === 'connected') {
                // Never finishes if locked
                // this.#principal = (await this.#ic.getPrincipal()).toString(); // ! 这个方法总是报错
                // this.#wallet = {
                //     principal: this.#principal,
                //     accountId: this.#ic.accountId,
                // };

                this.#principal = (this.#ic as any).sessionManager.sessionData
                    .principalId as string;
                this.#wallet = {
                    principal: this.#principal,
                    accountId: (this.#ic as any).sessionManager.sessionData.accountId,
                };
            }
            return ok({ isConnected: false });
        } catch (e) {
            console.error(e);
            return err({ kind: InitError.InitFailed });
        }
    }

    // 获取状态
    async status(): Promise<'connected' | 'disconnected' | 'locked'> {
        // console.error('plug status');
        if (!this.#ic) {
            return 'disconnected';
        }
        if (readLastConnectType() !== 'plug') {
            // 不是 plug 的情况下,就必须要求有 sessionData 才进行请求
            // 否则总是弹窗不好
            if (!(this.#ic as any).sessionManager.sessionData) return 'disconnected'; // ! 拦截后会失去自动登录效果
        }
        try {
            let returned = false;
            return await Promise.race<'connected' | 'disconnected' | 'locked'>([
                this.#ic.isConnected().then((connected) => {
                    if (returned && connected) location.reload();
                    return connected ? 'connected' : 'disconnected';
                }),
                new Promise((resolve) =>
                    setTimeout(() => {
                        returned = true;
                        resolve('locked'); // 2 秒就直接返回
                    }, 2000),
                ),
            ]);
        } catch (e) {
            this.#ic.disconnect();
            return 'disconnected';
        }
    }

    // 是否连接
    async isConnected() {
        // console.error('plug isConnected');
        try {
            if (!this.#ic) return false;
            if (!(this.#ic as any).sessionManager.sessionData) return false; // ! 调用isConnected在locked情况下会导致弹窗悬停
            return await this.#ic.isConnected();
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    // 创建 actor
    async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory) {
        // console.error('plug createActor');
        if (!this.#ic) {
            return err({ kind: CreateActorError.NotInitialized });
        }
        try {
            // Fetch root key for certificate validation during development
            if (this.#config.dev) {
                const res = await this.#ic.agent
                    .fetchRootKey()
                    .then(() => ok(true))
                    .catch(() => err({ kind: CreateActorError.FetchRootKeyFailed }));
                if (res.isErr()) {
                    return res;
                }
            }
            const actor = await this.#ic.createActor<Service>({
                canisterId,
                interfaceFactory: idlFactory,
            });
            return ok(actor);
        } catch (e) {
            console.error(e);
            return err({ kind: CreateActorError.CreateActorFailed });
        }
    }

    // 登录
    async connect() {
        // console.error('plug connect');
        try {
            if (!this.#ic) {
                window.open('https://plugwallet.ooo/', '_blank');
                return err({ kind: ConnectError.NotInstalled });
            }
            await this.#ic.requestConnect(this.#config);
            this.#principal = (await this.#ic.getPrincipal()).toString();
            if (this.#principal) {
                this.#wallet = {
                    principal: this.#principal,
                    accountId: this.#ic.accountId,
                };
                return ok(true);
            }
            return ok(true);
        } catch (e) {
            console.error(e);
            message.error(`connection failed`);
            return err({ kind: ConnectError.ConnectFailed });
        }
    }

    // 退出登录
    async disconnect() {
        // console.error('plug disconnect');
        try {
            if (!this.#ic) {
                return err({ kind: DisconnectError.NotInitialized });
            }
            // TO DO: should be awaited but never finishes, tell Plug to fix
            await this.#ic.disconnect(); // ! 总是报错
            return ok(true);
        } catch (e) {
            console.error(e);
            return err({ kind: DisconnectError.DisconnectFailed });
        }
    }

    // 请求转账
    async requestTransfer(opts: {
        amount: number;
        to: string;
        symbol?: string;
        standard?: string;
        decimals?: number;
        fee?: number;
        memo?: bigint;
        createdAtTime?: Date;
        fromSubAccount?: number;
    }) {
        const {
            to,
            amount,
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            standard = 'ICP',
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            symbol = 'ICP',
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            decimals = 8,
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            fee = 0,
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            memo = BigInt(0),
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            createdAtTime = new Date(),
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            fromSubAccount = 0,
        } = opts;
        try {
            const result = await this.#ic?.requestTransfer({
                to,
                amount: amount * 100000000,
            });

            switch (!!result) {
                case true:
                    return ok({ height: result!.height });
                default:
                    // TO DO: ?
                    return err({ kind: TransferError.TransferFailed });
            }
        } catch (e) {
            console.error(e);
            return err({ kind: TransferError.TransferFailed });
        }
    }

    // 查询余额
    async queryBalance() {
        // console.error('plug queryBalance');
        try {
            if (!this.#ic) {
                return err({ kind: BalanceError.NotInitialized });
            }
            const assets = await this.#ic.requestBalance();
            return ok(assets);
        } catch (e) {
            console.error(e);
            return err({ kind: BalanceError.QueryBalanceFailed });
        }
    }

    // TO DO:

    // signMessage({ message }) {
    //   return this.#ic?.signMessage({message})
    // }

    // async getManagementCanister() {
    //   return this.#ic?.getManagementCanister()
    // }

    // batchTransactions(...args) {
    //   return this.#ic?.batchTransactions(...args)
    // }
}

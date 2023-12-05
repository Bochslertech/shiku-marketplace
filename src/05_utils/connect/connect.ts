import { createClient as create, IConnector } from '@connect2ic/core';
import { AstroX, ICX, InfinityWallet, StoicWallet } from '@connect2ic/core/providers';
import _ from 'lodash';
import { ConnectedIdentity, ConnectType } from '@/01_types/identity';
import { getActorCreatorByActiveProvider } from '@/02_common/connect/creator';
import { principal2account } from '@/02_common/ic/account';
import { isPrincipalText } from '@/02_common/ic/principals';
import { getConnectDerivationOrigin, getConnectHost, isDevMode } from '../app/env';
import { getLedgerIcpCanisterId, getLedgerOgyCanisterId } from '../canisters/ledgers/special';
import {
    getYumiArtistRouterCanisterId,
    getYumiCccProxyCanisterId,
    getYumiCoreCanisterId,
    getYumiJwtTokenCanisterId,
    getYumiLaunchpadCanisterId,
    getYumiOatCanisterId,
} from '../canisters/yumi/special';
import { CustomInternetIdentity, getIIFrame } from './providers/ii';
import { CustomNFID } from './providers/nfid';
import { CustomPlugWallet } from './providers/plug';
import { initWhitelist } from './whitelist';
import { ALL_COLLECTIONS } from './whitelist_all';

const isDev = isDevMode();

// 获取需要设置的白名单
const getWhitelist = (): string[] => [
    // 账本罐子
    getLedgerIcpCanisterId(),
    getLedgerOgyCanisterId(),
    // yumi 罐子
    getYumiCoreCanisterId(),
    // getYumiCreditPointsCanisterId(), // 暂时未发现需要身份接口
    getYumiArtistRouterCanisterId(),
    // getYumiUserRecordCanisterId(), // 暂时未发现需要身份接口
    // getYumiOrigynArtCanisterId(), // 暂时未发现需要身份接口
    getYumiCccProxyCanisterId(),
    getYumiLaunchpadCanisterId(),
    // getYumiApplicationCanisterId(), // 暂时未发现需要身份接口
    getYumiOatCanisterId(),
    getYumiJwtTokenCanisterId(),
];

// 创建身份链接管理对象
export const createClient = (whitelist?: string[]) => {
    whitelist = whitelist ?? getWhitelist();
    whitelist = [...whitelist, ...ALL_COLLECTIONS];
    whitelist = _.uniq(whitelist);

    initWhitelist(whitelist); // 记录初始化的白名单

    const derivationOrigin = getConnectDerivationOrigin();
    console.debug(`derivationOrigin ====> ${derivationOrigin}`);

    const astroXProvider = (window as any).icx
        ? new ICX({
              delegationModes: ['domain', 'global'],
              dev: isDev,
          })
        : new AstroX({
              delegationModes: ['domain', 'global'],
              dev: isDev,
          });
    const infinityProvider = new InfinityWallet();
    // 使用自定义的 II
    const iiProvider = new CustomInternetIdentity({
        windowOpenerFeatures: window.innerWidth < 768 ? undefined : getIIFrame(),
        derivationOrigin,
    });
    // 使用自定义的 Plug
    const plugProvider = new CustomPlugWallet();
    const nfidProvider = new CustomNFID({
        windowOpenerFeatures: window.innerWidth < 768 ? undefined : getIIFrame(),
        derivationOrigin,
    });
    const stoicProvider = new StoicWallet();

    console.debug('whitelist', whitelist);

    const globalProviderConfig = {
        appName: 'Yumi NFT Marketplace',
        dev: false,
        autoConnect: true,
        host: getConnectHost(),
        customDomain: derivationOrigin,
        whitelist,
    };

    return create({
        providers: [
            astroXProvider as any,
            infinityProvider,
            iiProvider,
            plugProvider,
            nfidProvider,
            stoicProvider,
        ],
        globalProviderConfig,
    });
};

// 检查登录信息是否正确
export const checkConnected = (
    last: ConnectedIdentity | undefined,
    {
        isConnected,
        principal,
        provider,
    }: {
        isConnected: boolean;
        principal: string | undefined;
        provider: IConnector | undefined;
    },
    callback: () => void, // 只要有效就执行
    handleIdentity: (identity: ConnectedIdentity) => Promise<void>, // 新的身份要处理
    err?: () => void,
) => {
    const failed = () => err && err(); // 错误回调
    if (!isConnected) return failed();
    if (!principal || !isPrincipalText(principal)) return failed();
    if (!provider) return failed();
    // console.warn('🚀 ~ file: connect.ts:74 ~ provider:', provider);
    let connectType = provider.meta.id;
    if (['astrox', 'icx'].includes(connectType)) connectType = 'me';
    if (!['ii', 'plug', 'me', 'infinity', 'nfid', 'stoic'].includes(connectType)) {
        console.error(`what a provider id: ${connectType}`);
        return failed();
    }
    if (last?.principal === principal && last?.connectType === connectType) {
        // 防止重复加载导致的不断更新状态,相同的登录方式就不继续了
        callback();
        return;
    }
    const next: ConnectedIdentity = {
        connectType: connectType as ConnectType,
        principal,
        account: principal2account(principal),
        creator: getActorCreatorByActiveProvider(provider),
        requestWhitelist: (() => {
            switch (connectType) {
                case 'plug':
                    return async (whitelist: string[]) =>
                        provider['ic'].requestConnect({ whitelist }); // plug 再次请求白名单
                case 'infinity':
                    return async (whitelist: string[]) =>
                        provider['ic'].requestConnect({ whitelist }); // infinity 再次请求白名单
            }
            return async () => true;
        })(),
    };
    // console.warn('handle identity', last, next);
    handleIdentity(next).finally(callback);
};

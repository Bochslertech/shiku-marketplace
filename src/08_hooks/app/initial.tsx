import { useEffect } from 'react';
import { useConnect } from '@connect2ic/react';
import { shallow } from 'zustand/shallow';
import { ConnectedIdentity } from '@/01_types/identity';
import { FirstRender } from '@/02_common/react/render';
import { Spend } from '@/02_common/react/spend';
import { NFT_OGY } from '@/03_canisters/nft/special';
import { queryTokenExchangePriceList } from '@/05_utils/apis/yumi/api';
import { combinedQueryCorePlatformFee } from '@/05_utils/combined/yumi/core';
import { checkConnected } from '@/05_utils/connect/connect';
import { resetWhitelist } from '@/05_utils/connect/whitelist';
import { setLanguage } from '@/06_locales';
import { useAppStore } from '@/07_stores/app';
import { useCollectionStore } from '@/07_stores/collection';
import { useIdentityStore } from '@/07_stores/identity';

// 初始化语言
const initLanguage = () => {
    const current = useAppStore((s) => s.language);
    useEffect(() => setLanguage(current), []);
};

// 加载登录信息
const once_check_connected = new FirstRender(); // 只检查一次登录信息
const once_connected_identity_subscribe = new FirstRender(); // 只订阅一次身份变化
const initIdentity = () => {
    const connectedIdentity = useIdentityStore((s) => s.connectedIdentity, shallow);
    const setConnectedIdentity = useIdentityStore((s) => s.setConnectedIdentity);
    // 得到登录凭证后设置到缓存
    const handleIdentity = (identity: ConnectedIdentity) => setConnectedIdentity(identity);

    const {
        reloadIdentityProfile,
        reloadKycResult,
        reloadJwtToken,
        reloadFavorited,
        reloadShoppingCartItems,
        reloadByIdentity,
    } = useIdentityStore((s) => s);

    // const [jwtToken, setJwtToken] = useLocalStorage<string>('__yumi_jwt_token', '');
    // const [jwtTokenCorrect, setJwtTokenCorrect] = useState<boolean>(false);
    // // 获取jwt token并存在LocalStorage
    // useEffect(() => {
    //     // 验证 jwt token是否合法，合法则不获取，不合法则重新获取
    //     if (jwtToken) {
    //         verifyJwtTokenState(jwtToken).then(setJwtTokenCorrect).catch(console.error);
    //     }
    //     connectedIdentity &&
    //         !jwtTokenCorrect &&
    //         genJwtToken(connectedIdentity).then(setJwtToken).catch(console.error);
    // }, [connectedIdentity, jwtTokenCorrect, jwtToken]);

    // 获取登录状态
    const {
        isConnected,
        activeProvider: provider,
        principal,
    } = useConnect({
        onConnect: (connected: any) => {
            const principal = connected.principal;
            const provider = connected.activeProvider;
            // console.error('app onConnect', principal, provider);
            checkConnected(
                connectedIdentity,
                {
                    isConnected: true,
                    principal,
                    provider,
                },
                () => {},
                async (identity) => handleIdentity(identity),
            );
        },
        onDisconnect: () => setConnectedIdentity(undefined), // 退出登录
    });

    // 监听是否登录
    useEffect(
        once_check_connected.once(() => {
            checkConnected(
                connectedIdentity,
                {
                    isConnected,
                    principal,
                    provider,
                },
                () => {},
                async (identity) => handleIdentity(identity),
            );
        }),
        [],
    );

    // 订阅身份变化
    useEffect(
        once_connected_identity_subscribe.once(() => {
            useIdentityStore.subscribe(
                (s) => s.connectedIdentity,
                (nv, _ov) => {
                    // console.warn('connected identity changed', _ov, '->', nv);
                    if (nv) {
                        resetWhitelist(); // 重置白名单
                        // 身份变化后, 需要刷新信息
                        // 1. 先读取用户基本信息
                        Promise.all([reloadIdentityProfile(3), reloadKycResult()]).finally(() => {
                            // 2. 再读取用户收藏和购物车内容
                            Promise.all([
                                reloadJwtToken(2),
                                reloadFavorited(),
                                reloadShoppingCartItems(),
                            ]).finally(
                                () => reloadByIdentity(nv), // 3. 最后刷新其他内容
                            );
                        });
                    }
                },
                {
                    equalityFn: (nv, ov) =>
                        nv === ov ||
                        (!!ov &&
                            ov.connectType === nv?.connectType &&
                            ov.principal === nv?.principal),
                },
            );
        }),
        [],
    );
};

// 每次刷新后台默认加载最新的 Collection 信息
const once_load_collection_list = new FirstRender();
const initCollectionList = () => {
    const {
        reloadCoreCollectionIdList,
        reloadArtistCollectionIdList,
        reloadOrigynArtCollectionIdList,
        reloadCoreCollectionDataList,
        reloadArtistCollectionDataList,
    } = useCollectionStore((s) => s);

    useEffect(
        once_load_collection_list.once(() => {
            // ! 查询并保存 id 信息 // ! 加载数据信息
            const spend_load = Spend.start('load collection id and data list');
            Promise.all([
                // * 1. 加载二级市场的罐子 id
                reloadCoreCollectionIdList(),
                reloadArtistCollectionIdList(),
                reloadOrigynArtCollectionIdList(),
                // * 2. 加载二级市场罐子的数据信息
                reloadCoreCollectionDataList(),
                reloadArtistCollectionDataList(),
                // 检查 nft 罐子是否升级了 正式运行不需要
                // checkOgyCanisterModule(), // ogy
                // checkCccCanisterModule(), // ccc
                // checkYumiCoreCanisterModule(), // yumi core
                // checkYumiKycCanisterModule(), // yumi kyc
                // checkYumiOrigynArtCanisterModule(), // yumi origyn art
            ]).then((d) => {
                spend_load.mark();
                const origynArtCollectionIdList = d[2];
                // console.warn(
                //     `🚀 ~ file: app.tsx:147 ~ ]).then ~ origynArtCollectionIdList:`,
                //     canister_id_yumi_origyn_art,
                //     origynArtCollectionIdList,
                // );
                for (const canister_id of origynArtCollectionIdList) {
                    if (!NFT_OGY.includes(canister_id)) {
                        throw new Error(
                            `canister ${canister_id} is OGY canister, must be in NFT_OGY`,
                        );
                    }
                }
            });
        }),
        [],
    );
};

// 初始化一些信息
export const initTokenUsdRateAndPlatformFee = () => {
    const { setIcpUsd, setOgyUsd, setYumiPlatformFee } = useAppStore((s) => s);

    useEffect(() => {
        // 1. 汇率
        queryTokenExchangePriceList().then((d) => {
            for (const item of d) {
                switch (item.symbol) {
                    case 'ICP':
                        setIcpUsd(item.price);
                        continue;
                    case 'OGY':
                        setOgyUsd(item.price);
                        continue;
                }
            }
        });
        // 2. 平台费
        combinedQueryCorePlatformFee().then(setYumiPlatformFee);
    }, []);
};

// 综合要初始化的动作
export const initial = () => {
    // 初始化语言
    initLanguage();

    // 加载登录信息
    initIdentity();

    // 每次刷新后台默认加载最新的 Collection 信息
    initCollectionList();

    // 每次刷新汇率信息
    initTokenUsdRateAndPlatformFee();
};

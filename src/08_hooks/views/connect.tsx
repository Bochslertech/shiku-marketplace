import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useNavigationType } from 'react-router-dom';
import { useConnect } from '@connect2ic/react';
import { shallow } from 'zustand/shallow';
import { ConnectedIdentity, ConnectedRecord, ConnectType } from '@/01_types/identity';
import { FirstRender, FirstRenderWithData } from '@/02_common/react/render';
import { registerUser } from '@/03_canisters/yumi/yumi_core';
import { writeKycPrompted, writeLastConnectType } from '@/05_utils/app/storage';
import { getYumiCoreCanisterId } from '@/05_utils/canisters/yumi/special';
import { checkConnected } from '@/05_utils/connect/connect';
import { resetWhitelist } from '@/05_utils/connect/whitelist';
import { connectedRecordsStored } from '@/05_utils/stores/connected.stored';
import { useConnectedStore } from '@/07_stores/connected';
import { useDeviceStore } from '@/07_stores/device';
import { useIdentityStore } from '@/07_stores/identity';

const CONNECTED_TYPES: ConnectType[] = ['me', 'infinity', 'ii', 'plug', 'nfid', 'stoic'];
const MOBILE_HIDDEN_CONNECTED_TYPES: ConnectType[] = ['infinity', 'plug'];

type ConnectRecord = {
    type: ConnectType;
    connectIdentities: number;
    allConnectTimes: number;
    latestPrincipal: string;
    latestTimestamp: number;
};

// 登录逻辑
export const useConnectHooks = (): {
    records: ConnectRecord[];
    onConnect: (type: ConnectType) => void;
} => {
    const navigate = useNavigate();
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    const [once_clicked_connect_type] = useState(
        new FirstRenderWithData<ConnectType | undefined>(undefined),
    ); // 记录下上次点击的登录类型
    // 第一次加载重置登录信息,重置加载身份
    useEffect(() => once_clicked_connect_type.set(undefined), []);

    const [connectedRecords, setConnectedRecords] = useState<ConnectedRecord[]>([]);
    useEffect(() => {
        connectedRecordsStored.getItem().then(setConnectedRecords);
    }, []);

    // 统计记录的登录信息
    const records: ConnectRecord[] = useMemo(() => {
        return CONNECTED_TYPES.map((type) => {
            const records = connectedRecords.filter((r) => r.connectType === type);
            const latest =
                records.length === 0
                    ? undefined
                    : records.length === 1
                    ? records[0]
                    : records.reduce((p, c) => (p.timestamp <= c.timestamp ? c : p));
            return {
                type,
                connectIdentities: records.filter(
                    (v, i, a) =>
                        a.findIndex(
                            (vv) =>
                                vv.connectType === v.connectType && vv.principal === v.principal,
                        ) === i, // distinct
                ).length,
                allConnectTimes: records.length,
                latestPrincipal: latest?.principal ?? '--',
                latestTimestamp: latest?.timestamp ?? 0,
            };
        }).filter((r) => !isMobile || !MOBILE_HIDDEN_CONNECTED_TYPES.includes(r.type));
    }, [connectedRecords, isMobile]);
    // 获取上次登录的方式, 可能不存在
    // const latestContentType: ConnectType | undefined = getLatestConnectType(connectRecords);

    // 用户登录信息
    const noticeConnectedRecordsFlag = useConnectedStore((s) => s.noticeConnectedRecordsFlag);
    const registered = useConnectedStore((s) => s.registered);
    const backend_canister_id_yumi_core = getYumiCoreCanisterId();
    const addRegistered = useConnectedStore((s) => s.addRegistered);
    const connectedIdentity = useIdentityStore((s) => s.connectedIdentity, shallow);
    const setConnectedIdentity = useIdentityStore((s) => s.setConnectedIdentity);
    const navigateType = useNavigationType();
    // console.error('navigateType', navigateType);
    const logon = () => {
        // console.error('logon', navigateType, navigateType === 'POP');
        if (navigateType === 'POP') navigate('/'); // 进入主页
        else navigate(-1); // 上一页
    };
    const handleIdentity = (identity: ConnectedIdentity) => {
        writeKycPrompted(identity.principal, false);
        // console.warn('🚀 ~ file: index.tsx:53 ~ handleIdentity ~ identity:', identity);
        setConnectedIdentity(identity); // 得到登录凭证后设置到缓存
        resetWhitelist(); // 重置白名单
        once_clicked_connect_type.execute(
            (current) => current === identity.connectType, // 说明是本次点击而登录的,就要加入登录记录
            () => {
                writeLastConnectType(identity.connectType); // 保存本次登录类型，刷新页面后 Plug 需要使用
                connectedRecordsStored
                    .setItem([
                        ...connectedRecords,
                        {
                            connectType: identity.connectType,
                            principal: identity.principal,
                            timestamp: Date.now(),
                        },
                    ])
                    .then(noticeConnectedRecordsFlag);
            },
        );
    };
    const {
        isConnected,
        connect,
        activeProvider: provider,
        principal,
        // disconnect,
    } = useConnect({
        onConnect: (connected: any) => {
            const principal = connected.principal;
            const provider = connected.activeProvider;
            // console.error('onConnect', principal, provider);
            checkConnected(
                connectedIdentity,
                {
                    isConnected: true,
                    principal,
                    provider,
                },
                logon,
                async (identity) => {
                    // 拿到新身份要进行注册
                    if (
                        registered[backend_canister_id_yumi_core]?.[identity.principal] ===
                        undefined
                    ) {
                        // ! 这是阻塞等待注册成功
                        // // 如果遇到了没注册,就去注册
                        // const key = 'registered';
                        // message.loading({
                        //     content: 'loading your account',
                        //     duration: 0,
                        //     key,
                        // });
                        // try {
                        //     console.log(
                        //         'register 1',
                        //         backend_canister_id_yumi_core,
                        //         identity.principal,
                        //     );
                        //     const result = await registerUser(
                        //         identity,
                        //         backend_canister_id_yumi_core,
                        //         identity.principal,
                        //     );
                        //     console.log(
                        //         'register 2',
                        //         backend_canister_id_yumi_core,
                        //         identity.principal,
                        //     );
                        //     addRegistered(backend_canister_id_yumi_core, identity.principal); // 加入记录,下次不注册了
                        //     message.success({
                        //         content: 'your account is loaded',
                        //         duration: result ? 3 : 0.01, // 第一次注册显示时间长一点
                        //         key,
                        //     });
                        // } catch (e) {
                        //     console.error('registered register failed', e);
                        //     message.error({
                        //         content: `register failed: ${e}`,
                        //         duration: 3,
                        //         onClose: () => window.location.reload(), // 强制刷新一下
                        //         key,
                        //     });
                        // }

                        // ! 这是不阻塞注册
                        registerUser(
                            identity,
                            backend_canister_id_yumi_core,
                            identity.principal,
                        ).then(() => {
                            addRegistered(backend_canister_id_yumi_core, identity.principal); // 加入记录,下次不注册了
                        });
                    }
                    handleIdentity(identity);
                },
            );
        },
        onDisconnect: () => setConnectedIdentity(undefined), // 退出登录
    });
    const [once_check_connected] = useState(new FirstRender()); // 只检查一次登录信息
    useEffect(
        once_check_connected.once(() => {
            checkConnected(
                connectedIdentity,
                {
                    isConnected,
                    principal,
                    provider,
                },
                logon,
                async (identity) => {
                    handleIdentity(identity);
                },
            );
        }),
        [],
    );

    // 进行登录
    const onConnect = (type: ConnectType) => {
        once_clicked_connect_type.set(type);
        let anchor: string = type;
        if (anchor === 'me') anchor = (window as any).icx ? 'icx' : 'astrox';
        console.log('connect anchor =>', anchor);
        connect(anchor);
    };

    return { records, onConnect };
};

import { useEffect } from 'react';
import { Modal } from 'antd';
import { useConnect } from '@connect2ic/react';
import { useLocalStorage } from 'usehooks-ts';
import { SupportedBackend } from '@/01_types/app';
import {
    getYumiApi2Host,
    getYumiApiHost,
    getYumiAwsHost,
    getYumiKycHost,
} from '@/05_utils/apis/yumi/special';
import { getInitialBackendType } from '@/05_utils/app/backend';
import { getBuildMode, getConnectDerivationOrigin } from '@/05_utils/app/env';
import { BACKEND_TYPE, writeLastConnectType } from '@/05_utils/app/storage';
import {
    getLedgerIcpCanisterId,
    getLedgerOgyCanisterId,
} from '@/05_utils/canisters/ledgers/special';
import {
    getYumiApplicationCanisterId,
    getYumiArtistRouterCanisterId,
    getYumiCccProxyCanisterId,
    getYumiCoreCanisterId,
    getYumiCreditPointsCanisterId,
    getYumiJwtTokenCanisterId,
    getYumiOatCanisterId,
    getYumiOrigynArtCanisterId,
    getYumiOrigynArtProposalCanisterId,
    getYumiShikuLandsCollection,
    getYumiUserRecordCanisterId,
} from '@/05_utils/canisters/yumi/special';
import { useAppStore } from '@/07_stores/app';
import { useIdentityStore } from '@/07_stores/identity';

const showCanisterId = (canister_id: string) => {
    return (
        <a href={`https://icscan.io/canister/${canister_id}`} target="_blank">
            {canister_id}
        </a>
    );
};

// 支持切换的后端类型
const BACKEND_TYPES: SupportedBackend[] = ['production', 'staging', 'test'];
let nextBackendType: SupportedBackend | '' = '';
const { confirm } = Modal;
const showBackendTypeConfirm = (onOk: () => void, onCancel: () => void) => {
    confirm({
        title: '警告',
        content: '确定切换后端罐子? 将会注销并刷新页面',
        onOk,
        onCancel,
        className: 'hack-settings-backend-modal',
    });
};

function Settings() {
    // ==================== 主题颜色设置 ====================
    const theme = useAppStore((s) => s.theme);
    const setTheme = useAppStore((s) => s.setTheme);

    // ==================== 后端类型 ====================
    const setConnectedIdentity = useIdentityStore((s) => s.setConnectedIdentity);
    const { disconnect } = useConnect({
        onDisconnect: () => setConnectedIdentity(undefined),
    });

    // 后端模式
    // ! 只有在 development 构建模式下才支持切换
    const mode = getBuildMode();
    const [backendType, setBackendType] = useLocalStorage<SupportedBackend>(
        BACKEND_TYPE,
        getInitialBackendType(),
    );
    const saveBackendType = (backend: SupportedBackend) => {
        nextBackendType = backend;
        // 弹出确认框提示一下
        showBackendTypeConfirm(
            () => {
                writeLastConnectType('');
                disconnect();
                setBackendType(backend);
            },
            () => (nextBackendType = ''),
        );
    };
    useEffect(() => {
        // console.log('hack info', backendType, '<===>', nextBackendType);
        if (nextBackendType === backendType) setTimeout(() => location.reload(), 0);
    }, [backendType]);

    const derivationOrigin = getConnectDerivationOrigin();

    const backend_canister_id_ledger_icp = getLedgerIcpCanisterId();
    const backend_canister_id_ledger_ogy = getLedgerOgyCanisterId();

    const backend_canister_id_yumi_core = getYumiCoreCanisterId();
    const backend_canister_id_yumi_credit_points = getYumiCreditPointsCanisterId();
    const backend_canister_id_yumi_artist_router = getYumiArtistRouterCanisterId();
    const backend_canister_id_yumi_user_record = getYumiUserRecordCanisterId();
    const backend_canister_id_yumi_origyn_art = getYumiOrigynArtCanisterId();
    const backend_canister_id_yumi_origyn_art_proposal = getYumiOrigynArtProposalCanisterId();
    const backend_canister_id_yumi_ccc_proxy = getYumiCccProxyCanisterId();
    const backend_canister_id_yumi_application = getYumiApplicationCanisterId();
    const backend_canister_id_yumi_oat = getYumiOatCanisterId();
    const backend_canister_id_yumi_shiku_lands = getYumiShikuLandsCollection();
    const backend_canister_id_yumi_jwt_token = getYumiJwtTokenCanisterId();

    const backend_host_yumi_api = getYumiApiHost();
    const backend_host_yumi_api2 = getYumiApi2Host();
    const backend_host_yumi_kyc = getYumiKycHost();
    const backend_host_yumi_aws = getYumiAwsHost();

    return (
        <div className="hack-settings">
            <h1>Settings</h1>
            <div className="item theme">
                <div className="label">当前主题</div>
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                    className="text-black"
                >
                    {['light', 'dark'].map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>
            <div className="item backend-type">
                <div className="label">当前后端</div>
                {['production', 'staging', 'test'].includes(mode) ? (
                    mode
                ) : (
                    <select
                        className={backendType}
                        value={backendType}
                        onChange={(e) => saveBackendType(e.target.value as SupportedBackend)}
                    >
                        {BACKEND_TYPES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            <div className="item derivation-origin">
                <div className="label">登录锚点</div>
                {derivationOrigin ? (
                    <div>
                        <a href={derivationOrigin}>{derivationOrigin}</a>
                    </div>
                ) : (
                    <div>无</div>
                )}
            </div>
            <div className="item canister-ledger-icp">
                <div className="label">ICP罐子</div>
                <div>{showCanisterId(backend_canister_id_ledger_icp)}</div>
            </div>
            <div className="item canister-ledger-ogy">
                <div className="label">OGY罐子</div>
                <div>{showCanisterId(backend_canister_id_ledger_ogy)}</div>
            </div>
            <div className="item canister-yumi-core">
                <div className="label">核心罐子</div>
                <div>{showCanisterId(backend_canister_id_yumi_core)}</div>
            </div>
            <div className="item canister-yumi-credit-points">
                <div className="label">积分罐子</div>
                <div>{showCanisterId(backend_canister_id_yumi_credit_points)}</div>
            </div>
            <div className="item canister-yumi-artist-router">
                <div className="label">Art罐子</div>
                <div>{showCanisterId(backend_canister_id_yumi_artist_router)}</div>
            </div>
            <div className="item canister-yumi-user-record">
                <div className="label">用户罐子</div>
                <div>{showCanisterId(backend_canister_id_yumi_user_record)}</div>
            </div>
            <div className="item canister-yumi-origyn art">
                <div className="label">Co-owned</div>
                <div>{showCanisterId(backend_canister_id_yumi_origyn_art)}</div>
            </div>
            <div className="item canister-yumi-origyn art-proposal">
                <div className="label">OGY Proposal</div>
                <div>{showCanisterId(backend_canister_id_yumi_origyn_art_proposal)}</div>
            </div>
            <div className="item canister-yumi-ccc-proxy">
                <div className="label">CCC Proxy</div>
                <div>{showCanisterId(backend_canister_id_yumi_ccc_proxy)}</div>
            </div>
            <div className="item canister-yumi-application">
                <div className="label">Apply</div>
                <div>{showCanisterId(backend_canister_id_yumi_application)}</div>
            </div>
            <div className="item canister-yumi-oat">
                <div className="label">OAT</div>
                <div>{showCanisterId(backend_canister_id_yumi_oat)}</div>
            </div>
            <div className="item canister-yumi-shiku-lands">
                <div className="label">ShikuLands</div>
                <div>{showCanisterId(backend_canister_id_yumi_shiku_lands)}</div>
            </div>
            <div className="item canister-yumi-jwt-token">
                <div className="label">JwtToken</div>
                <div>{showCanisterId(backend_canister_id_yumi_jwt_token)}</div>
            </div>
            <div className="item host-yumi-api">
                <div className="label">API后端</div>
                <div>{backend_host_yumi_api}</div>
            </div>
            <div className="item host-yumi-api2">
                <div className="label">API2后端</div>
                <div>{backend_host_yumi_api2}</div>
            </div>
            <div className="item host-yumi-kyc">
                <div className="label">KYC后端</div>
                <div>{backend_host_yumi_kyc}</div>
            </div>
            <div className="item host-yumi-aws">
                <div className="label">AWS后端</div>
                <div>{backend_host_yumi_aws}</div>
            </div>
        </div>
    );
}

export default Settings;

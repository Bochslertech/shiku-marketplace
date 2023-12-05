import { useConnect } from '@connect2ic/react';
import { writeLastConnectType } from '@/05_utils/app/storage';
import { useIdentityStore } from '@/07_stores/identity';

function Information() {
    const connectedIdentity = useIdentityStore((s) => s.connectedIdentity);
    const setConnectedIdentity = useIdentityStore((s) => s.setConnectedIdentity);
    const { disconnect } = useConnect({
        onDisconnect: () => setConnectedIdentity(undefined),
    });

    const icpBalance = useIdentityStore((s) => s.icpBalance);
    const ogyBalance = useIdentityStore((s) => s.ogyBalance);
    const creditPoints = useIdentityStore((s) => s.creditPoints);

    const kycResult = useIdentityStore((s) => s.kycResult);

    return (
        <div className="hack-information">
            <h1>Information</h1>
            <div className="item connected-identity">
                <div className="label">登录身份</div>
                <div className="value">
                    {connectedIdentity ? (
                        <>
                            <span>{`${connectedIdentity.principal} (${connectedIdentity.connectType})`}</span>
                            <button
                                className="logout"
                                onClick={() => {
                                    writeLastConnectType('');
                                    disconnect();
                                }}
                            >
                                注销
                            </button>
                        </>
                    ) : (
                        <span>未登录</span>
                    )}
                </div>
            </div>
            <div className="item balance-icp">
                <div className="label">ICP余额</div>
                <div className="value">
                    {icpBalance ? (
                        <span>{`${Number(icpBalance.e8s) / 1e8} ICP`}</span>
                    ) : (
                        <span>--</span>
                    )}
                </div>
            </div>
            <div className="item balance-ogy">
                <div className="label">OGY余额</div>
                <div className="value">
                    {ogyBalance ? (
                        <span>{`${Number(ogyBalance.e8s) / 1e8} OGY`}</span>
                    ) : (
                        <span>--</span>
                    )}
                </div>
            </div>
            <div className="item balance-credit-point">
                <div className="label">信用积分</div>
                <div className="value">
                    {creditPoints ? (
                        <span>{`${Number(creditPoints.e8s) / 1e8}`}</span>
                    ) : (
                        <span>--</span>
                    )}
                </div>
            </div>
            <div className="item kyc-level">
                <div className="label">KYC结果</div>
                <div className="value">
                    {kycResult ? <span>{JSON.stringify(kycResult)}</span> : <span>--</span>}
                </div>
            </div>
        </div>
    );
}

export default Information;

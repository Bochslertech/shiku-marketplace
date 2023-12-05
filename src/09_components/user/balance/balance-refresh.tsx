import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { SupportedLedgerTokenSymbol } from '@/01_types/canisters/ledgers';
import { cn } from '@/02_common/cn';
import { thousandCommaOnlyInteger } from '@/02_common/data/numbers';
import { getTokenDecimals } from '@/05_utils/canisters/ledgers/special';
import { useIdentityStore } from '@/07_stores/identity';
import YumiIcon from '@/09_components/ui/yumi-icon';
import TokenPrice from '../../data/price';
import message from '../../message';
import SkeletonTW from '../../ui/skeleton';

export default function BalanceRefresh({ symbol }: { symbol?: SupportedLedgerTokenSymbol }) {
    const { connectedIdentity, reloadIcpBalance, reloadOgyBalance, e8sOgy, e8sIcp } =
        useIdentityStore(
            (s) => ({
                connectedIdentity: s.connectedIdentity,
                reloadIcpBalance: s.reloadIcpBalance,
                reloadOgyBalance: s.reloadOgyBalance,
                e8sIcp: s.icpBalance?.e8s,
                e8sOgy: s.ogyBalance?.e8s,
            }),
            shallow,
        );
    // 刷新钱包余额
    const [balanceLoading, setBalanceLoading] = useState(false); // 防止重复点击

    const reloadBalance = () => {
        if (connectedIdentity === undefined) return; // 未登录,不理会
        if (balanceLoading) return; // 防止重复点击
        setBalanceLoading(true);
        Promise.all([reloadIcpBalance(), reloadOgyBalance()])
            .catch((e) => message.error(`${e}`))
            .finally(() => setBalanceLoading(false));
    };

    useEffect(() => {
        reloadBalance();
    }, []);

    const e8s = symbol === 'OGY' ? e8sOgy : e8sIcp;

    return (
        <div className="flex items-center gap-x-[10px] font-inter-semibold text-[12px] leading-tight text-[#666666] ">
            <div>Balance:</div>
            {symbol ? (
                <div className="flex items-end space-x-1 font-inter-bold text-[22px]">
                    {e8s ? (
                        <TokenPrice
                            className="font-inter-bold text-[14px] leading-tight text-black md:text-[14px]"
                            value={{
                                value: e8s,
                                decimals: { type: 'exponent', value: getTokenDecimals(symbol) },
                                scale: 2,
                                paddingEnd: 2,
                                thousand: {
                                    comma: true,
                                    commaFunc: thousandCommaOnlyInteger,
                                },
                            }}
                        />
                    ) : (
                        <SkeletonTW className="!h-[16px] !w-[70px]" />
                    )}
                    <span className="font-inter-bold text-[14px]">{symbol}</span>
                </div>
            ) : (
                <div className="flex gap-x-[10px]">
                    {' '}
                    <div className="flex items-end space-x-1 font-inter-bold text-[22px]">
                        {e8sIcp ? (
                            <TokenPrice
                                className="font-inter-bold text-[14px] leading-tight text-black md:text-[14px]"
                                value={{
                                    value: e8sIcp,
                                    decimals: { type: 'exponent', value: getTokenDecimals('ICP') },
                                    scale: 2,
                                    paddingEnd: 2,
                                    thousand: {
                                        comma: true,
                                        commaFunc: thousandCommaOnlyInteger,
                                    },
                                }}
                            />
                        ) : (
                            <SkeletonTW className="!h-[16px] !w-[70px]" />
                        )}
                        <span className="font-inter-bold text-[14px]">ICP</span>
                    </div>
                    <div className="flex items-end space-x-1 font-inter-bold text-[22px]">
                        {e8sOgy ? (
                            <TokenPrice
                                className="font-inter-bold text-[14px] leading-tight text-black md:text-[14px]"
                                value={{
                                    value: e8sOgy,
                                    decimals: { type: 'exponent', value: getTokenDecimals('OGY') },
                                    scale: 2,
                                    paddingEnd: 2,
                                    thousand: {
                                        comma: true,
                                        commaFunc: thousandCommaOnlyInteger,
                                    },
                                }}
                            />
                        ) : (
                            <SkeletonTW className="!h-[16px] !w-[70px]" />
                        )}
                        <span className="font-inter-bold text-[14px]">OGY</span>
                    </div>
                </div>
            )}
            <YumiIcon
                name="action-refresh"
                color="#999999"
                className={cn('cursor-pointer', balanceLoading && 'animate-spin')}
                onClick={reloadBalance}
            />
        </div>
    );
}

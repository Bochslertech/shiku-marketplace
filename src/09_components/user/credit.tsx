import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { LedgerTokenBalance } from '@/01_types/canisters/ledgers';
import { string2bigint } from '@/02_common/types/bigint';
import { queryCreditPointsByAccount } from '@/05_utils/canisters/yumi/credit_points';
import { useIdentityStore } from '@/07_stores/identity';
import message from '@/09_components/message';
import Tooltip from '@/09_components/ui/tooltip';

function Credit({
    account,
    className,
    hasLabel = true,
}: {
    account: string;
    className?: string;
    hasLabel?: boolean;
}) {
    // 记录信用积分
    const [creditPointsLoading, setCreditPointsLoading] = useState(false);
    const [creditPoints, setCreditPoints] = useState<LedgerTokenBalance | undefined>(undefined);
    // 记录kyc结果

    const connectedIdentity = useIdentityStore((s) => s.connectedIdentity);
    const self = account === connectedIdentity?.account;
    const selfCreditPoints = useIdentityStore((s) => s.creditPoints); // 当前用户
    const reloadSelfCreditPoints = useIdentityStore((s) => s.reloadCreditPoints);

    // const deviceInfo = useDeviceStore((s) => s.deviceInfo);

    useEffect(() => {
        // 判断要不要查询积分
        setCreditPointsLoading(true);
        (async (): Promise<LedgerTokenBalance> => {
            if (self && selfCreditPoints !== undefined) return selfCreditPoints;
            return await queryCreditPointsByAccount(account);
        })()
            .then(
                (creditPoints) => {
                    if (self && creditPoints !== selfCreditPoints) reloadSelfCreditPoints();
                    setCreditPoints(creditPoints);
                },
                (e) => message.error(`fetch credit points info failed: ${e.message}`),
            )
            .finally(() => setCreditPointsLoading(false));
    }, [account]);

    return (
        <div className={className}>
            {hasLabel && (
                <div className="whitespace-nowrap font-inter-bold text-[10px] leading-4 text-black md:text-[14px]">
                    Yumi Credit:
                </div>
            )}
            <div className="flex items-center justify-center gap-x-[9px]">
                <img
                    className="h-[12px] w-[12px] md:h-[16px] md:w-[16px]"
                    src={'/img/sidebar/diamond.svg'}
                ></img>
                <div className="font-inter-bold text-[12px] leading-tight md:text-[16px]">
                    {!creditPointsLoading && creditPoints
                        ? Number(formatUnits(string2bigint(creditPoints.e8s), 8)).toFixed(2)
                        : '--'}
                </div>

                <Tooltip
                    title={
                        <span className="whitespace-pre-wrap text-[12px] leading-tight">
                            We reward you as our loyal customers. Yumi credit provides you
                            opportunities for airdrop, and access to exclusive events and
                            activities.
                        </span>
                    }
                >
                    <img
                        className="h-[12px] w-[12px] cursor-pointer md:h-[16px] md:w-[16px]"
                        src={'/img/sidebar/tooltip-credit.svg'}
                    ></img>
                </Tooltip>
            </div>
        </div>
    );
}

export default Credit;

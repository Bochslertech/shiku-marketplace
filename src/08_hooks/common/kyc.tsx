import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryKycResultByPrincipal } from '@/05_utils/apis/yumi/kyc';
import { useIdentityStore } from '@/07_stores/identity';

type KycOption = {
    level?: string | string[];
    pay_usd?: number;
    before?: () => void;
    requirement?: boolean;
    after?: () => void;
};

export const useCheckKyc = (): ((option?: KycOption) => Promise<boolean>) => {
    const navigate = useNavigate();

    const identity = useIdentityStore((s) => s.connectedIdentity);
    const kycResult = useIdentityStore((s) => s.kycResult);

    return useCallback(
        async ({
            level,
            pay_usd,
            before,
            requirement,
            after,
        }: KycOption = {}): Promise<boolean> => {
            if (before) before();

            const passed = await (async () => {
                if (!level) level = ['Tier1', 'Tier2', 'Tier3'];
                if (typeof level === 'string') level = [level];

                if (!identity) return false;

                const kyc = kycResult ?? (await queryKycResultByPrincipal(identity.principal));

                const kyc_level = kyc?.level;

                const matched = level.includes(kyc_level);
                if (!matched) return false;
                if (pay_usd === undefined) return true;

                // 检查是否还有交易额度
                return kyc.used + pay_usd < kyc.quota;
            })();

            if (requirement && !passed) {
                navigate('/kyc/introduction');
                throw new Error(`KYC is Requirement.`);
            }

            if (after) after();

            return passed;
        },
        [identity, kycResult],
    );
};

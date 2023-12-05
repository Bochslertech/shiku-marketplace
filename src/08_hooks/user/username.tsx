import { useEffect, useState } from 'react';
import { isAccountHex } from '@/02_common/ic/account';
import { isPrincipalText } from '@/02_common/ic/principals';
import { getUserProfile } from '@/05_utils/stores/profile.stored';

export const useUsername = (
    principal_or_account: string | undefined,
): {
    principal: string | undefined;
    username: string | undefined;
    accountId: string | undefined;
} => {
    const [principal, setPrincipal] = useState<string | undefined>(undefined);
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [accountId, setAccountId] = useState<string | undefined>(undefined);
    useEffect(() => {
        if (principal_or_account === undefined) {
            setPrincipal(undefined);
            setUsername(undefined);
            return;
        }
        if (isAccountHex(principal_or_account)) {
            setAccountId(principal_or_account);
        }
        getUserProfile(principal_or_account).then((profile) => {
            setPrincipal(
                profile?.principal ??
                    (isPrincipalText(principal_or_account) ? principal_or_account : undefined),
            );
            setUsername(profile?.username);
        });
    }, [principal_or_account]);
    return {
        principal,
        username,
        accountId,
    };
};

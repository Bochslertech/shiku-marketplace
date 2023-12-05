import { useState } from 'react';
import { Skeleton } from 'antd';
import { cdn, cdn_by_assets } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { isAccountHex } from '@/02_common/ic/account';
import { isPrincipalText } from '@/02_common/ic/principals';
import { AssureLink, AssureLinkByNavigate } from '@/02_common/react/link';
import { useUserAvatar } from '@/08_hooks/user/avatar';

function UserAvatar({
    principal_or_account,
    className,
}: {
    principal_or_account?: string;
    className?: string;
}) {
    const { principal, avatar } = useUserAvatar(principal_or_account);

    const [loading, setLoading] = useState<boolean>(true);

    const onLoaded = () => setLoading(false);
    return (
        <AssureLink
            to={
                isPrincipalText(principal)
                    ? `/profile/${principal}`
                    : isAccountHex(principal_or_account)
                    ? `/profile/${principal_or_account}`
                    : ''
            }
            className={`${className} flex h-full w-full `}
        >
            <img
                src={avatar ? cdn(avatar) : cdn_by_assets('/svgs/avatar-anonymous.svg')}
                onLoad={onLoaded}
                onError={onLoaded}
                className={cn('h-0 w-0', !loading && 'h-auto w-auto', className)}
            />
            {loading && (
                <Skeleton.Input active className="!h-full !w-full !min-w-0 !rounded-full " />
            )}
        </AssureLink>
    );
}

export default UserAvatar;

export function UserAvatarByNavigate({
    principal_or_account,
    className,
}: {
    principal_or_account?: string;
    className?: string;
}) {
    const { principal, avatar } = useUserAvatar(principal_or_account);

    const [loading, setLoading] = useState<boolean>(true);

    const onLoaded = () => setLoading(false);
    return (
        <AssureLinkByNavigate to={principal ? `/profile/${principal}` : ''}>
            <img
                src={cdn(avatar)}
                onLoad={onLoaded}
                onError={onLoaded}
                className={cn('visible', className, loading && 'invisible')}
            />
            {loading && (
                <Skeleton.Input active className="!h-full !w-full !min-w-0 !rounded-full " />
            )}
        </AssureLinkByNavigate>
    );
}

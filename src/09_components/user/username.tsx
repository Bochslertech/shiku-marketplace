import { cn } from '@/02_common/cn';
import { shrinkPrincipal } from '@/02_common/data/text';
import { AssureLink } from '@/02_common/react/link';
import { useUsername } from '@/08_hooks/user/username';

function Username({
    principal_or_account,
    className,
    openLink = true,
}: {
    principal_or_account?: string;
    className?: string;
    openLink?: boolean;
}) {
    const { principal, username, accountId } = useUsername(principal_or_account);

    return (
        <AssureLink
            to={openLink && principal ? `/profile/${principal}` : ''}
            className={cn([
                'w-full cursor-pointer truncate overflow-ellipsis text-[14px] text-gray-800',
                principal && className,
            ])}
        >
            {shrinkPrincipal(username ?? principal ?? accountId ?? '--')}
        </AssureLink>
    );
}

export default Username;

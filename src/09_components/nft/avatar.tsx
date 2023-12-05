import { useState } from 'react';
import { Skeleton } from 'antd';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { AssureLink } from '@/02_common/react/link';
import { useUserAvatar } from '@/08_hooks/user/avatar';

export const ShowNftOwnerAvatar = ({ card, link }: { card: NftMetadata; link: boolean }) => {
    const { principal, avatar } = useUserAvatar(card.owner.owner);

    const [loading, setLoading] = useState<boolean>(true);

    const onLoad = () => setLoading(false);

    return (
        <AssureLink to={principal && link ? `/profile/${principal}` : undefined}>
            <>
                {loading && (
                    <Skeleton.Image className="absolute top-0 !h-full !w-full !rounded-full" />
                )}
                {
                    <img
                        className={cn(
                            'invisible h-full w-full rounded-full',
                            !loading && 'visible',
                        )}
                        src={cdn(avatar)}
                        alt="avatar"
                        onLoad={onLoad}
                    />
                }
            </>
        </AssureLink>
    );
};

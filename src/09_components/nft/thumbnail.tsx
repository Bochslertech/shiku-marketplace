import { useState } from 'react';
import { Skeleton } from 'antd';
import { NftIdentifier, NftMetadata } from '@/01_types/nft';
import { cdn, cdn_by_resize } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { loadTokenMetadata } from '@/05_utils/nft/common';
import { getThumbnailByNftMetadata } from '@/05_utils/nft/metadata';
import { useCollectionDataList } from '@/08_hooks/nft/collection';
import AspectRatio from '../ui/aspect-ratio';

// !TODO: 骨架图
function NftThumbnail({
    token_id,
    metadata,
    cdn_width,
    width, // w-[100px] // !必须传 完整字符串
    imgClass,
}: {
    token_id: NftIdentifier;
    metadata?: NftMetadata;
    cdn_width?: number;
    width?: string;
    imgClass?: string;
}) {
    // const [loading, setLoading] = useState(false);
    const thumbnail = metadata !== undefined ? getThumbnailByNftMetadata(metadata) : undefined;

    const collectionDataList = useCollectionDataList();

    const selfMetadata: NftMetadata | undefined =
        metadata === undefined ? loadTokenMetadata(token_id, collectionDataList) : undefined;
    const selfThumbnail =
        selfMetadata !== undefined ? getThumbnailByNftMetadata(selfMetadata) : undefined;

    const wrappedThumbnail = thumbnail ?? selfThumbnail;
    const wrappedLoading = wrappedThumbnail === undefined;

    return (
        <div className={`${width}`}>
            <AspectRatio>
                {
                    // 加载中... 此时应该显示图片骨架图
                    wrappedLoading && (
                        <Skeleton.Input
                            className={cn('!h-full !w-full !min-w-0 !rounded-md', imgClass)}
                        />
                    )
                }
                {
                    // 初始化，无数据，不显示
                    !wrappedLoading && wrappedThumbnail === undefined && <></>
                }
                {
                    // 加载完成，展示数据
                    !wrappedLoading && wrappedThumbnail !== undefined && (
                        <div
                            className={cn(
                                'h-full w-full rounded-md bg-contain bg-center bg-no-repeat',
                                imgClass,
                            )}
                            style={{
                                backgroundImage: `url('${
                                    cdn_width
                                        ? cdn_by_resize(wrappedThumbnail, { width: cdn_width })
                                        : cdn(wrappedThumbnail)
                                }')`,
                            }}
                        />
                    )
                }
            </AspectRatio>
        </div>
    );
}

export default NftThumbnail;

export const ShowNftThumbnail = ({ card }: { card: NftMetadata }) => {
    const thumbnail = getThumbnailByNftMetadata(card);

    const [loading, setLoading] = useState<boolean>(true);

    const [aspectRatio, setAspectRatio] = useState<number>(1);
    const onLoad = (image: any) => {
        setLoading(false);
        setAspectRatio(image.naturalWidth / image.naturalHeight);
    };

    return (
        <>
            {loading && <Skeleton.Image className="absolute !h-full !w-full" />}
            {
                <img
                    src={cdn(thumbnail)}
                    className={cn(
                        '"rounded-[0px] bg-contain bg-center bg-no-repeat',
                        aspectRatio > 1 ? 'w-full' : 'h-full',
                        loading ? 'invisible' : 'visible',
                    )}
                    onLoad={onLoad}
                />
            }
        </>
    );
};

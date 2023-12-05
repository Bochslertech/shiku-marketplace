import { NftIdentifier, NftMetadata } from '@/01_types/nft';
import { UniqueCollectionData } from '@/01_types/yumi';
import { cn } from '@/02_common/cn';
import { shrinkText } from '@/02_common/data/text';
import { loadTokenMetadata } from '@/05_utils/nft/common';
import { getNameByNftMetadata } from '@/05_utils/nft/metadata';
import { useCollectionDataList } from '@/08_hooks/nft/collection';
import SkeletonTW from '../ui/skeleton';

function NftName({
    token_id,
    metadata,
    data,
    shrink_text,
    className,
}: {
    token_id: NftIdentifier;
    metadata?: NftMetadata;
    data?: UniqueCollectionData;
    shrink_text?: { prefix: number; suffix: number };
    className?: string;
}) {
    // const [loading, setLoading] = useState(false);
    const name = metadata !== undefined ? getNameByNftMetadata(metadata) : undefined;

    const collectionDataList = useCollectionDataList();

    const selfMetadata: NftMetadata | undefined =
        metadata === undefined
            ? loadTokenMetadata(token_id, [...collectionDataList, ...(data ? [data] : [])])
            : undefined;
    const selfName = selfMetadata !== undefined ? getNameByNftMetadata(selfMetadata) : undefined;

    const wrappedName = name ?? selfName;
    const wrappedLoading = wrappedName === undefined;
    return (
        <>
            {
                // 加载中...
                wrappedLoading && <SkeletonTW className={cn('!h-[20px] !w-full', className)} />
            }
            {
                // 初始化，无数据，不显示
                !wrappedLoading && wrappedName === undefined && <></>
            }
            {
                // 加载完成，展示数据
                !wrappedLoading && wrappedName !== undefined && (
                    <span
                        className={cn(
                            'overflow-hidden truncate whitespace-nowrap font-inter-semibold text-[14px] text-stress',
                            className,
                        )}
                    >
                        {shrink_text
                            ? shrinkText(wrappedName, shrink_text.prefix, shrink_text.suffix)
                            : wrappedName}
                    </span>
                )
            }
        </>
    );
}

export default NftName;

import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { cdn } from '@/02_common/cdn';
import { parse_token_identifier } from '@/02_common/nft/ext';

export const TypicalNftCard = ({ item }) => {
    return (
        <Link
            to={`/market/${item.collection}/${parse_token_identifier(
                item.collection,
                item.token_index,
            )}`}
        >
            <div className="flex flex-col">
                <div className="relative flex w-full pt-[100%]">
                    <img
                        className="absolute left-0 top-0 h-full w-full rounded-[8px] object-cover"
                        src={cdn(item.url)}
                        alt=""
                    />
                </div>
                <p className="mt-2 truncate text-[14px] font-semibold md:mt-4 md:text-[16px]">
                    {item.name}
                </p>
            </div>
        </Link>
    );
};

export const TypicalNftCardSkeleton = () => {
    return (
        <>
            <div className="flex flex-col">
                <Skeleton.Image className="!h-[180px] !w-full md:!h-[200px]" />
                <Skeleton.Input className=" mt-1 !h-4 !w-full !min-w-0 md:mt-2" />
            </div>
        </>
    );
};

import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';

const FilterSearch = ({
    className,
    search,
    setSearch,
    placeholder = 'Search by name',
}: {
    className?: string;
    search: string;
    setSearch: (value: string) => void;
    placeholder?: string;
}) => {
    const onChange = ({ target: { value } }) => {
        // value = value.trim(); // 空格也需要过滤
        if (value !== search) setSearch(value);
    };

    return (
        <div
            className={cn(
                [
                    'mr-[15px] flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[8px] bg-[#F6F6F6] md:mr-[27px]',
                ],
                className,
            )}
        >
            <img
                className="mx-[9px] my-[15px] block h-[14px] w-[14px] flex-shrink-0 cursor-pointer md:h-[16px] md:w-[16px]"
                src={cdn(
                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1690855901793_Frame (1).svg',
                )}
                alt=""
            />
            <input
                className="h-full w-full border-none bg-[#F6F6F6] font-inter text-[14px] font-medium text-[#000] placeholder:text-[#B6B6B6] focus:outline-none"
                placeholder={placeholder}
                onChange={onChange}
                value={search}
                type="text"
            />
        </div>
    );
};

export default FilterSearch;

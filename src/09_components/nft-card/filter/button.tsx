import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';

const FilterButton = ({
    open,
    setOpen,
    className,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                'flex h-[46px] w-[115px] cursor-pointer items-center justify-center rounded-[8px] bg-[#F6F6F6]',
                !open ? 'hover:bg-[#ebebeb]' : 'bg-[#ebebeb] hover:bg-[#F6F6F6]',
                className,
            )}
            onClick={() => setOpen(!open)}
        >
            <img
                className="block h-[17px] w-[17px] flex-shrink-0"
                src={cdn(
                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1690801266548_Frame.svg',
                )}
                alt=""
            />
            <div className="ml-[8px] font-inter text-[14px] font-bold text-[#000]">Filters</div>
        </div>
    );
};
export default FilterButton;

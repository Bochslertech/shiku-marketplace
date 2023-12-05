import { cn } from '@/02_common/cn';
import YumiIcon from '@/09_components/ui/yumi-icon';

export type NftGridType = 'middle' | 'small';

function NftCardGrid({
    grid,
    setGrid,
}: {
    grid: NftGridType;
    setGrid: (grid: NftGridType) => void;
}) {
    const onGrid = (type: NftGridType) => {
        if (grid === type) return;
        setGrid(type);
    };

    return (
        <div className="ml-[27px] hidden items-center gap-x-[15px] rounded-[8px] bg-[#f6f6f6] px-[15px] md:flex">
            <div
                className={cn(
                    'cursor-pointer rounded-[8px] px-[6px] py-[4px] opacity-50',
                    grid === 'middle' && 'bg-white',
                    grid === 'middle' && 'opacity-100',
                )}
                onClick={() => onGrid('middle')}
            >
                <YumiIcon name="grid-middle" />
            </div>

            <div
                className={cn(
                    'cursor-pointer rounded-[8px] px-[6px] py-[4px] opacity-50',
                    grid === 'small' && 'bg-white',
                    grid === 'small' && 'opacity-100',
                )}
                onClick={() => onGrid('small')}
            >
                <YumiIcon name="grid-small" className="scale-[1.2]" />
            </div>
        </div>
    );
}

export default NftCardGrid;

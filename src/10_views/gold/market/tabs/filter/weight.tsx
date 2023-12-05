import { useMemo } from 'react';
import { cn } from '@/02_common/cn';
import { GoldWeight } from '@/04_apis/yumi/gold-api';

function FilterGoldWeight({
    weight,
    setWeight,
}: {
    weight: GoldWeight;
    setWeight: (weight: GoldWeight) => void;
}) {
    const weights: { label: string; value: GoldWeight }[] = useMemo(() => {
        return [
            {
                label: '1g',
                value: '1',
            },
            {
                label: '10g',
                value: '10',
            },
            {
                label: '100g',
                value: '100',
            },
            {
                label: '1kg',
                value: '1000',
            },
        ];
    }, []);

    const onWeight = (w: GoldWeight) => {
        if (weight === w) return;
        setWeight(w);
    };

    return (
        <div className="flex">
            {weights.map((item) => {
                return (
                    <div
                        key={item.value}
                        className={cn(
                            `mr-[4px] flex h-[36px] w-[60px] cursor-pointer items-center justify-center rounded-[8px] lg:mr-[20px] lg:h-[46px] lg:w-[64px] lg:text-[16px] `,
                            weight === item.value
                                ? ' bg-[#000] font-inter-bold text-[#fff]'
                                : 'bg-[#f6f6f6] font-inter-medium ',
                        )}
                        onClick={() => onWeight(item.value)}
                    >
                        {item.label}
                    </div>
                );
            })}
        </div>
    );
}

export default FilterGoldWeight;

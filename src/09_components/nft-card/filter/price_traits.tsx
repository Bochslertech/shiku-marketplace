import { useEffect, useState } from 'react';
import { Checkbox, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { NftIdentifier, NftTokenMetadata } from '@/01_types/nft';
import { isValidNumber } from '@/02_common/data/numbers';
import { isSameNft } from '@/02_common/nft/identifier';

type FilterTraitValueCondition = {
    value: string;
    chosen: boolean;
    count: NftIdentifier[]; // 每种属性值对应的 NFT
};

type FilterTraitCondition = {
    name: string; // 属性名称
    expand: boolean; // 是否展开
    count: NftIdentifier[];
    values: FilterTraitValueCondition[];
    chosen?: string[]; // 用户选了哪些值
};

export type FilterPriceTraitsCondition = {
    listing?: boolean;
    price: {
        min: string; // 最小价格过滤
        max: string; // 最大价格过滤
    };
    traits: FilterTraitCondition[];
};

const getFilterCondition = (
    metadata: NftTokenMetadata[],
    chosen?: { name: string; value: string },
): FilterPriceTraitsCondition => {
    const traits: FilterTraitCondition[] = [];

    const push = (name: string, value: string, token_id: NftIdentifier) => {
        // 保证有这个属性
        let index = traits.findIndex((p) => p.name === name);
        if (index === -1) {
            traits.push({ name, expand: false, count: [], values: [] });
            index = traits.length - 1;
        }
        const trait = traits[index];

        // 该 NFT 加入统计
        if (!trait.count.find((t) => isSameNft(t, token_id))) trait.count.push(token_id);

        // 保证有这个属性值
        index = trait.values.findIndex((v) => v.value === value);
        if (index === -1) {
            trait.values.push({
                value,
                chosen: name === chosen?.name && value === chosen?.value, // 如果有初始值, 就表示选中
                count: [],
            });
            index = trait.values.length - 1;
        }
        const value_item = trait.values[index];

        // 该 NFT 加入统计
        if (!value_item.count.find((t) => isSameNft(t, token_id))) {
            value_item.count.push(token_id);
        }
    };

    for (const m of metadata) {
        if (m.metadata.traits.length) {
            for (const trait of m.metadata.traits) {
                if (trait.name && trait.value) {
                    push(trait.name.trim(), trait.value.trim(), m.token_id);
                }
            }
        }
    }

    return {
        price: { min: '', max: '' },
        traits,
    };
};

// 箭头
const ExpandArrow = ({ expand, ...props }: { expand: boolean }) => {
    return expand ? (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
            {...props}
        >
            <g clip-path="url(#clip0_663_16130)">
                <path
                    d="M12.1144 11.1419C12.1805 11.2159 12.2598 11.2748 12.3476 11.3151C12.4354 11.3553 12.5298 11.376 12.6251 11.376C12.7205 11.376 12.8149 11.3553 12.9027 11.3151C12.9904 11.2748 13.0697 11.2159 13.1358 11.1419C13.2718 10.9898 13.3477 10.787 13.3477 10.5759C13.3477 10.3648 13.2718 10.162 13.1358 10.0099L7.35842 3.61011C7.29232 3.53607 7.21301 3.47717 7.12526 3.43693C7.0375 3.3967 6.94311 3.37596 6.84773 3.37596C6.75235 3.37596 6.65796 3.3967 6.5702 3.43693C6.48245 3.47717 6.40314 3.53607 6.33704 3.61011L0.559615 10.0099C0.423667 10.1619 0.347717 10.3648 0.347717 10.5759C0.347717 10.787 0.423667 10.9898 0.559615 11.1419C0.625722 11.2159 0.70503 11.2748 0.792786 11.315C0.880541 11.3553 0.974938 11.376 1.07032 11.376C1.16569 11.376 1.26009 11.3553 1.34785 11.315C1.4356 11.2748 1.51491 11.2159 1.58102 11.1419L6.84773 5.30604L12.1144 11.1409L12.1144 11.1419Z"
                    fill="black"
                />
            </g>
            <defs>
                <clipPath id="clip0_663_16130">
                    <rect
                        width="14"
                        height="13"
                        fill="white"
                        transform="translate(0.347717 14.376) rotate(-90)"
                    />
                </clipPath>
            </defs>
        </svg>
    ) : (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
            {...props}
        >
            <g clip-path="url(#clip0_663_16168)">
                <path
                    d="M12.1144 3.79367C12.1805 3.71963 12.2598 3.66072 12.3476 3.62049C12.4354 3.58025 12.5298 3.55951 12.6251 3.55951C12.7205 3.55951 12.8149 3.58025 12.9027 3.62049C12.9904 3.66072 13.0697 3.71963 13.1358 3.79367C13.2718 3.94571 13.3477 4.14858 13.3477 4.35965C13.3477 4.57073 13.2718 4.77359 13.1358 4.92563L7.35842 11.3254C7.29232 11.3995 7.21301 11.4584 7.12526 11.4986C7.0375 11.5388 6.94311 11.5596 6.84773 11.5596C6.75235 11.5596 6.65796 11.5388 6.5702 11.4986C6.48245 11.4584 6.40314 11.3995 6.33704 11.3254L0.559615 4.92565C0.423667 4.7736 0.347717 4.57074 0.347717 4.35966C0.347717 4.14859 0.423667 3.94573 0.559615 3.79368C0.625722 3.71964 0.70503 3.66074 0.792786 3.6205C0.880541 3.58026 0.974938 3.55952 1.07032 3.55952C1.16569 3.55952 1.26009 3.58026 1.34785 3.6205C1.4356 3.66074 1.51491 3.71964 1.58102 3.79368L6.84773 9.62951L12.1144 3.79465L12.1144 3.79367Z"
                    fill="black"
                />
            </g>
            <defs>
                <clipPath id="clip0_663_16168">
                    <rect
                        width="14"
                        height="13"
                        fill="white"
                        transform="matrix(-4.37114e-08 1 1 4.37114e-08 0.347717 0.55957)"
                    />
                </clipPath>
            </defs>
        </svg>
    );
};

function FilterPriceTraits({
    condition,
    setCondition,
    metadata,
    chosen,
    setOpen,
}: {
    condition: FilterPriceTraitsCondition;
    setCondition: (condition: FilterPriceTraitsCondition) => void;
    metadata: NftTokenMetadata[] | undefined;
    chosen?: { name: string; value: string };
    setOpen: (open: boolean) => void;
}) {
    // status 是否展开
    const [statusExpand, setStatusExpand] = useState<boolean>(true);
    // price 是否展开
    const [priceExpand, setPriceExpand] = useState<boolean>(true);

    // 属性提取
    useEffect(() => {
        if (!metadata) return;
        setCondition({ ...getFilterCondition(metadata, chosen), price: condition.price });
    }, [metadata]);

    const [min, setMin] = useState(condition.price.min);
    const [max, setMax] = useState(condition.price.max);
    useEffect(() => {
        setMin(condition.price.min);
        setMax(condition.price.max);
    }, [condition]);

    const onMinChange = ({ target: { value } }) =>
        !isNaN(Number(value)) ? setMin(value) : message.error('please input a number value');
    const onMaxChange = ({ target: { value } }) =>
        !isNaN(Number(value)) ? setMax(value) : message.error('please input a number value');
    const onApply = () => {
        if (isValidNumber(min) && isValidNumber(max) && Number(max) < Number(min)) {
            return message.error('max must be greater than min');
        }
        setCondition({
            ...condition,
            price: {
                min: isValidNumber(min) ? min : '',
                max: isValidNumber(max) ? max : '',
            },
        });
    };

    const onExpandChange = (attribute: FilterTraitCondition) => {
        attribute.expand = !attribute.expand;
        setCondition({ ...condition, traits: [...condition.traits] });
    };
    const onValueChange = (value: FilterTraitValueCondition) => {
        value.chosen = !value.chosen;
        setCondition({ ...condition, traits: [...condition.traits] });
    };
    // list选中
    const onListingChange = (value: FilterPriceTraitsCondition) => {
        value.listing = !value.listing;
        setCondition({ ...condition, listing: value.listing });
    };
    if (!metadata) return <></>; // 没有元数据,也不用过滤了
    return (
        <div className="scrollbar-none fixed right-0 top-0 h-full w-full overflow-scroll border-[2px] border-common bg-white pb-[32px]  md:static md:h-auto md:w-[317px] md:rounded-[16px]">
            <div className="relative flex w-full justify-center border-b-[1px] border-[#00000026] py-[10px] md:hidden">
                <div className="font-inter-bold text-[18px]">Filters</div>
                <CloseOutlined
                    onClick={() => {
                        setOpen(false);
                    }}
                    className="!absolute right-[30px] top-0 flex !h-full items-center justify-center md:hidden"
                />
            </div>
            <div className="mt-[20px] px-[30px]">
                {' '}
                <div className="flex justify-between ">
                    <div className="font-inter-semibold text-[14px] ">Status</div>
                    <div
                        onClick={() => {
                            setStatusExpand((prev) => !prev);
                        }}
                        className="cursor-pointer"
                    >
                        <ExpandArrow expand={statusExpand} />
                    </div>
                </div>
                {statusExpand && (
                    <div className="mt-[25px] flex items-start justify-start gap-x-[15px]">
                        <Checkbox
                            checked={condition.listing}
                            onChange={() => onListingChange(condition)}
                            className="!h-[15px] !w-[15px]"
                            value={'listing'}
                        />
                        <div className="text-[12px] ">Listing</div>
                    </div>
                )}
                <div className="mt-[40px]">
                    <div className="flex justify-between ">
                        <div className="font-inter-semibold text-[14px] ">Price</div>
                        <div
                            onClick={() => {
                                setPriceExpand((prev) => !prev);
                            }}
                            className="cursor-pointer"
                        >
                            <ExpandArrow expand={priceExpand} />
                        </div>
                    </div>
                    {priceExpand && (
                        <>
                            <div className="mt-[27px] flex items-center justify-between">
                                <input
                                    className="h-[40px] w-[40%] rounded-[8px] border border-[#b6b6b6] px-[10px] text-center text-[12px] focus:border-black focus:outline-none"
                                    value={min}
                                    onChange={onMinChange}
                                    placeholder="Min"
                                />
                                <div className=" font-inter-semibold text-[12px] ">to</div>
                                <input
                                    className="h-[40px] w-[40%] rounded-[8px] border border-[#b6b6b6] px-[10px] text-center text-[12px] focus:border-black focus:outline-none"
                                    value={max}
                                    onChange={onMaxChange}
                                    placeholder="Max"
                                />
                            </div>
                            <button
                                className=" mb-[37px] mt-[20px] h-[40px] w-full rounded-[8px] border border-[#b6b6b6] font-inter-semibold text-[12px]"
                                onClick={onApply}
                            >
                                Apply
                            </button>
                        </>
                    )}
                </div>
                {condition.traits
                    .filter((a) => a.count.length)
                    .map((trait) => (
                        <div key={trait.name} className="mt-[15px]">
                            <div className="flex items-center justify-between">
                                <div className="font-inter-semibold text-[14px] capitalize">
                                    {trait.name}
                                </div>
                                <div className="flex">
                                    <div className="mr-[10px] text-[14px] text-symbol">
                                        {trait.count.length}
                                    </div>
                                    <span
                                        className="flex cursor-pointer items-end justify-end pb-[2px]"
                                        onClick={() => onExpandChange(trait)}
                                    >
                                        <ExpandArrow expand={trait.expand} />
                                    </span>
                                </div>
                            </div>
                            <div className="mt-[15px] flex flex-col gap-y-[8px]">
                                {trait.expand &&
                                    trait.values.map((value) => (
                                        <div key={value.value} className="flex">
                                            <Checkbox
                                                checked={value.chosen}
                                                onChange={() => onValueChange(value)}
                                            />
                                            <div className="ml-[15px] flex flex-1 justify-between text-[#999]">
                                                <div className="text-[14px]">{value.value}</div>
                                                <div className="text-[14px]">
                                                    {value.count.length}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default FilterPriceTraits;

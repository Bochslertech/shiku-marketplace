import { useEffect, useState } from 'react';
import { cdn } from '@/02_common/cdn';
import { parseLowerCaseSearch } from '@/02_common/data/search';
import { FirstRenderByData } from '@/02_common/react/render';
import { useDeviceStore } from '@/07_stores/device';
import FilterSearch from './search';

export type FilterCollection = 'gold' | string | 'others';
export type FilterCollectionOption = {
    collection: FilterCollection;
    name: 'Gold' | string | 'Others';
    collections: string[];
    logo: string;
    count: number;
};
const INITIAL_LENGTH = 10; // 超过 10 个会折叠
const FilterCollections = ({
    value,
    options,
    setOptions,
    setOpen,
    loaded,
}: {
    value: FilterCollection[];
    options: FilterCollectionOption[];
    setOptions: (value: FilterCollection[]) => void;
    setOpen?: (open: boolean) => void;
    loaded: boolean;
}) => {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    const showFoldButton = (value: FilterCollection[], options: FilterCollectionOption[]) => {
        if (options.length <= INITIAL_LENGTH) return false;
        for (const v of value) {
            const index = options.findIndex((option) => option.collection === v);
            if (index >= INITIAL_LENGTH) return false;
        }
        return true;
    };

    const [fold, setFold] = useState(showFoldButton(value, options));
    const [once_checking_fold] = useState(new FirstRenderByData());
    useEffect(
        () =>
            once_checking_fold.once([options.map((o) => o.collection).join('|')], () =>
                setFold(showFoldButton(value, options)),
            ),
        [options],
    );

    const [collectionSearch, setCollectionSearch] = useState('');
    const search = parseLowerCaseSearch(collectionSearch);
    const filteredOption = search
        ? options.filter((o) => o.name.toLowerCase().indexOf(search) > -1)
        : options;

    const wrappedOptions =
        fold && !search ? [...filteredOption].splice(0, INITIAL_LENGTH) : filteredOption;

    const onFold = () => setFold(!fold);

    const onChoose = (collection: FilterCollection) => {
        if (value.includes(collection)) {
            const newOptions = value.filter((v) => v !== collection);
            setOptions(newOptions);
        } else {
            const newOptions = [...value, collection];
            setOptions(newOptions);
        }
        if (isMobile) {
            setOpen && setOpen(false);
        }
    };

    return (
        <div>
            <FilterSearch
                search={collectionSearch}
                setSearch={setCollectionSearch}
                className="mb-[15px] mr-0 w-full rounded-[8px] md:w-[313px]"
            />
            <div className="mb-2 font-inter-medium text-[14px] text-stress">
                Total {wrappedOptions.length} collections{' '}
            </div>
            <div style={{ minHeight: 'calc(100vh - 145px)' }}>
                {wrappedOptions.map((option) => {
                    return (
                        <div
                            key={option.collection}
                            className={
                                value.includes(option.collection)
                                    ? 'chosen mb-[1px] flex cursor-pointer items-center rounded-[8px] px-[6px] py-[11px]'
                                    : 'mb-[1px] flex cursor-pointer items-center px-[6px] py-[11px] hover:rounded-[8px]'
                            }
                            style={{
                                background: value.includes(option.collection) ? '#F6F6F6' : '',
                            }}
                            onClick={() => {
                                onChoose(option.collection);
                            }}
                        >
                            <div
                                className="flex h-[41px] w-[41px] cursor-pointer items-center justify-center rounded-[4px]"
                                style={{
                                    background:
                                        option.logo.indexOf('/svgs/logo/collection-') > -1
                                            ? '#F0F0F0'
                                            : '',
                                }}
                            >
                                <img
                                    className="h-full w-full"
                                    src={cdn(option.logo)}
                                    style={{
                                        transform:
                                            option.logo.indexOf('/svgs/logo/collection-') > -1
                                                ? 'scale(0.8)'
                                                : '',
                                    }}
                                    alt=""
                                />
                            </div>
                            <div className="ml-[10px] flex-1 truncate font-inter-medium text-[14px] text-symbol">
                                {option.name}
                            </div>
                            <div className="ml-[10px] h-[24px] w-[24px] flex-shrink-0 rounded-[50%] bg-[#EFEFEF] text-center leading-6 text-symbol md:mr-[5px] md:text-black">
                                {option.count}
                            </div>
                        </div>
                    );
                })}
            </div>
            {showFoldButton(value, options) && loaded && !search && (
                <>
                    {/* FIXME CYY 折叠按钮的样式也要修改 */}
                    {fold ? (
                        <div
                            className="m-auto mt-[19px] h-[35px] w-[169px] flex-shrink-0 cursor-pointer rounded-[8px]
          bg-[#F0F0F0] text-center font-inter-medium text-[14px] font-semibold leading-[35px] text-symbol"
                            onClick={onFold}
                        >
                            unfold
                        </div>
                    ) : (
                        <div
                            className="m-auto mt-[19px] h-[35px] w-[169px] flex-shrink-0 cursor-pointer rounded-[8px]
          bg-[#F0F0F0] text-center font-inter-medium text-[14px] font-semibold leading-[35px] text-symbol"
                            onClick={onFold}
                        >
                            fold
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
export default FilterCollections;

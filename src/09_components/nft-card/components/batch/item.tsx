import { useEffect, useState } from 'react';
import { Dropdown } from 'antd';
import { SupportedLedgerTokenSymbol } from '@/01_types/canisters/ledgers';
import { BatchNftSale, UniqueCollectionData } from '@/01_types/yumi';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { exponentNumber } from '@/02_common/data/numbers';
import { shrinkText } from '@/02_common/data/text';
import { CollectionStatistics } from '@/04_apis/yumi/aws';
import { getCollectionStatistics } from '@/05_utils/apis/yumi/aws';
import {
    getLedgerTokenIcp,
    getLedgerTokenOgy,
    getTokenDecimals,
} from '@/05_utils/canisters/ledgers/special';
import { getOgyGoldCanisterId } from '@/05_utils/canisters/nft/special';
import { getCollectionNameByNftMetadata, getNameByNftMetadata } from '@/05_utils/nft/metadata';
import { useDeviceStore } from '@/07_stores/device';
import { useIdentityStore } from '@/07_stores/identity';
import { useCollectionDataList } from '@/08_hooks/nft/collection';
import YumiIcon from '@/09_components/ui/yumi-icon';
import ShowNumber from '../../../data/number';
import NftThumbnail from '../../../nft/thumbnail';
import { isValidPrice } from '../sell';

function BatchListingItem({ sale, floorFlag }: { sale: BatchNftSale; floorFlag: number }) {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);
    const updateBatchNftSale = useIdentityStore((s) => s.updateBatchNftSale);
    const removeBatchNftSale = useIdentityStore((s) => s.removeBatchNftSale);

    const [value, setValue] = useState(sale.price);
    useEffect(() => setValue(sale.price), [sale]);

    const onValueChange = ({ target: { value } }) => {
        if (!value) {
            setValue('');
            updateBatchNftSale({ ...sale, price: '' });
            return;
        }
        if (Number(value) === 0) {
            setValue(value);
            updateBatchNftSale({ ...sale, price: '' });
            return;
        }
        if (isValidPrice(value)) {
            setValue(value);
            updateBatchNftSale({ ...sale, price: value });
        }
    };

    const isGold = getOgyGoldCanisterId().includes(sale.token_id.collection);

    const symbol = sale.token.symbol;

    const onTokenSymbol = (symbol: SupportedLedgerTokenSymbol) => {
        if (isGold) {
            updateBatchNftSale({
                ...sale,
                token: symbol === 'ICP' ? getLedgerTokenIcp() : getLedgerTokenOgy(),
            });
        }
    };
    const collectionDataList = useCollectionDataList();

    const [innerStatistic, setInnerStatistic] = useState<CollectionStatistics | undefined>(
        undefined,
    );

    const collection = sale.card.data?.info.collection;
    useEffect(() => {
        collection && getCollectionStatistics(collection).then(setInnerStatistic);
    }, [collection]);

    const [innerData, setInnerData] = useState<UniqueCollectionData | undefined>(undefined);
    useEffect(() => {
        setInnerData(collectionDataList.find((c) => c.info.collection === collection));
    }, [collection, collectionDataList]);

    const floor = innerData?.metadata?.floorPrice ?? innerStatistic?.floor;
    // 设置地板价
    useEffect(() => {
        if (floorFlag !== 0 && floor && floor !== '0') {
            const floorPrice = exponentNumber(floor, -getTokenDecimals());
            setValue(floorPrice);
            updateBatchNftSale({ ...sale, price: floorPrice });
        }
    }, [floorFlag]);

    return (
        <div
            className={cn('grid w-full grid-cols-3  items-center', isMobile && 'grid-cols-2')}
            style={{ gridTemplateColumns: isMobile ? '3fr 3fr' : '3fr 3fr 2fr' }}
        >
            <div
                className={cn(
                    'flex h-[58px] w-full items-center overflow-hidden',
                    isMobile && 'h-[40px]',
                )}
            >
                <div className="mr-[10px] overflow-hidden rounded-[6px]">
                    <NftThumbnail
                        token_id={sale.card.metadata.token_id}
                        cdn_width={100}
                        width={isMobile ? 'w-[40px]' : 'w-[58px]'}
                    />
                </div>
                <div className="flex h-full w-fit  flex-col justify-between">
                    {/* <div>{sale.token_id.token_identifier}</div> */}
                    <div className="truncate font-inter-bold text-[14px] leading-[18px] text-black">
                        {shrinkText(getNameByNftMetadata(sale.card), 3, 6)}
                    </div>
                    <div className="font-inter-normal truncate text-[14px] leading-[18px] text-[#999]">
                        {shrinkText(getCollectionNameByNftMetadata(sale.card))}
                    </div>
                </div>
            </div>
            {isMobile ? (
                <div className="relative flex h-full flex-col items-start border-common ">
                    <div className="flex">
                        <input
                            className="h-[25px] w-[76px] rounded-[6px] rounded-r-none border border-solid border-common  px-[6px] font-inter-semibold text-[14px] text-black focus:outline-none"
                            value={value}
                            onChange={onValueChange}
                        />
                        {/* NFT的 */}
                        {!isGold && (
                            <div className="flex h-[25px] w-[45px] items-center justify-between rounded-[6px] rounded-l-none border border-l-0 border-solid border-common px-[6px] font-inter-semibold text-[14px] text-black">
                                <span>ICP</span>
                            </div>
                        )}
                        {/* 黄金的 */}
                        {isGold && (
                            <div className="group relative">
                                <Dropdown
                                    overlay={
                                        <ul className="cursor-pointer list-none rounded-[2px] bg-[#fff] shadow-[0_2px_8px_0_rgba(102,102,102,0.25)]">
                                            <li
                                                onClick={() => onTokenSymbol('ICP')}
                                                className="flex h-[23px] items-center  bg-white px-[5px] font-inter-medium text-[12px] text-black hover:bg-[#F1F1F1]"
                                            >
                                                <img
                                                    className="ml-[4px] mr-[9px] h-[6px] w-[14px]"
                                                    src={cdn(
                                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691397017738_Group 632393.svg',
                                                    )}
                                                    alt=""
                                                />
                                                ICP
                                            </li>
                                            <li
                                                onClick={() => onTokenSymbol('OGY')}
                                                className="flex h-[23px] items-center bg-white px-[5px] font-inter-medium text-[12px] text-black hover:bg-[#F1F1F1]"
                                            >
                                                <img
                                                    className="ml-[4px] mr-[9px] h-[6px] w-[14px]"
                                                    src={cdn(
                                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691397061507_image 2.svg',
                                                    )}
                                                    alt=""
                                                />
                                                OGY
                                            </li>
                                        </ul>
                                    }
                                    trigger={['hover']}
                                    placement="bottom"
                                >
                                    <div className="flex h-[25px] w-[57px] cursor-pointer items-center justify-between rounded-[6px] rounded-l-none border border-l-0 border-solid border-common  px-[6px] font-inter-semibold text-[14px] text-black">
                                        {symbol}
                                        <img
                                            className="ml-[3px] block h-[14px] w-[14px] rotate-180 transition duration-200  group-hover:rotate-[360deg]"
                                            src={cdn(
                                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691397934514_Frame.svg',
                                            )}
                                            alt=""
                                        />
                                    </div>
                                </Dropdown>
                            </div>
                        )}
                    </div>
                    <div className="mt-[2px] font-inter-medium text-[12px] leading-none text-name">
                        Floor price:&nbsp;
                        <ShowNumber
                            value={{
                                value: exponentNumber(floor ?? '0', -getTokenDecimals()),
                                thousand: { symbol: ['M', 'K'] },
                                scale: 2,
                                paddingEnd: 2,
                            }}
                            className="text-[12px] leading-none"
                        />
                        &nbsp;ICP
                    </div>
                </div>
            ) : (
                <div className="relative mb-[6px] flex h-[34px] items-center border-common ">
                    <input
                        className="h-full w-[76px] rounded-[6px] rounded-r-none border border-solid border-common  px-[6px] font-inter-semibold text-[14px] text-black focus:outline-none"
                        value={value}
                        onChange={onValueChange}
                    />
                    <div className="absolute -bottom-[2px] translate-y-full font-inter-medium text-[12px] leading-none text-name">
                        Floor price:&nbsp;
                        <ShowNumber
                            value={{
                                value: exponentNumber(floor ?? '0', -getTokenDecimals()),
                                thousand: { symbol: ['M', 'K'] },
                                scale: 2,
                                paddingEnd: 2,
                            }}
                            className="text-[12px] leading-none"
                        />
                        &nbsp;ICP
                    </div>
                    {/* NFT的 */}
                    {!isGold && (
                        <div className="flex h-full w-[45px] items-center justify-between rounded-[6px] rounded-l-none border border-l-0 border-solid border-common px-[6px] font-inter-semibold text-[14px] text-black">
                            <span>ICP</span>
                        </div>
                    )}
                    {/* 黄金的 */}
                    {isGold && (
                        <div className="group relative">
                            <Dropdown
                                overlay={
                                    <ul className="cursor-pointer list-none rounded-[2px] bg-[#fff] shadow-[0_2px_8px_0_rgba(102,102,102,0.25)]">
                                        <li
                                            onClick={() => onTokenSymbol('ICP')}
                                            className="flex h-[23px] items-center  bg-white px-[5px] font-inter-medium text-[12px] text-black hover:bg-[#F1F1F1]"
                                        >
                                            <img
                                                className="ml-[4px] mr-[9px] h-[6px] w-[14px]"
                                                src={cdn(
                                                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691397017738_Group 632393.svg',
                                                )}
                                                alt=""
                                            />
                                            ICP
                                        </li>
                                        <li
                                            onClick={() => onTokenSymbol('OGY')}
                                            className="flex h-[23px] items-center bg-white px-[5px] font-inter-medium text-[12px] text-black hover:bg-[#F1F1F1]"
                                        >
                                            <img
                                                className="ml-[4px] mr-[9px] h-[6px] w-[14px]"
                                                src={cdn(
                                                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691397061507_image 2.svg',
                                                )}
                                                alt=""
                                            />
                                            OGY
                                        </li>
                                    </ul>
                                }
                                trigger={['hover']}
                                placement="bottom"
                            >
                                <div className="flex h-[34px] w-[57px] cursor-pointer items-center justify-between rounded-[6px] rounded-l-none border border-l-0 border-solid border-common  px-[6px] font-inter-semibold text-[14px] text-black">
                                    {symbol}
                                    <img
                                        className="ml-[3px] block h-[14px] w-[14px] rotate-180 transition duration-200  group-hover:rotate-[360deg]"
                                        src={cdn(
                                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691397934514_Frame.svg',
                                        )}
                                        alt=""
                                    />
                                </div>
                            </Dropdown>
                        </div>
                    )}
                </div>
            )}
            {isMobile ? (
                <>
                    <YumiIcon
                        name="action-delete"
                        size={20}
                        color="#666666"
                        className="absolute right-[16px] h-[20px] w-[20px] cursor-pointer opacity-70 transition duration-300 hover:opacity-100"
                        onClick={() => removeBatchNftSale(sale.token_id)}
                    />
                </>
            ) : (
                <div className="flex items-center justify-between font-inter-medium">
                    <div>{isGold ? '1' : sale.card.data?.info.royalties ?? '--'}%</div>
                    <YumiIcon
                        name="action-delete"
                        size={20}
                        color="#666666"
                        className="ml-[20px] h-[20px] w-[20px] cursor-pointer opacity-70 transition duration-300 hover:opacity-100"
                        onClick={() => removeBatchNftSale(sale.token_id)}
                    />
                </div>
            )}
        </div>
    );
}

export default BatchListingItem;

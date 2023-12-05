import { useEffect, useState } from 'react';
import { exponentNumber } from '@/02_common/data/numbers';
import { NftCollectionFloor, NftCollectionVolume } from '@/04_apis/yumi/api2';
import { GoldFloorPrice, GoldVolumetric } from '@/04_apis/yumi/gold-api';
import {
    queryCollection24HVolume,
    queryCollectionFloorPriceByDay,
} from '@/05_utils/apis/yumi/api2';
import { queryGoldFloorPrice, queryGoldVolume } from '@/05_utils/apis/yumi/gold-api';
import { getLedgerIcpDecimals } from '@/05_utils/canisters/ledgers/special';
import NewDashBoard from './new-dash-board';

type GoldPrice = {
    year: string;
    sales: number;
};

const DashBoardGold = () => {
    const [volumeData, setVolumeData] = useState<GoldPrice[] | null>(null);
    const [priceDate, setPriceDate] = useState<GoldPrice[] | null>(null);
    useEffect(() => {
        (async () => {
            try {
                const volume = await queryGoldVolume();
                let volumeList = JSON.parse(JSON.stringify(volume));
                volumeList = volumeList.map((item: GoldVolumetric) => {
                    return {
                        year: `${new Date(item.date).getMonth() + 1}/${new Date(
                            item.date,
                        ).getDate()}`,
                        sales: item.volume,
                    };
                });
                setVolumeData(volumeList);
            } catch (error) {
                console.error(error);
            }
        })();
        (async () => {
            try {
                const floorPrice = await queryGoldFloorPrice();
                let priceList = JSON.parse(JSON.stringify(floorPrice));
                priceList = priceList.map((item: GoldFloorPrice) => {
                    return {
                        year: `${new Date(item.date).getMonth() + 1}/${new Date(
                            item.date,
                        ).getDate()}`,
                        sales: item.floorPrice.toFixed(2),
                    };
                });
                setPriceDate(priceList);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return (
        <div className="mx-auto mt-[30px] flex w-full max-w-[1200px]  justify-between ">
            <div className="font-text-[18px] flex w-full flex-col items-center justify-center font-inter-bold leading-[18px] md:flex-row">
                {volumeData && priceDate && (
                    <NewDashBoard volumeData={volumeData} priceDate={priceDate} />
                )}
            </div>
        </div>
    );
};

export const DashBoard = ({ collection }: { collection: string }) => {
    const [volumeData, setVolumeData] = useState<GoldPrice[] | null>(null);
    const [priceData, setPriceData] = useState<GoldPrice[] | null>(null);
    // 1. queryCollection24HVolume 查询日交易量
    // 2. queryCollectionFloorPriceByDay 查询日地板价
    useEffect(() => {
        (async () => {
            try {
                const volume = await queryCollection24HVolume(collection);
                const volumeList = volume
                    .slice(volume.length - 7, volume.length)
                    .map((item: NftCollectionVolume) => {
                        return {
                            year: `${new Date(item.day).getMonth() + 1}/${new Date(
                                item.day,
                            ).getDate()}`,
                            sales: Number(exponentNumber(item.volume, -getLedgerIcpDecimals())),
                        };
                    });
                // setVolumeIsAllZero(volumeList.every((item: Volume) => item.volume === 0));
                // setMaxVolume(_.maxBy(volumeList, 'volume')?.volume || 0);
                // setMinVolume(_.minBy(volumeList, 'volume')?.volume || 0);
                setVolumeData(volumeList);
            } catch (error) {
                console.error(error);
            }
        })();
        (async () => {
            try {
                const floorPrice = await queryCollectionFloorPriceByDay(collection);

                const priceList = floorPrice
                    .slice(floorPrice.length - 7, floorPrice.length)
                    .map((item: NftCollectionFloor) => {
                        return {
                            year: `${new Date(item.day).getMonth() + 1}/${new Date(
                                item.day,
                            ).getDate()}`,
                            sales: Number(exponentNumber(item.floor, -getLedgerIcpDecimals())),
                        };
                    });
                // zeroFun('price', priceList);
                setPriceData(priceList);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return (
        <div className="mx-auto  mt-[30px] flex w-full max-w-[1200px] justify-between">
            <div className="font-text-[18px] flex w-full flex-col items-center justify-center font-inter-bold leading-[18px] md:flex-row">
                {volumeData && priceData && (
                    <NewDashBoard volumeData={volumeData} priceDate={priceData} />
                )}
            </div>
        </div>
    );
};
export default DashBoardGold;

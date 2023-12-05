import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Skeleton } from 'antd';
import _ from 'lodash';
import { cdn } from '@/02_common/cdn';
import { FirstRenderByData } from '@/02_common/react/render';
import { Spend } from '@/02_common/react/spend';
import { OgyTokenActive, OgyTokenHistory } from '@/03_canisters/nft/nft_ogy';
import {
    queryTokenActiveRecordsByOgy,
    queryTokenHistoryRecordsByOgy,
} from '@/05_utils/canisters/nft/ogy';
import { useDeviceStore } from '@/07_stores/device';
import { useTokenRate } from '@/08_hooks/interval/token_rate';
import {
    useOrigynArtCollectionCards3,
    useOrigynArtCollectionData,
} from '@/08_hooks/views/origyn-art';
import TokenPrice from '@/09_components/data/price';
import { TextShowMore } from '@/09_components/data/text';
import { IconDirectionDownSelect } from '@/09_components/icons';
import './index.less';
import OrigynArtDetailActivity from './tabs/activity';
import OrigynArtDetailListing from './tabs/listing';
import OrigynArtDetailMap from './tabs/map';
import Voting from './tabs/voting/voting';

function OrigynArtCollectionPage() {
    const { t } = useTranslation();

    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    const { collection } = useParams();

    const collectionData = useOrigynArtCollectionData(collection);

    // 获取集合的所有 NFT 信息
    const cards = useOrigynArtCollectionCards3(collection);
    // console.debug(`🚀 ~ file: index.tsx:37 ~ OrigynArtCollection ~ cards:`, cards);
    const [once_check_cards_spend] = useState(new FirstRenderByData());
    const [spend_cards] = useState(Spend.start(`market collection index $$$$$$$$$$$$$$$`));
    useEffect(() => {
        once_check_cards_spend.once([!!cards], () => {
            spend_cards.mark(`cards is ${cards ? 'exist' : 'not exist'}`);
        });
    }, [cards]);

    const { icp_usd, ogy_usd } = useTokenRate();

    const [active, setActive] = useState<OgyTokenActive | undefined>(undefined);
    useEffect(() => {
        if (collection === undefined) return;
        queryTokenActiveRecordsByOgy(collection).then(setActive);
    }, [collection]);
    // 找地板价
    const {
        floorPrice,
        floorSymbol,
        floorDecimals,
    }: { floorPrice?: string; floorSymbol?: string; floorDecimals?: number } = useMemo(() => {
        if (active === undefined) return {};
        const records = [...active.records];
        let price: number | undefined = undefined;
        let floorPrice: string | undefined = undefined;
        let floorSymbol: string | undefined = undefined;
        let floorDecimals: number | undefined = undefined;
        for (const record of records) {
            if (record.sale === undefined) continue;
            const json = JSON.parse(record.sale.sale_type);
            if (json.auction?.status.open !== null) continue;
            if (json.auction?.config.auction.token.ic === undefined) continue;
            const p = json.auction?.config.auction.start_price;
            const s = json.auction?.config.auction.token.ic.symbol;
            const d = Number(json.auction?.config.auction.token.ic.decimals);
            const _price =
                s === 'ICP' && icp_usd !== undefined
                    ? Number(p) * Number(icp_usd)
                    : s === 'OGY' && ogy_usd !== undefined
                    ? Number(p) * Number(ogy_usd)
                    : undefined;
            if (_price === undefined) continue;
            if (price === undefined || _price < price) {
                price = _price;
                floorPrice = p;
                floorSymbol = s;
                floorDecimals = d;
            }
        }
        return { floorPrice, floorSymbol, floorDecimals };
    }, [active]);

    const [history, setHistory] = useState<OgyTokenHistory | undefined>(undefined);
    useEffect(() => {
        if (collection === undefined) return;
        queryTokenHistoryRecordsByOgy(collection).then(setHistory);
    }, [collection]);
    // 找最近成交记录
    const {
        lastPrice,
        lastSymbol,
        lastDecimals,
    }: { lastPrice?: string; lastSymbol?: string; lastDecimals?: number } = useMemo(() => {
        if (history === undefined) return {};
        let records = [...history.records];
        records = _.reverse(records);
        records = records.filter((item) => {
            const json = JSON.parse(item.sale_type);
            if (json.auction?.status.closed !== null) return false;
            const auction = json.auction;
            if (auction.current_escrow.length === 0) return false;
            return !!auction.current_escrow[0].buyer.principal;
        });
        records = _.sortBy(records, [(r) => -Number(JSON.parse(r.sale_type).auction.end_date)]);
        for (const record of records) {
            const json = JSON.parse(record.sale_type);
            if (json.auction?.status.closed !== null) continue;
            if (json.auction?.config.auction.token.ic === undefined) continue;
            if (json.auction?.current_escrow.length === 0) continue;
            return {
                lastPrice: json.auction?.config.auction.start_price,
                lastSymbol: json.auction?.config.auction.token.ic.symbol,
                lastDecimals: Number(json.auction?.config.auction.token.ic.decimals),
            };
        }
        return {};
    }, [history]);
    type TabType = 'map' | 'listing' | 'activity' | 'voting';
    const [tab, setTab] = useState<TabType>('listing');

    return (
        <>
            <div className="mb-[30px] w-full bg-gradient-to-b from-gray-100 to-transparent md:mb-[95px] md:flex-row">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col px-5 pt-[30px] md:flex-row md:pt-[65px]">
                    <div className="flex w-full flex-col md:w-4/12">
                        <div className="mb-[12px] flex w-full font-[Inter-Bold] text-[36px] font-bold italic leading-[50px]">
                            {collectionData?.metadata.name ? (
                                collectionData?.metadata.name
                            ) : (
                                <Skeleton.Input active={true} />
                            )}
                        </div>
                        {collectionData?.metadata.coverImage ? (
                            <div className="flex h-[315px] w-full items-center justify-center bg-[#d1d1d14d] p-[15px]">
                                <img
                                    className="flex h-full"
                                    src={collectionData?.metadata.coverImage}
                                    alt=""
                                />
                            </div>
                        ) : (
                            <Skeleton.Image
                                className="flex h-[315px] w-full items-center justify-center bg-[#d1d1d14d] p-[15px]"
                                active={true}
                            />
                        )}
                    </div>

                    <div className="mt-5 flex w-full flex-col md:ml-[55px] md:mt-0 md:w-8/12">
                        <div className="font-[Inter-Light] text-[14px] md:mt-[60px] md:line-clamp-4 md:text-[16px]">
                            {collectionData?.metadata.description ? (
                                isMobile ? (
                                    <TextShowMore
                                        text={collectionData?.metadata.description}
                                        limit={200}
                                        className=""
                                        moreButton={
                                            <div className="mt-[5px] flex w-full justify-center gap-x-[5px] text-center font-montserrat-bold text-[14px] uppercase">
                                                <IconDirectionDownSelect /> <div>Read More</div>
                                            </div>
                                        }
                                        lessButton={
                                            <div className="mt-[5px] flex w-full justify-center gap-x-[5px] text-center font-montserrat-bold text-[14px] uppercase">
                                                <IconDirectionDownSelect className="rotate-180" />{' '}
                                                <div>Read Less</div>
                                            </div>
                                        }
                                    />
                                ) : (
                                    collectionData?.metadata.description
                                )
                            ) : (
                                <Skeleton active={true} title={false} paragraph={{ rows: 4 }} />
                            )}
                        </div>
                        <div className="mt-4 flex w-full justify-between ">
                            <div
                                className="flex h-[70px] flex-col  justify-center rounded-[5px] border border-[#e5e5e5]  md:flex-1 md:border-none  "
                                style={{ width: 'calc(100% / 3 - 6.66px)' }}
                            >
                                <span className="origin-left translate-x-[8px] scale-[0.66] text-[12px] leading-[14px] text-[#151515] md:scale-100 md:text-[14px]">
                                    {t('owned.collection.artist')}
                                </span>
                                <span className="flex origin-left translate-x-[8px] scale-[0.83] flex-col text-[12px]  font-bold leading-[14px] md:mt-1  md:scale-100 md:flex-row md:text-[14px]">
                                    {collectionData?.metadata.artAuthor ? (
                                        collectionData?.metadata.artAuthor
                                    ) : (
                                        <Skeleton
                                            active={true}
                                            title={false}
                                            paragraph={{ rows: 1 }}
                                        />
                                    )}
                                    <span className=" origin-left scale-75 font-inter-semibold text-[12px] leading-[22px] text-[#151515] md:scale-100 md:text-[13px] md:leading-none">
                                        {collectionData?.metadata.authorBirth
                                            ? `(${collectionData?.metadata.authorBirth})`
                                            : ''}
                                    </span>
                                </span>
                            </div>
                            <div
                                className="flex h-[70px]  flex-col  justify-center rounded-[5px] border border-[#e5e5e5]  md:flex-1 md:border-none"
                                style={{ width: 'calc(100% / 3 - 6.66px)' }}
                            >
                                <p className="origin-left translate-x-[8px] scale-[0.66] text-[12px] leading-[14px] text-[#151515] md:scale-100 md:text-[14px] md:leading-none">
                                    {t('owned.collection.provenance')}
                                </p>
                                <div className=" flex origin-left translate-x-[8px] scale-75 text-[12px] font-bold  leading-[14px] md:mt-1 md:scale-100 md:text-[14px] md:leading-none">
                                    {collectionData?.metadata.authorProvenance ? (
                                        collectionData?.metadata.authorProvenance
                                    ) : (
                                        <Skeleton
                                            active={true}
                                            title={false}
                                            paragraph={{ rows: 1 }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div
                                className="flex h-[70px]  flex-col justify-center rounded-[5px] border border-[#e5e5e5] leading-[14px]  md:flex-1 md:border-none md:leading-none"
                                style={{ width: 'calc(100% / 3 - 6.66px)' }}
                            >
                                <p className="origin-left translate-x-[8px] scale-[0.66] text-[12px] text-[#151515] md:scale-100 md:text-[14px]">
                                    {t('owned.collection.enamel')}
                                </p>
                                <div className=" flex origin-left translate-x-[8px] scale-75 text-[12px]  font-bold  leading-[14px] md:mt-1 md:scale-100 md:text-[14px] md:leading-none">
                                    {collectionData?.metadata.artworkSize ? (
                                        collectionData?.metadata.artworkSize
                                    ) : (
                                        <Skeleton
                                            active={true}
                                            title={false}
                                            paragraph={{ rows: 1 }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex h-[90px] w-full bg-black md:h-[117px]">
                            <div className="flex h-full flex-1 flex-col items-center justify-center border-r border-[#464646]">
                                <p className="flex items-center font-inter-medium  text-[18px] leading-[100%] text-[#fff] md:text-[24px]">
                                    1000
                                </p>
                                <p className="flex  font-inter-light text-[12px] text-[#fff] md:text-[14px]">
                                    {t('owned.collection.fractions')}
                                </p>
                            </div>
                            <div className="flex h-full flex-1 flex-col items-center justify-center border-r  border-[#464646]">
                                <p className="flex items-center text-[18px]  leading-[100%] text-[#fff]  md:text-[24px]">
                                    <img
                                        className="mr-[6px] h-[14px] w-[14px] md:h-[18px] md:w-[18px]"
                                        src={cdn(
                                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon_icp.png',
                                        )}
                                        alt=""
                                    />
                                    <TokenPrice
                                        className="md:text-[24px]"
                                        value={{
                                            value: floorPrice,
                                            decimals: {
                                                type: 'exponent',
                                                value: floorDecimals ?? 8,
                                            },
                                            symbol: '',
                                            scale: 2,
                                            paddingEnd: 2,
                                        }}
                                    />{' '}
                                    <i className="ml-[2px] flex h-full items-end font-inter-medium text-[14px] not-italic ">
                                        {floorSymbol ?? 'ICP'}
                                    </i>
                                </p>
                                <p className="flex font-[Inter-Light] text-[12px] text-[#fff] md:text-[14px]">
                                    {t('owned.collection.floor')}
                                </p>
                            </div>
                            <div className="flex h-full flex-1 flex-col items-center justify-center">
                                <p className="flex items-center justify-center font-[Inter-Light] text-[18px] leading-[100%] text-[#fff] md:text-[24px]">
                                    <img
                                        className="mr-[6px] h-[14px] w-[14px] md:h-[18px] md:w-[18px]"
                                        src={cdn(
                                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon_icp.png',
                                        )}
                                        alt=""
                                    />
                                    <TokenPrice
                                        className="md:text-[24px]"
                                        value={{
                                            value: lastPrice,
                                            decimals: {
                                                type: 'exponent',
                                                value: lastDecimals ?? 8,
                                            },
                                            symbol: '',
                                            scale: 2,
                                            paddingEnd: 2,
                                        }}
                                    />
                                    <i className="ml-[2px] flex h-full items-end font-inter-medium text-[14px] not-italic leading-[100%]">
                                        {lastSymbol ?? 'ICP'}
                                    </i>
                                </p>
                                <p className="flex font-[Inter-Light] text-[12px] text-[#fff] md:text-[14px]">
                                    {t('owned.collection.last')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex h-[50px] w-full items-center justify-center bg-[#151515]">
                <div
                    onClick={() => setTab('map')}
                    className={`relative flex h-full w-[108px] cursor-pointer items-center justify-center font-[Inter-Bold] text-[14px] text-[#aeaeae] duration-150 ${
                        tab === 'map' &&
                        '!text-[#fff] after:absolute after:bottom-0 after:left-0 after:flex after:h-[3px] after:w-full after:rounded-[2px] after:bg-white after:content-[""]'
                    }`}
                >
                    {t('owned.collection.tab.map')}
                </div>
                <div
                    onClick={() => setTab('listing')}
                    className={`relative flex h-full w-[108px] cursor-pointer items-center justify-center font-[Inter-Bold] text-[14px] text-[#aeaeae] duration-150 ${
                        tab === 'listing' &&
                        '!text-[#fff] after:absolute after:bottom-0 after:left-0 after:flex after:h-[3px] after:w-full after:rounded-[2px] after:bg-white after:content-[""]'
                    }`}
                >
                    {t('owned.collection.tab.listing')}
                </div>
                <div
                    onClick={() => setTab('activity')}
                    className={`relative flex h-full w-[108px] cursor-pointer items-center justify-center font-[Inter-Bold] text-[14px] text-[#aeaeae] duration-150 ${
                        tab === 'activity' &&
                        '!text-[#fff] after:absolute after:bottom-0 after:left-0 after:flex after:h-[3px] after:w-full after:rounded-[2px] after:bg-white after:content-[""]'
                    }`}
                >
                    {t('owned.collection.tab.activity')}
                </div>
                <div
                    onClick={() => setTab('voting')}
                    className={`relative flex h-full w-[108px] cursor-pointer items-center justify-center font-[Inter-Bold] text-[14px] text-[#aeaeae] duration-150 ${
                        tab === 'voting' &&
                        '!text-[#fff] after:absolute after:bottom-0 after:left-0 after:flex after:h-[3px] after:w-full after:rounded-[2px] after:bg-white after:content-[""]'
                    }`}
                >
                    {t('owned.collection.tab.voting')}
                </div>
            </div>

            {tab === 'map' && <OrigynArtDetailMap collectionData={collectionData} cards={cards} />}
            {tab === 'listing' && (
                <OrigynArtDetailListing collectionData={collectionData} cards={cards} />
            )}
            {tab === 'activity' && (
                <OrigynArtDetailActivity history={history} collectionData={collectionData} />
            )}
            {tab === 'voting' && <Voting onChangeTab={(value: TabType) => setTab(value)} />}
        </>
    );
}

export default OrigynArtCollectionPage;

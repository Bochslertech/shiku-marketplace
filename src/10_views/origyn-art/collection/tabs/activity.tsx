import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { cdn } from '@/02_common/cdn';
import { sinceNowByByNano } from '@/02_common/data/dates';
import { shrinkText } from '@/02_common/data/text';
import { OgyTokenHistory, OgyTokenSale } from '@/03_canisters/nft/nft_ogy';
import { OrigynArtCollectionData } from '@/03_canisters/yumi/yumi_origyn_art';
import TokenPrice from '@/09_components/data/price';
import { IconLogoLedger } from '@/09_components/icons';
import PaginatedItems from '@/09_components/ui/paginated';

function Item({
    item,
    collectionData,
}: {
    item: OgyTokenSale;
    collectionData: OrigynArtCollectionData | undefined;
}) {
    const { t } = useTranslation();

    const preview =
        collectionData &&
        `https://${collectionData.collection}.raw.ic0.app/-/${item.token_id}/preview`;

    const json = JSON.parse(item.sale_type);
    const auction = json.auction;

    const price = auction.config.auction.buy_now.length
        ? auction.config.auction.buy_now[0]
        : auction.config.auction.start_price;
    const symbol = auction.config.auction.token.ic.symbol;
    const decimals = Number(auction.config.auction.token.ic.decimals);

    const from = auction.current_escrow[0].seller.principal;
    const to = auction.current_escrow[0].buyer.principal;

    return (
        <div className="flex flex-col">
            {/* PC效果 */}
            <div className="hidden lg:flex">
                <div className="flex h-[78px] w-full bg-transparent duration-150 hover:bg-[#0000000a]">
                    <div className="flex h-full w-[10%] items-center indent-[30px] font-[Inter-Bold] text-[16px]">
                        Sale
                    </div>
                    <div className="flex h-full w-[20%] cursor-pointer items-center">
                        <div className="h-[48px] w-[48px] flex-shrink-0">
                            {preview ? (
                                <img className="h-full w-full" src={cdn(preview)} alt="" />
                            ) : (
                                '骨架图'
                            )}
                        </div>
                        <p className="ml-2 w-[calc(100%-80px)] truncate font-[Inter-Bold] text-[12px]">
                            {item.token_id}
                        </p>
                    </div>
                    <div className="flex h-full w-[10%] items-center">
                        <IconLogoLedger symbol={symbol} className="h-[14px] w-[14px]" />
                        <span className="ml-1 font-[Inter-Bold] text-[16px] font-bold">
                            <TokenPrice
                                value={{
                                    value: price,
                                    decimals: { type: 'exponent', value: decimals },
                                    scale: 2,
                                    paddingEnd: 2,
                                }}
                            />
                        </span>
                    </div>
                    <div className="flex h-full w-[25%] items-center font-[Inter-Bold] text-[16px] font-bold">
                        <p className="mr-[30px] truncate font-[Inter-Medium] text-[12px] text-[#000c]">
                            @{shrinkText(from)}
                        </p>
                    </div>
                    <div className="flex h-full w-[25%] items-center font-[Inter-Bold] text-[16px] font-bold">
                        <p className="mr-[30px] truncate font-[Inter-Medium] text-[12px] text-[#000c]">
                            @{shrinkText(to)}
                        </p>
                    </div>
                    <div className="flex h-full w-[10%] items-center font-[Inter-Bold] text-[16px] font-bold">
                        <p className="truncate font-[Inter-Medium] text-[12px] text-[#000c]">
                            {sinceNowByByNano(auction.end_date)}
                        </p>
                    </div>
                </div>
            </div>

            {/* 移动效果 */}
            <div className="flex lg:hidden">
                <div className="mt-5 flex w-full flex-col overflow-hidden rounded-[5px] border border-[#e5e5e5] pt-5">
                    <div className="flex flex-col border-b border-[#e5e5e5] px-[16px] pb-[10px]">
                        <p className="line-clamp-1 w-full font-[Inter-Bold] text-[16px] font-bold italic leading-[18px] text-[#151515] md:text-[22px] md:leading-[30px]">
                            {collectionData?.metadata.name}
                        </p>
                        <span className="flex items-center">
                            <p className="font-[Inter] text-[14px] text-[#151515]">
                                Piece ID #{item.token_id}
                            </p>
                        </span>
                    </div>
                    <div className="flex w-full px-[12px] pb-[15px] pt-[15px] md:mx-[50px] md:w-7/12 md:px-0">
                        <div className="mr-[15px] flex w-[30%] flex-shrink-0 items-center md:mr-[50px] md:w-[40%]">
                            <div className="ml-[10px] flex w-full flex-col truncate">
                                <p className="text-[12px] text-black md:text-[14px]">
                                    {t('owned.collection.map.owner')}
                                </p>
                                <p className="truncate font-[Inter-bold] text-[12px] font-bold text-[#151515] md:text-[15px]">
                                    {shrinkText(from)}
                                </p>
                            </div>
                        </div>
                        <div className="mr-[15px] flex w-[30%] flex-shrink-0 flex-col justify-center">
                            <p className="text-[12px] text-black md:text-[14px]">
                                {t('owned.collection.map.fraction')}
                            </p>
                            <p className="truncate font-[Inter-bold] text-[12px] font-bold text-[#151515] md:text-[15px]">
                                #{item.token_id}
                            </p>
                        </div>
                        <div className="flex flex-1 flex-shrink-0 flex-col justify-center">
                            <p className="text-[12px] text-black md:text-[14px]">
                                {t('owned.collection.map.price')}
                            </p>
                            <p className="flex items-center font-[Inter-bold] text-[12px] font-bold text-[#151515] md:text-[15px]">
                                <img
                                    className="mr-1 h-[18px] w-[18px]"
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon_icp.png',
                                    )}
                                    alt=""
                                />
                                <TokenPrice
                                    value={{
                                        value: price,
                                        decimals: { type: 'exponent', value: decimals },
                                        scale: 2,
                                        paddingEnd: 2,
                                    }}
                                />{' '}
                                {symbol}
                            </p>
                        </div>
                    </div>
                    <div className="flex h-[25px] items-center justify-center bg-[#000] font-[Montserrat-SemiBold] text-[12px] font-bold uppercase tracking-[3px] text-[#fff]">
                        Sale {sinceNowByByNano(auction.end_date)}
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrigynArtDetailActivity({
    history,
    collectionData,
}: {
    history: OgyTokenHistory | undefined;
    collectionData: OrigynArtCollectionData | undefined;
}) {
    const { t } = useTranslation();

    const sales: OgyTokenSale[] | undefined = useMemo(() => {
        if (history === undefined) return undefined;
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
        return records;
    }, [history]);

    return (
        <div className="mx-auto flex w-full max-w-[1200px] flex-col">
            <div className="flex flex-col ">
                <div className="hidden h-[60px] bg-[#f9f9f9] lg:flex">
                    <p className="h-full w-[10%]"></p>
                    <p className="flex h-full w-[20%] items-center font-[Inter-Bold] text-[16px] font-bold">
                        {t('owned.collection.activity.item')}
                    </p>
                    <p className="flex h-full w-[10%] items-center font-[Inter-Bold] text-[16px] font-bold">
                        {t('owned.collection.activity.price')}
                    </p>
                    <p className="flex h-full w-[25%] items-center font-[Inter-Bold] text-[16px] font-bold">
                        {t('owned.collection.activity.from')}
                    </p>
                    <p className="flex h-full w-[25%] items-center font-[Inter-Bold] text-[16px] font-bold">
                        {t('owned.collection.activity.to')}
                    </p>
                    <p className="flex h-full w-[10%] items-center font-[Inter-Bold] text-[16px] font-bold">
                        {t('owned.collection.activity.time')}
                    </p>
                </div>

                {history === undefined && 'loading'}
                {history !== undefined && (
                    <PaginatedItems
                        className="mt-[65px]"
                        size={10}
                        list={sales}
                        Items={(props) => Items(props, collectionData)}
                    />
                )}
            </div>
        </div>
    );
}

export default OrigynArtDetailActivity;

const Items = (
    { current, size }: { current: OgyTokenSale[] | undefined; size?: number },
    collectionData: OrigynArtCollectionData | undefined,
) => {
    return (
        <>
            {!current &&
                size &&
                new Array(size).fill('').map((_, index) => (
                    <div key={index} className="mb-[20px] w-full">
                        'FIXME LCF 骨架图'
                    </div>
                ))}
            <div className="flex flex-col gap-y-5  pt-[20px]">
                {current &&
                    current.map((item) => (
                        <Item key={item.sale_id} item={item} collectionData={collectionData} />
                    ))}
            </div>
        </>
    );
};

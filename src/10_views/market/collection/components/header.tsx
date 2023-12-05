import { useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { message, Skeleton, Tooltip } from 'antd';
import _ from 'lodash';
import { NftTokenOwner } from '@/01_types/nft';
import { CoreCollectionData } from '@/01_types/yumi';
import { cdn, url_cdn } from '@/02_common/cdn';
import { assureHttp } from '@/02_common/data/http';
import { CollectionStatistics } from '@/04_apis/yumi/aws';
import { getCollectionStatistics } from '@/05_utils/apis/yumi/aws';
import TokenPrice from '@/09_components/data/price';
import { IconDirectionDownSelect } from '@/09_components/icons';
import YumiIcon from '@/09_components/ui/yumi-icon';
import Username from '@/09_components/user/username';

function MarketCollectionHeader({
    data,
    owners,
}: {
    data?: CoreCollectionData;
    owners?: NftTokenOwner[];
}) {
    const { t } = useTranslation();
    const textLimit = useRef(200);
    const [statistic, setStatistic] = useState<CollectionStatistics | undefined>(undefined);
    // 是否展开
    const [showReadMore, setShowReadMore] = useState<boolean>(false);
    const [fold, setFold] = useState<boolean>(showReadMore);
    useEffect(() => {
        if (data === undefined) return;
        const info = data.info;
        if (info && info.description) {
            const desc = info.description;
            setShowReadMore(desc.length > textLimit.current ? true : false);
            setFold(desc.length > 150 ? true : false);
        }
        getCollectionStatistics(data.info.collection).then(setStatistic);
    }, [data]);

    return (
        <div className="market-collection-header">
            {!data ||
                (data.info.banner !== undefined && (
                    <div className="relative h-[300px] w-full">
                        {data?.info.banner ? (
                            <div
                                className=" block h-full w-full  bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: `${url_cdn(data?.info.banner)}` }}
                            />
                        ) : (
                            <Skeleton.Image className="!h-full !min-h-0 !w-full" active />
                        )}
                        <div className="absolute bottom-[-64px] left-[40px] h-[128px] w-[128px] rounded-[16px]">
                            {data?.info.logo ? (
                                <img
                                    className="h-full w-full rounded-[16px]"
                                    src={cdn(data.info.logo)}
                                />
                            ) : (
                                <Skeleton.Avatar active={true} />
                            )}
                        </div>
                    </div>
                ))}

            <div className="mx-[15px] mt-[30px] flex flex-col justify-between md:mx-[40px] md:flex-row">
                <div className="mt-[36px] w-full md:w-[600px]">
                    <div className="mb-[6px font-inter-bold text-[26px] text-black">
                        {data?.info.name ? (
                            data.info.name
                        ) : (
                            <Skeleton title={false} active={true} paragraph={{ rows: 3 }} />
                        )}
                    </div>
                    <div className="font-inter-normal mb-[10px] mt-[10px] flex-shrink-0 text-[16px] text-[#8B8B8B]">
                        {data ? (
                            <>
                                @
                                <Username
                                    principal_or_account={data.info.creator}
                                    className="text-[16px]"
                                />
                            </>
                        ) : (
                            <Skeleton title={false} active={true} paragraph={{ rows: 3 }} />
                        )}
                    </div>
                    <div className="font-inter-normal mb-[10px] mt-[10px] flex-shrink-0 text-[14px] text-[#737375]">
                        {data ? (
                            <>
                                <div>
                                    {showReadMore && fold
                                        ? `${data.info.description?.substring(
                                              0,
                                              textLimit.current,
                                          )}...`
                                        : data.info.description}
                                </div>
                                {showReadMore ? (
                                    <span
                                        onClick={() => setFold(!fold)}
                                        className="group mt-3 inline-block cursor-pointer text-[14px] font-bold text-[#000]"
                                    >
                                        {t('launchpad.main.readMore')}
                                        <IconDirectionDownSelect
                                            className={`ml-1 inline-block transition-transform duration-500 ${
                                                !fold
                                                    ? 'rotate-180 group-hover:rotate-180 md:group-hover:rotate-0'
                                                    : 'group-hover:rotate-0 md:group-hover:rotate-180'
                                            }`}
                                        />
                                    </span>
                                ) : null}
                            </>
                        ) : (
                            // data.info.description
                            <Skeleton title={false} active={true} paragraph={{ rows: 3 }} />
                        )}
                    </div>

                    <div className="mb-[24px] mt-[20px] flex items-center md:mt-[60px]">
                        {data?.info.links &&
                            ['twitter', 'medium', 'discord', 'website', 'instagram', 'telegram']
                                .filter((name) => data.info.links![name])
                                .map((name) => ({ name, link: data.info.links![name] }))
                                .map(({ name, link }) => (
                                    <Link key={name} to={assureHttp(link)} target="_blank">
                                        <Tooltip placement="top" title={name}>
                                            <YumiIcon
                                                name={`link-${name}`}
                                                size={28}
                                                className="mr-[23px] cursor-pointer rounded-[8px] text-[#BDBDBD] hover:text-black"
                                            />
                                        </Tooltip>
                                    </Link>
                                ))}
                    </div>
                </div>
                <div className="mb-[11px] h-[270px] w-[339px] rounded-[16px] border border-solid border-[#E1E1E1] bg-white px-[30px] py-[11px]">
                    <div className="mb-[9px] flex items-center justify-between">
                        <div className="text-[rgba(0, 0, 0, 0.60)] font-inter-medium text-[14px]">
                            Items:
                        </div>
                        <div className="font-inter-semibold text-[14px] text-[#000]">
                            {owners ? (
                                owners.length
                            ) : (
                                <Skeleton title={false} active={true} paragraph={{ rows: 1 }} />
                            )}
                        </div>
                    </div>
                    <div className="mb-[9px] flex items-center justify-between">
                        <div className="text-[rgba(0, 0, 0, 0.60)] font-inter-medium text-[14px]">
                            Creator Royalty:
                        </div>
                        <div className="font-inter-semibold text-[14px] text-[#000]">
                            {data?.info.royalties ? (
                                `${data.info.royalties}%`
                            ) : (
                                <Skeleton title={false} active={true} paragraph={{ rows: 1 }} />
                            )}
                        </div>
                    </div>
                    <div className="mb-[9px] flex items-center justify-between">
                        <div className="text-[rgba(0, 0, 0, 0.60)] font-inter-medium text-[14px]">
                            Owners:
                        </div>
                        <div className="font-inter-semibold text-[14px] text-[#000]">
                            {owners ? _.uniq(owners.map((o) => o.owner)).length : '--'}
                        </div>
                    </div>
                    <div className="mb-[9px] flex items-center justify-between">
                        <div className="text-[rgba(0, 0, 0, 0.60)] font-inter-medium text-[14px]">
                            Floor Price:
                        </div>
                        <div className="font-inter-semibold text-[14px] text-[#000]">
                            {data || statistic ? (
                                <TokenPrice
                                    value={{
                                        value:
                                            data?.metadata?.floorPrice ?? statistic?.floor ?? '0',
                                        decimals: { type: 'exponent', value: 8 },
                                        symbol: ' ICP',
                                        scale: 2,
                                        paddingEnd: 2,
                                    }}
                                    className="text-[14px]"
                                />
                            ) : (
                                <Skeleton title={false} active={true} paragraph={{ rows: 1 }} />
                            )}
                        </div>
                    </div>
                    <div className="mb-[9px] flex items-center justify-between">
                        <div className="text-[rgba(0, 0, 0, 0.60)] font-inter-medium text-[14px]">
                            Volume Traded:
                        </div>
                        <div className="font-inter-semibold text-[14px] text-[#000]">
                            {data?.metadata?.volumeTrade ? (
                                <TokenPrice
                                    value={{
                                        value: data?.metadata?.volumeTrade,
                                        decimals: { type: 'exponent', value: 8 },
                                        symbol: ' ICP',
                                        scale: 2,
                                        thousand: { symbol: 'K' },
                                    }}
                                    className="text-[14px]"
                                />
                            ) : (
                                <Skeleton title={false} active={true} paragraph={{ rows: 1 }} />
                            )}
                        </div>
                    </div>
                    <div className="mb-[11px] mt-[18px] w-full border border-solid border-[#E1E1E1]"></div>
                    <div className="mb-[9px] flex items-center justify-between">
                        <div className="text-[rgba(0, 0, 0, 0.60)] font-inter-medium text-[14px]">
                            Blockchain:
                        </div>
                        <div className="font-inter-semibold text-[14px] text-[#000]">
                            Internet Computer
                        </div>
                    </div>
                    <div className="mb-[9px] flex items-center justify-between">
                        <div className="text-[rgba(0, 0, 0, 0.60)] font-inter-medium text-[14px]">
                            Contract Address:
                        </div>
                        <div className="font-inter-semibold text-[14px] text-[#000]">
                            {data?.info.collection ? (
                                <CopyToClipboard
                                    text={data?.info.collection ? `${data?.info.collection}` : ''}
                                    onCopy={() => {
                                        message.success({
                                            content: 'Copied Success',
                                        });
                                    }}
                                >
                                    <span className="flex cursor-pointer items-center font-inter-semibold text-[14px] text-[#000]">
                                        <img
                                            className="mr-[5px]"
                                            src={cdn(
                                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1671606741448_icon-copy-2.svg',
                                            )}
                                            alt=""
                                        />
                                        {data
                                            ? `${
                                                  data?.info.collection.slice(0, 6) +
                                                  '...' +
                                                  data?.info.collection.slice(-4)
                                              }`
                                            : ''}
                                    </span>
                                </CopyToClipboard>
                            ) : (
                                <Skeleton title={false} active={true} paragraph={{ rows: 1 }} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MarketCollectionHeader;

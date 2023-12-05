import { useCallback, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import { Skeleton } from 'antd';
import { CollectionLinks } from '@/01_types/yumi';
import { cdn } from '@/02_common/cdn';
import { assureHttp } from '@/02_common/data/http';
import { exponentNumber } from '@/02_common/data/numbers';
import { isCanisterIdText } from '@/02_common/ic/principals';
import { FirstRender, FirstRenderByData } from '@/02_common/react/render';
import { NFT_OGY_BUTTERFLY } from '@/03_canisters/nft/special';
import {
    getLaunchpadCollectionStatus,
    LaunchpadCollectionInfo,
    LaunchpadCollectionStatus,
} from '@/03_canisters/yumi/yumi_launchpad';
import { querySingleLaunchpadCollectionInfo } from '@/05_utils/canisters/yumi/launchpad';
import CountdownRenderer from '@/09_components/countdown/render';
import { LaunchpadBuyNow, LaunchpadBuyNowSkeleton } from './components/buy-now';
import { LaunchpadProjectTeam, LaunchpadProjectTeamSkeleton } from './components/team';
import {
    LaunchpadProjectTimelines,
    LaunchpadProjectTimelinesSkeleton,
} from './components/timelines';
import { TypicalNftCard, TypicalNftCardSkeleton } from './components/typical-nft';
import './index.less';

const LINK_ICON_INSTAGRAM =
    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1686554383663_conner.svg';

const LINKS: { name: string; icon: string }[] = [
    {
        name: 'twitter',
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/launchpad/1678262025644_m1.png',
    },
    {
        name: 'medium',
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/launchpad/1678262176502_m2.png',
    },
    {
        name: 'discord',
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/launchpad/1678262176504_m3.png',
    },
    {
        name: 'website',
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1683630490616_DSCVR.svg',
    },
    {
        name: 'instagram',
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1683631031466_Group%20632981.svg',
    },
    {
        name: 'telegram',
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1679466185984_telegram_url.svg',
    },
];

const parseIndex = (index: number, length: number): string => {
    if (length < 10) return `${index}`;
    return index < 10 ? `0${index}` : `${index}`;
};

function LaunchpadCollectionPage() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const param = useParams(); // 获取参数
    const collection = param.collection;

    const isValidCollection = (collection: string | undefined) =>
        collection && isCanisterIdText(collection);

    const [once_check_collection] = useState(new FirstRender());
    useEffect(
        once_check_collection.once(() => {
            if (!isValidCollection(collection)) return navigate('/', { replace: true });
        }),
        [],
    );

    // 本页需要的数据
    const [flag, setFlag] = useState(0);
    const update = useCallback(() => setFlag((flag) => flag + 1), []);
    const [loading, setLoading] = useState(false);
    const { state }: { state?: { collectionInfo: LaunchpadCollectionInfo } } = useLocation();
    const [collectionInfo, setCollectionInfo] = useState<LaunchpadCollectionInfo | undefined>(
        state?.collectionInfo,
    );

    // console.debug(`🚀 ~ file: index.tsx:42 ~ LaunchpadCollection ~ collectionInfo:`, collectionInfo);
    const [once_check_collection_info] = useState(new FirstRenderByData());
    useEffect(
        () =>
            once_check_collection_info.once([collection], () => {
                if (!isValidCollection(collection)) return;
                setLoading(true);
                querySingleLaunchpadCollectionInfo(collection!)
                    .then(setCollectionInfo)
                    .finally(() => setLoading(false));
            }),
        [collection, flag],
    );

    const [status, setStatus] = useState<LaunchpadCollectionStatus>('unknown');
    // console.debug(`🚀 ~ file: index.tsx:98 ~ LaunchpadCollection ~ status:`, status);
    useEffect(() => {
        if (collectionInfo === undefined) return;
        const status = getLaunchpadCollectionStatus(collectionInfo);
        if (['upcoming', 'whitelist', 'open'].includes(status)) {
            setStatus(status);
        } else {
            navigate(`/market/${collection}`, { replace: true });
        }
    }, [collectionInfo]);

    const [next, setNext] = useState<number | undefined>(undefined);
    useEffect(() => {
        if (['upcoming', 'whitelist', 'open'].includes(status)) {
            const next = Number(
                exponentNumber(
                    status === 'upcoming'
                        ? collectionInfo!.whitelist_start
                        : status === 'whitelist'
                        ? collectionInfo!.whitelist_end
                        : collectionInfo!.open_end,
                    -6,
                ),
            );
            setNext(next);
        }
    }, [status]);

    const links: CollectionLinks = collectionInfo?.links ?? {};

    const [activeKey, setActiveKey] = useState<number>();
    const items: CollapseProps['items'] =
        collectionInfo !== undefined
            ? collectionInfo.faq.map((item, index) => ({
                  key: index + 1,
                  label: (
                      <span
                          onMouseEnter={() => setActiveKey(index + 1)}
                          onMouseLeave={() => setActiveKey(undefined)}
                          className="flex min-h-[60px] items-center"
                      >
                          <i className="text-[16px] not-italic text-white">
                              {parseIndex(index + 1, collectionInfo.faq.length)}
                          </i>
                          <p className="ml-7 text-[16px] text-white">{item.question}</p>
                      </span>
                  ),
                  children: (
                      <div className="mb-5 ml-12 overflow-hidden text-[14px] text-[#D2D2D2] md:w-[520px]">
                          {item.answer}
                      </div>
                  ),
                  showArrow: false,
              }))
            : [];

    if (!isValidCollection(collection)) return <></>;
    return (
        <>
            {/* banner */}
            {loading ? (
                <div className="h-[400px] w-full py-8 md:h-[400px] md:py-0">
                    <Skeleton.Image className="!h-full !w-full" />
                </div>
            ) : (
                <div className="relative flex h-[390px] w-full items-center justify-center text-[0px] md:h-auto">
                    <img
                        className="h-full max-h-[520px] min-h-[390px] object-cover md:w-full"
                        src={collectionInfo?.banner}
                        alt=""
                    />
                    <div className="absolute left-0 top-0 h-full w-full bg-[#000] opacity-60"></div>

                    <div className="absolute top-0 z-10 mx-auto flex h-full w-full max-w-[1440px] items-end">
                        <div className="flex flex-1 flex-col px-[20px] md:px-[110px]">
                            <img
                                className="h-[97px] w-[97px] rounded-[16px]"
                                src={collectionInfo?.featured}
                                alt=""
                            />
                            <p className="mt-[0px] text-[34px] font-bold text-[#fff] md:mt-[36px]">
                                {collectionInfo?.name}
                            </p>
                            <div className="mb-8 mt-2 flex w-full justify-between md:mt-6">
                                {next && (
                                    <Countdown
                                        date={next}
                                        renderer={(props) => (
                                            <CountdownRenderer
                                                days={props.days}
                                                hours={props.hours}
                                                minutes={props.minutes}
                                                seconds={props.seconds}
                                                completed={props.completed}
                                                mode="light"
                                            />
                                        )}
                                    />
                                )}

                                <div className="hidden items-end gap-x-[30px] md:flex">
                                    {LINKS.filter((item) => !!links[item.name]).map((item) => (
                                        <Link
                                            key={item.name}
                                            to={assureHttp(links[item.name])}
                                            target="_blank"
                                        >
                                            <img
                                                className="h-[18px] w-[18px] cursor-pointer"
                                                alt=""
                                                src={cdn(
                                                    item.name === 'instagram' &&
                                                        NFT_OGY_BUTTERFLY.includes(collection ?? '')
                                                        ? LINK_ICON_INSTAGRAM
                                                        : item.icon,
                                                )}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Buy Now */}
            <div className="flex w-full flex-col items-center justify-center bg-[#fff] pt-[17px] md:pt-[57px]">
                <div className="mx-5 flex h-full w-full max-w-[1440px] flex-col px-[15px] md:mx-auto md:flex-row md:px-[110px]">
                    {loading || !collectionInfo || !status ? (
                        <LaunchpadBuyNowSkeleton />
                    ) : (
                        <LaunchpadBuyNow info={collectionInfo} status={status} update={update} />
                    )}
                </div>
            </div>

            {/* Mint schedule */}
            <div className="flex w-full flex-col items-center justify-center bg-[#fff] pt-[17px] md:pt-[44px]">
                <div className="relative mx-5 flex h-full w-full max-w-[1440px]  flex-col px-[15px] md:mx-auto md:px-[110px]">
                    <h2 className="text-[24px] font-semibold text-black">
                        {t('launchpad.main.mint')}
                    </h2>
                    <div className="mt-5 flex items-center">
                        {loading || !collectionInfo ? (
                            <LaunchpadProjectTimelinesSkeleton />
                        ) : (
                            <LaunchpadProjectTimelines info={collectionInfo} />
                        )}
                    </div>
                </div>
            </div>
            <div className="mx-5 flex h-full w-full max-w-[1440px] flex-col px-[15px] md:mx-auto md:px-[110px]">
                {' '}
                <div className="mb-[30px] mt-[50px] font-inter-semibold text-[24px] ">
                    {t('launchpad.main.projectDetail')}
                </div>
            </div>

            {/* Typical NFTs */}
            <div className="flex w-full flex-col items-center justify-center bg-[#F9F9F9] pb-[24px] pt-[10px] md:pb-[35px] md:pt-[34px]">
                <div className="mx-5 flex h-full w-full max-w-[1440px] flex-col px-[15px] md:mx-auto md:px-[110px]">
                    <h2 className="text-[18px] font-semibold text-black">
                        {t('launchpad.main.typical')}
                    </h2>
                    <div className="mt-4 grid w-full grid-cols-2 gap-x-[15px] gap-y-[15px] md:grid-cols-4 md:gap-x-[32px] md:gap-y-[32px]">
                        {loading || !collectionInfo ? (
                            <>
                                {['', '', '', ''].map((_, index) => (
                                    <TypicalNftCardSkeleton key={index} />
                                ))}
                            </>
                        ) : (
                            <>
                                {collectionInfo.typical.map((item) => (
                                    <TypicalNftCard key={item.token_index} item={item} />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Team */}
            <div className="flex w-full flex-col items-center justify-center bg-[#fff] pb-[30px] pt-[30px] md:pb-[60px] md:pt-[50px]">
                <div className="mx-5 flex h-full w-full max-w-[1440px] flex-col px-[15px] md:mx-auto md:px-[110px]">
                    <h2 className="text-[18px] font-semibold text-black">
                        {t('launchpad.main.team')}
                    </h2>
                    {loading || !collectionInfo ? (
                        <LaunchpadProjectTeamSkeleton />
                    ) : (
                        <LaunchpadProjectTeam info={collectionInfo} />
                    )}
                </div>
            </div>

            {/* fqa */}
            <div className="flex w-full items-center justify-center bg-black">
                <div className="mx-5 flex h-full w-full max-w-[1440px] flex-col pb-[30px] md:mx-auto md:px-[110px]">
                    <h2 className="mt-9 text-[24px] font-semibold text-white">
                        {t('launchpad.main.faq')}
                    </h2>
                    <Collapse
                        activeKey={activeKey}
                        defaultActiveKey={[]}
                        accordion
                        ghost
                        items={items}
                    />
                </div>
            </div>
        </>
    );
}

export default LaunchpadCollectionPage;

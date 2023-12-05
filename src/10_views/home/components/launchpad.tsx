import { useMemo } from 'react';
import Countdown from 'react-countdown';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import {
    AllLaunchpadCollections,
    getLaunchpadTimeRemain,
    LaunchpadCollectionInfo,
} from '@/03_canisters/yumi/yumi_launchpad';
import { queryAllLaunchpadCollectionsWithStatus } from '@/05_utils/canisters/yumi/launchpad';
import CountdownRenderer from '@/09_components/countdown/render';
import AspectRatio from '@/09_components/ui/aspect-ratio';
import YumiIcon from '@/09_components/ui/yumi-icon';

export default function HomeLaunchpad() {
    const { t } = useTranslation();

    const { data } = useQuery<AllLaunchpadCollections>({
        queryKey: ['home_launchpad'],
        queryFn: queryAllLaunchpadCollectionsWithStatus,
        staleTime: Infinity,
    });

    const view: LaunchpadCollectionInfo[] | undefined = useMemo(() => {
        if (data === undefined) return undefined;
        return data.whitelist
            .concat(data.open)
            .concat(data.upcoming)
            .concat(data.expired)
            .slice(0, 4)
            .reverse();
    }, [data]);

    return (
        <div className="mx-auto mt-[71px] flex max-w-[1920px] flex-col">
            <div className="flex items-center justify-between px-[40px] font-inter-semibold text-[26px] leading-[39px] text-[#000]">
                <div className="">{t('home.launchpad.title')}</div>{' '}
                <Link to={'/explore/collections'}>
                    <div className="flex cursor-pointer flex-row items-center opacity-70 hover:opacity-100">
                        <span className="mr-[3px] text-[16px] text-[#999]">
                            {t('home.launchpad.explore')}
                        </span>
                        <YumiIcon
                            name="arrow-right"
                            size={16}
                            className="inline-block cursor-pointer text-[#999] hover:text-[#666]"
                        />
                    </div>
                </Link>
            </div>
            <div className="relative mt-[30px] flex w-full items-center bg-[#f8f8f8] pt-[50px]">
                <div className="absolute left-0 top-0  flex  h-full w-full select-none items-center justify-center text-center text-[50px] font-semibold text-[#D1D1D1] opacity-20 md:text-9xl">
                    {t('home.launchpad.title')}
                </div>
                {!view && <></>}
                {view !== undefined && (
                    <div className="mx-auto flex w-full max-w-[1920px] pb-[51px] pt-[22px] ">
                        <div className="mx-5 flex h-full w-full flex-col justify-between md:mx-10 md:flex-row">
                            <Link
                                to={`/launchpad${view && view[3] ? `/${view[3].collection}` : ''}`}
                                className="h-full w-[75%] md:w-[30%]"
                            >
                                <AspectRatio ratio={1} className="">
                                    {view &&
                                        view.map((c, index) => (
                                            <img
                                                key={index}
                                                src={cdn(c.featured)}
                                                alt=""
                                                className={cn(
                                                    'absolute cursor-pointer rounded-[8px]',
                                                    index === 0 && 'top-[15%] h-[70%] w-[70%]',
                                                    index === 1 &&
                                                        'left-[10%] top-[10%] h-[80%] w-[80%]',
                                                    index === 2 &&
                                                        'left-[20%] top-[5%] h-[90%] w-[90%]',
                                                    index === 3 &&
                                                        'left-[30%] top-0 h-full w-full ',
                                                )}
                                            />
                                        ))}
                                </AspectRatio>
                            </Link>
                            <div className="z-20 mt-5 flex w-[100%] flex-col justify-center md:mt-0 md:w-[55%]">
                                <div className="flex flex-col gap-y-[15px]">
                                    <div className=" cursor-pointer font-inter-bold text-[20px] leading-normal ">
                                        {view && view[3]?.name}
                                    </div>
                                    <div className="text-[14px] leading-normal text-[#666666d9] ">
                                        {view && view[3]?.description}
                                    </div>
                                    <Link
                                        to={`/launchpad${
                                            view && view[3] ? `/${view[3].collection}` : ''
                                        }`}
                                        className="group flex cursor-pointer items-center font-inter-medium text-[16px] text-symbol hover:text-[#000]"
                                    >
                                        <div>{t('home.launchpad.more')}</div>
                                        <YumiIcon
                                            name="arrow-right"
                                            className="ml-1 text-[#666666] group-hover:text-black"
                                        />
                                    </Link>
                                </div>
                                <div className="mt-10">
                                    <div className="pb-[9px] text-[14px] font-bold">
                                        {t('home.launchpad.end')}
                                    </div>
                                    <Countdown
                                        date={
                                            Date.now() +
                                            Math.round(
                                                Number(
                                                    view && view[3]
                                                        ? getLaunchpadTimeRemain(view[3])
                                                        : 0,
                                                ) / 1e6,
                                            )
                                        }
                                        renderer={CountdownRenderer}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

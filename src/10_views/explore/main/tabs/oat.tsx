import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox, Skeleton } from 'antd';
import { cdn } from '@/02_common/cdn';
import { getOatEventStatus } from '@/05_utils/canisters/yumi/oat';
import { useIdentityStore } from '@/07_stores/identity';
import { useExploreOatDataList } from '@/08_hooks/views/explore';
import YumiIcon from '@/09_components/ui/yumi-icon';
import '../index.less';

function ExploreOat({ show }: { show: boolean }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const identity = useIdentityStore((s) => s.connectedIdentity);

    const [whitelisted, setWhitelisted] = useState(false);

    const { list, claimable } = useExploreOatDataList();

    const onWhitelistedChange = () => {
        if (!identity) return navigate('/connect');
        setWhitelisted(!whitelisted);
    };

    if (!show) return <></>;
    return (
        <>
            <div className="mt-3 flex h-9 items-center justify-between md:mt-[30px]">
                <div className="flex">
                    <Checkbox
                        className="text-[14px] text-[#999]"
                        checked={whitelisted}
                        onChange={onWhitelistedChange}
                    >
                        {t('explore.oat.whitelisted')}
                    </Checkbox>
                </div>
                <Link
                    to={
                        'https://yuminftmarketplace.gitbook.io/yumi-docs/creating/yumi-oat-a-step-by-step-guide'
                    }
                    target="_blank"
                >
                    <div className="flex h-9 cursor-pointer items-center rounded-[8px] border border-[#999] px-[23px] font-[Inter-SemiBold] text-[14px] text-[#999] hover:border-[#000] hover:bg-black hover:text-[#fff]">
                        {t('explore.oat.userGuide')}
                    </div>
                </Link>
            </div>

            {list === undefined ? (
                <div className="mt-4 grid h-full grid-cols-2 gap-x-[15px] gap-y-[15px] md:mt-7 md:grid-cols-3 md:gap-x-[30px] md:gap-y-[20px] lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7">
                    {['', '', '', '', '', '', '', ''].map((_, index) => (
                        <OatSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <div className="mt-4 grid h-full grid-cols-2 gap-x-[15px] gap-y-[15px] md:mt-7 md:grid-cols-3 md:gap-x-[30px] md:gap-y-[20px] lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7">
                    {list
                        .filter((event) => !whitelisted || claimable.includes(event.id))
                        .map((event) => (
                            <Link
                                key={event.id}
                                to={`/oat/${event.projectId}/claim/${event.id}`}
                                state={{ event }}
                            >
                                <div
                                    style={{
                                        backgroundSize: '100% 100%',
                                        background: `url('${event.featured}')`,
                                    }}
                                    className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[8px] px-2 py-2 md:px-5 md:py-5`}
                                >
                                    {/* FIXME LCF 下面ended 是对勾图标 */}
                                    <div
                                        className={`custom-box-shadow absolute left-0 top-[10px] z-20 flex h-[28px] w-[86px] items-center justify-center rounded-e-full md:top-[20px] ${
                                            getOatEventStatus(event) !== 'ended'
                                                ? 'bg-[#7355ff]/90'
                                                : 'bg-[#000]/90'
                                        }`}
                                    >
                                        <YumiIcon
                                            name="star"
                                            size={14}
                                            color="white"
                                            className="mr-[7px]"
                                        />
                                        <p className="font-inter-semibold text-[12px] text-[#fff]">
                                            {(() => {
                                                const status = getOatEventStatus(event);
                                                switch (status) {
                                                    case 'active':
                                                        return t('explore.oat.active');
                                                    case 'warm-up':
                                                        return t('explore.oat.warmUp');
                                                }
                                                return t('explore.oat.ended');
                                            })()}
                                        </p>
                                    </div>
                                    <div className="absolute left-0 top-0 h-full w-full bg-[#0003] backdrop-blur-md"></div>
                                    <div className="relative z-10 flex w-full flex-col overflow-hidden rounded-[8px] ">
                                        <div className="relative flex w-full items-center justify-center pt-[100%]">
                                            <img
                                                className="absolute top-0 flex w-full object-cover"
                                                src={cdn(event.featured)}
                                                alt=""
                                            />
                                        </div>
                                        <div className="shadow-[0px 0px 3px 0px #FFF inset, 0px 4px 8px 0px rgba(0, 0, 0, 0.10)] flex flex-shrink-0 flex-col bg-[#fff9] px-[8px] py-[8px] backdrop-blur-[15px] md:px-[18px] md:py-[19px]">
                                            <span className="flex items-center">
                                                <img
                                                    className="mr-3 h-[16px] w-[16px] rounded-[8px] md:h-[31px] md:w-[31px]"
                                                    src={cdn(event.featured)}
                                                    alt=""
                                                />
                                                <p className="truncate text-[12px] text-[#000] md:text-[14px]">
                                                    {event.name}
                                                </p>
                                            </span>
                                            <p className="mt-1 flex w-full truncate font-inter-bold text-[12px] text-[#000] md:mt-2 md:text-[14px]">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            )}
        </>
    );
}

export default ExploreOat;

function OatSkeleton() {
    return (
        <>
            <div className="flex flex-col overflow-hidden rounded-[8px]">
                <Skeleton.Image className="!h-[160px] !w-full !rounded-none md:!h-[250px]" />
                <div
                    className="flex flex-shrink-0 flex-col bg-[#fff9] px-[8px] py-[15px] backdrop-blur-[15px] md:px-[18px] md:py-[19px]"
                    style={{ background: 'rgba(0,0,0,.06)' }}
                >
                    <span className="flex items-center">
                        <Skeleton.Button className="mr-3 !h-[16px] !w-[16px] !min-w-[auto] rounded-[8px] md:!h-[31px] md:!w-[31px]" />
                        <Skeleton.Input className="!h-4 !w-20 !min-w-[auto]" />
                    </span>
                    <Skeleton.Input className="mt-1 !h-4 !w-full  !min-w-[auto] md:mt-2" />
                </div>
            </div>
        </>
    );
}

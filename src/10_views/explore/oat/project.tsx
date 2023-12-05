import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { message, Skeleton } from 'antd';
import { cdn } from '@/02_common/cdn';
import { assureHttp } from '@/02_common/data/http';
import { OatCollectionEvent, OatProject } from '@/03_canisters/yumi/yumi_oat';
import {
    getOatEventStatus,
    queryOatCollectionEventsByProjectId,
    queryOatProjectsByProjectId,
} from '@/05_utils/canisters/yumi/oat';
import YumiIcon from '@/09_components/ui/yumi-icon';

function ExploreOatProjectPage() {
    const { t } = useTranslation();

    const { project } = useParams();

    const { state }: { state?: { project?: OatProject } } = useLocation();
    const [projectInfo, setProjectInfo] = useState<OatProject | undefined>(state?.project);

    useEffect(() => {
        if (project && !projectInfo) {
            queryOatProjectsByProjectId([project])
                .then((d) => setProjectInfo(d[0]))
                .catch((e) => message.error(`query project info error: ${e}`));
        }
    }, [project, projectInfo]);

    const limit = 100;
    const [more, setMore] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        if (projectInfo === undefined) return setMore(undefined);
        setMore(projectInfo.description.length <= limit ? undefined : true);
    }, [projectInfo]);

    const showDescription = useMemo(() => {
        if (more === undefined) return projectInfo?.description;
        if (more && projectInfo) return projectInfo.description.substring(0, limit) + '...';
        return projectInfo?.description;
    }, [projectInfo, more]);

    const toggle = () => setMore((m) => !m);

    // 项目 Event List
    const [list, setList] = useState<OatCollectionEvent[] | undefined>(undefined);
    useEffect(() => {
        if (project) {
            queryOatCollectionEventsByProjectId(project)
                .then(setList)
                .catch((e) => message.error(`query event info error: ${e}`));
        }
    }, [project]);

    return (
        <div className="flex flex-col items-center">
            <div className="relative flex h-[100px] w-full items-center justify-center md:h-[220px]">
                <div className="h-full w-full overflow-hidden">
                    <img
                        className="h-full w-full object-cover"
                        src={cdn(projectInfo?.banner)}
                        alt=""
                    />
                </div>
                <div className="absolute -bottom-[40px] flex w-full max-w-[1440px] items-end justify-between px-5 md:-bottom-[54px] md:justify-center">
                    <div className="h-[66px] w-[66px] flex-shrink-0 overflow-hidden rounded-full border-[3px] border-[#000] bg-white md:h-[106px] md:w-[106px]">
                        <img className="h-full w-full" src={cdn(projectInfo?.logo)} alt="" />
                    </div>
                    <div className="right-0 flex md:absolute">
                        {projectInfo?.links &&
                            Object.keys(projectInfo.links)
                                .filter((key) => projectInfo.links[key])
                                .map((key) => (
                                    <Link
                                        key={key}
                                        to={assureHttp(projectInfo.links[key])}
                                        className="mr-[10px] flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[8px]"
                                    >
                                        <YumiIcon
                                            name={`link-${key.toLocaleLowerCase()}`}
                                            size={24}
                                            className="text-[#BDBDBD] hover:text-black"
                                        />
                                    </Link>
                                ))}
                    </div>
                </div>
            </div>

            <div className="mt-[70px] flex w-full max-w-[880px] flex-col px-5 md:mt-[80px]">
                <p className="mb-3 font-inter-black text-[18px] text-[#000] md:mb-5 md:text-center md:text-[32px]">
                    {projectInfo?.name}
                </p>
                <p className=" font-inter-medium text-[14px] leading-[28px] text-[#000c]">
                    {showDescription}
                    {more !== undefined &&
                        (more ? (
                            <em
                                onClick={toggle}
                                className="cursor-pointer bg-white pl-1 font-semibold not-italic text-black"
                            >
                                {t('launchpad.main.readMore')}
                            </em>
                        ) : (
                            <em
                                onClick={toggle}
                                className="cursor-pointer bg-white pl-1 font-semibold not-italic text-black"
                            >
                                {t('launchpad.main.showLess')}
                            </em>
                        ))}
                </p>
            </div>

            <div className="mt-[10px] flex w-full max-w-[1440px] items-end justify-between px-5 md:-bottom-[54px] md:mt-[60px] md:justify-center">
                {!projectInfo || !list ? (
                    <div className="mt-4 grid h-full w-full grid-cols-2 gap-x-[15px] gap-y-[15px] md:mt-7 md:grid-cols-3 md:gap-x-[30px] md:gap-y-[20px] xl:grid-cols-4">
                        {new Array(8).fill('').map((_, index) => (
                            <OatCardSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-4 grid h-full grid-cols-2 gap-x-[15px] gap-y-[15px] md:mt-7 md:grid-cols-3 md:gap-x-[30px] md:gap-y-[20px] xl:grid-cols-4">
                        {list.map((event) => (
                            <OatCard key={event.id} project={projectInfo} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExploreOatProjectPage;

function OatCard({ project, event }: { project: OatProject; event: OatCollectionEvent }) {
    const { t } = useTranslation();
    return (
        <Link
            to={`/oat/${project.id}/claim/${event.id}`}
            state={{ project, event }}
            style={{
                backgroundSize: '100% 100%',
                background: `url('${event.featured}')`,
            }}
            className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[8px] px-2 py-2 md:px-5 md:py-5`}
        >
            <div
                className={`custom-box-shadow absolute left-0 top-[32px] z-20 flex h-[28px] w-[86px] items-center justify-center rounded-e-full ${
                    getOatEventStatus(event) !== 'ended' ? 'bg-[#7355ff]/90' : 'bg-[#000]/90'
                }`}
            >
                <YumiIcon name="star" size={14} color="white" className="mr-[7px]" />
                <p className="text-[12px] text-[#fff]">
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
            <div className="absolute left-0 top-0 h-full w-full bg-[#0003] backdrop-blur-[60px]"></div>
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
                            src={cdn(project.logo)}
                            alt=""
                        />
                        <p className="font-inter-bold text-[12px] text-[#000] md:text-[14px]">
                            {project.name}
                        </p>
                    </span>
                    <p className="mt-1 flex w-full truncate text-[12px] font-semibold text-[#000] md:mt-2 md:text-[14px]">
                        {event.name}
                    </p>
                </div>
            </div>
        </Link>
    );
}

function OatCardSkeleton() {
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

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { cdn } from '@/02_common/cdn';
import { LaunchpadCollectionInfo } from '@/03_canisters/yumi/yumi_launchpad';
import YumiIcon from '@/09_components/ui/yumi-icon';

export const PastCard = ({ info }: { info: LaunchpadCollectionInfo }) => {
    const { t } = useTranslation();
    return (
        <Link to={`/market/${info.collection}`}>
            <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[8px] border bg-white shadow-lg">
                <div className="relative overflow-hidden">
                    <div className="relative flex w-full items-center justify-center pt-[100%]">
                        <img
                            className="absolute top-0 flex w-full object-cover"
                            src={cdn(info.featured)}
                            alt=""
                        />
                    </div>
                    <div className="absolute left-0  top-0 flex h-full w-full flex-col bg-[#000]/70 px-2 py-4 opacity-0 transition ease-in-out group-hover:opacity-100">
                        <div className="mt-auto flex items-center justify-center">
                            <p className="text-[12px] font-semibold text-[#fff]">
                                {t('launchpad.main.collection')}
                            </p>
                            <YumiIcon name="arrow-right" size={12} color="white" className="ml-3" />
                        </div>
                    </div>
                </div>
                <p className="truncate px-2 pb-[15px] pt-[12px] text-[12px] font-semibold text-[#999]">
                    {info.name}
                </p>
            </div>
        </Link>
    );
};

export const PastCardSkeleton = () => {
    return (
        <div className="flex flex-col overflow-hidden rounded-[8px] border bg-white pb-4 shadow-lg">
            <Skeleton.Image className="!h-[200px] !w-full lg:!h-[200px] xl:!h-[160px]" />
            <Skeleton.Input className="ml-2 mt-2 !h-4 !w-20 !min-w-0" />
            <Skeleton.Input className="ml-2 mt-2 !h-4 !w-[140px] !min-w-0" />
        </div>
    );
};

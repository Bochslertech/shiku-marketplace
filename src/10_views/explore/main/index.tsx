import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FirstRenderByData } from '@/02_common/react/render';
import './index.less';
import ExploreArt from './tabs/art';
import ExploreCollectibles from './tabs/collectibles';
import ExploreOat from './tabs/oat';

type ExploreTab = 'collectibles' | 'oat' | 'art';
const EXPLORE_TABS: ExploreTab[] = ['collectibles', 'oat', 'art'];
export const isValidExploreTab = (tab: string): boolean => EXPLORE_TABS.includes(tab as ExploreTab);

type NavigateItem = {
    label: string;
    path: string;
};

function ExploreMainPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const tabs: NavigateItem[] = [
        {
            label: t('home.nav.collectibles'),
            path: '/explore',
        },
        {
            label: t('home.nav.oat'),
            path: '/explore/oat',
        },
        {
            label: t('home.nav.art'),
            path: '/explore/art',
        },
    ];

    const param = useParams(); // 获取参数
    const tab: ExploreTab = param.tab ? (param.tab as ExploreTab) : 'collectibles'; // 默认是 collectibles 标签页
    const [once_check_params] = useState(new FirstRenderByData());
    useEffect(
        () =>
            once_check_params.once([tab], () => {
                if (!isValidExploreTab(tab)) return navigate('/explore', { replace: true }); // ! tab 不对，进入 explore 主页
            }),
        [tab],
    );

    return (
        <>
            <div className="mx-auto flex w-full flex-col ">
                <div className="mx-[16px] flex flex-col md:mx-[40px]">
                    <span className="mt-[30px] flex items-center font-[Inter-Bold]">
                        <h2 className="font-inter-semibold  text-[32px] text-white">
                            {t('explore.main.title')}
                        </h2>
                    </span>
                    {/* TAB */}
                    <div className="mt-[23px] flex">
                        {tabs.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className={`mr-9 flex h-[35px] cursor-pointer items-center rounded-[8px] px-3 font-inter-semibold text-[16px] text-white/60 duration-100 ${
                                    location.pathname === item.path && 'bg-[#1C2234] !text-white'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <div className="mb-[30px] mt-[44px] h-px w-full bg-[#262e47]" />
                    {<ExploreCollectibles show={tab === 'collectibles'} />}
                    {<ExploreOat show={tab === 'oat'} />}
                    {<ExploreArt show={tab === 'art'} />}
                </div>
            </div>
        </>
    );
}

export default ExploreMainPage;

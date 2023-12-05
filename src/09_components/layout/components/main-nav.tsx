import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { cn } from '@/02_common/cn';
import { isGoldTheme } from '@/05_utils/app/env';
import { IconLogoYumi, IconLogoYumiGold } from '@/09_components/icons';

type NavigateItem = {
    label: string;
    path: string;
    alias: string[];
    children?: { label: string; path: string }[];
};
export const useNavigateItems = (): NavigateItem[] => {
    const { t } = useTranslation();
    return [
        {
            label: t('home.nav.launchpad'),
            path: '/launchpad',
            alias: ['/launchpad/'],
        },
        {
            label: t('home.nav.explore'),
            path: '/explore',
            alias: ['/explore/', '/oat/', '/art/', '/artist/'],
            children: [
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
            ],
        },
        {
            label: t('home.nav.origyn-art'),
            path: '/origyn',
            alias: ['/origyn/'],
        },
        {
            label: t('home.nav.gold'),
            path: '/gold',
            alias: ['/gold/'],
            children: [
                {
                    label: t('home.nav.about'),
                    path: '/gold/about',
                },
                {
                    label: t('home.nav.market'),
                    path: '/gold/market',
                },
            ],
        },
        {
            label: t('home.nav.shiku'),
            path: '/shiku',
            alias: ['/shiku/'],
        },
        {
            label: t('home.nav.rankings'),
            path: '/ranking',
            alias: ['/ranking/'],
        },
    ];
};
export function MainNav() {
    const { pathname } = useLocation();
    const items = useNavigateItems();
    const currentLabel = items.find(
        (s) => s.path === pathname || s.alias.find((a) => pathname.startsWith(a)),
    );
    return (
        <div className="flex h-full gap-6 md:gap-x-[25px]">
            <Link to="/" className="flex items-center space-x-2">
                {currentLabel?.path === '/gold' || isGoldTheme() ? (
                    <IconLogoYumiGold className="h-[32px] w-[126px] flex-shrink-0 cursor-pointer object-contain" />
                ) : (
                    <IconLogoYumi className="h-[28px] w-[105px] flex-shrink-0 cursor-pointer bg-cover bg-center bg-no-repeat md:h-[32px] md:w-[126px]" />
                )}
            </Link>
            <div className="ml-[10px] hidden items-center lg:flex">
                <nav className="flex h-full items-center gap-4 lg:gap-6">
                    {(isGoldTheme()
                        ? _.orderBy(items, [(item) => item.label !== 'Gold'])
                        : items
                    ).map((item, index) => (
                        <div key={index} className="flex h-full flex-col items-center">
                            <div className="group relative h-full items-center">
                                <Link
                                    to={item.path}
                                    className={cn([
                                        'flex h-full items-center font-inter-medium text-[15px] text-sm font-semibold text-[#808080] duration-150 group-hover:text-black',
                                        item.label === currentLabel?.label && 'text-black',
                                        item.label === 'Gold' && 'nav-gold',
                                        item.label === 'Shiku' && 'nav-shiku',
                                    ])}
                                >
                                    {item.label}
                                </Link>
                                {item.children ? (
                                    <div
                                        className="absolute top-[100%] -ml-10 hidden flex-col rounded-b-[8px] bg-white px-[6px] pt-[10px]  group-hover:flex"
                                        style={{
                                            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 5px 10px 2px',
                                        }}
                                    >
                                        {item.children.map((child, index2) => (
                                            <Link
                                                className={cn([
                                                    'group/link mb-3 flex h-9 w-[130px] items-center justify-between rounded-[8px] bg-white px-[11px] font-[Inter-SemiBold] duration-100 hover:bg-[#EBEBEB]',
                                                    pathname === child.path && 'bg-[#EBEBEB]',
                                                ])}
                                                key={index2}
                                                to={child.path}
                                            >
                                                <div>{child.label}</div>
                                                {/* {pathname === child.path && ( */}
                                                <div className="ml-[10px] hidden h-1 w-1 flex-shrink-0 rounded-full bg-[#6B6B6B] group-hover/link:flex"></div>
                                                {/* )} */}
                                            </Link>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}

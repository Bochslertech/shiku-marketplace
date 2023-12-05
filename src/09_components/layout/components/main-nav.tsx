import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/02_common/cn';
import { IconLogoShiku } from '@/09_components/icons';

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
            label: t('home.nav.shiku'),
            path: '/shiku',
            alias: ['/shiku/'],
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
                <IconLogoShiku className="h-[28px] w-[105px] flex-shrink-0 cursor-pointer bg-cover bg-center bg-no-repeat md:h-[32px] md:w-[126px]" />
            </Link>
            <div className="ml-[10px] hidden items-center lg:flex">
                <nav className="flex h-full items-center gap-4 lg:gap-6">
                    {items.map((item, index) => (
                        <div key={index} className="flex h-full flex-col items-center">
                            <div className="group relative h-full items-center">
                                <Link
                                    to={item.path}
                                    className={cn([
                                        'relative flex h-full min-w-[60px] flex-col items-center justify-center font-inter-medium text-[15px] text-sm font-semibold text-[#808080] duration-150 group-hover:text-white',
                                        item.label === currentLabel?.label && 'text-white',
                                        item.label === 'Shiku' && 'nav-shiku',
                                    ])}
                                >
                                    <div>{item.label}</div>
                                    {item.label === currentLabel?.label && (
                                        <img
                                            className="absolute bottom-[10px] w-[60px]"
                                            src="/img/head/menu-active.svg"
                                        ></img>
                                    )}
                                </Link>
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}

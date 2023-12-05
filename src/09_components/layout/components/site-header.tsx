import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Drawer } from 'antd';
import { ShoppingCartItem } from '@/01_types/yumi';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { isGoldTheme } from '@/05_utils/app/env';
import { useIdentityStore } from '@/07_stores/identity';
import { useArtists } from '@/08_hooks/views/artist';
import { useIsGoldByPath } from '@/08_hooks/views/gold';
import { IconLogoYumi, IconLogoYumiGold, IconWallet } from '@/09_components/icons';
import { MainNav, useNavigateItems } from '@/09_components/layout/components/main-nav';
import { NoticeDrawer } from '@/09_components/layout/components/notice-drawer';
import { Button } from '@/09_components/ui/button';
import YumiIcon from '@/09_components/ui/yumi-icon';

export const SiteHeader = memo(() => {
    const [menuDrawer, setMenuDrawer] = useState(false);
    const { pathname } = useLocation();
    return (
        <>
            <header
                className={cn(
                    'fixed top-0 z-50  mx-auto flex h-[44px] w-full items-center justify-between bg-[#fff] bg-opacity-80 px-[20px] backdrop-blur-[18px] backdrop-filter md:h-[75px] md:px-[30px]',
                    pathname && pathname === '/kyc/register' && 'hidden',
                )}
            >
                <div className="flex h-full w-full items-center sm:justify-between sm:space-x-0">
                    <MainNav />
                    <div className="flex flex-1 items-center justify-end space-x-[27px]">
                        <YumiIcon
                            name="action-menu"
                            size={26}
                            color="#000000"
                            className="cursor-pointer lg:hidden"
                            onClick={() => setMenuDrawer(true)}
                        />
                        <HeaderNotice />
                        <HeaderCart />
                        <HeaderIdentity />
                    </div>
                </div>
            </header>
            <HeaderDrawer menuDrawer={menuDrawer} setMenuDrawer={setMenuDrawer} />
        </>
    );
});

const HeaderNotice = () => {
    const [showNoticeDrawer, setShowNoticeDrawer] = useState(false);
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const { artist } = useArtists();

    return (
        <>
            {identity && artist ? (
                <div className="relative cursor-pointer">
                    <YumiIcon
                        name="action-notice"
                        size={24}
                        onClick={() => setShowNoticeDrawer(!showNoticeDrawer)}
                    />
                </div>
            ) : (
                <></>
            )}
            <NoticeDrawer
                showNoticeDrawer={showNoticeDrawer}
                setShowNoticeDrawer={setShowNoticeDrawer}
            />
        </>
    );
};

const HeaderCart = () => {
    const isGold = useIsGoldByPath();
    // 远程购物车
    const shoppingCartItems = useIdentityStore((s) => s.shoppingCartItems);
    // 本地 Gold 购物车
    const goldShoppingCartItems = useIdentityStore((s) => s.goldShoppingCartItems);
    console.debug(
        '🚀 ~ file: site-header.tsx:82 ~ HeaderCart ~ goldShoppingCartItems:',
        goldShoppingCartItems,
    );
    const toggleShowShoppingCart = useIdentityStore((s) => s.toggleShowShoppingCart);
    const showCart = !!shoppingCartItems || isGold; // gold 页面可以直接显示
    const items: ShoppingCartItem[] = isGold ? goldShoppingCartItems : shoppingCartItems ?? [];
    console.debug('🚀 ~ file: site-header.tsx:85 ~ HeaderCart ~ items:', items.length);
    return (
        <>
            {showCart && (
                <div className="relative cursor-pointer">
                    <YumiIcon
                        name="action-cart"
                        size={27}
                        color="#666666"
                        className="block"
                        onClick={toggleShowShoppingCart}
                    />
                    {items.length ? (
                        <span className="absolute -bottom-1 -right-2 flex h-[13px] min-w-[13px] items-center justify-center rounded-[4px] bg-[#ff4d4f] px-[4px] text-[10px] text-[#fff]">
                            <p className="scale-75">{items.length}</p>
                        </span>
                    ) : (
                        ''
                    )}
                </div>
            )}
        </>
    );
};

const HeaderIdentity = () => {
    const { t } = useTranslation();
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const profile = useIdentityStore((s) => s.identityProfile);
    const toggleIsUserSidebarIdOpen = useIdentityStore((s) => s.toggleIsUserSidebarIdOpen);
    return (
        <div>
            {identity ? (
                <div
                    className="relative flex h-[24px] w-[24px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-300 hover:border-[1px] hover:border-black md:h-[36px] md:w-[36px]"
                    onClick={toggleIsUserSidebarIdOpen}
                >
                    <img
                        className="absolute left-0 top-0 h-full w-full bg-white"
                        src={cdn(
                            profile?.avatar ??
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/loading-gif.gif',
                        )}
                        alt=""
                    />
                </div>
            ) : (
                <>
                    <Link to={'/connect'} rel="noreferrer">
                        <Button className="hidden h-[40px] flex-shrink-0 items-center rounded-[8px] px-[12px] py-[11px] text-center align-top font-inter-bold text-[12px] md:flex lg:px-[19px] lg:text-[14px]">
                            {t('home.nav.connect')}
                        </Button>
                        <IconWallet className="block w-[20px] md:hidden" />
                    </Link>
                </>
            )}
        </div>
    );
};

const HeaderDrawer = ({
    menuDrawer,
    setMenuDrawer,
}: {
    menuDrawer: boolean;
    setMenuDrawer: (open: boolean) => void;
}) => {
    const items = useNavigateItems();
    const { pathname } = useLocation();
    return (
        <Drawer
            title="Basic Drawer"
            placement="top"
            styles={{
                header: { display: 'none' },
                body: { padding: 0 },
            }}
            height={window.outerHeight}
            onClose={() => setMenuDrawer(false)}
            open={menuDrawer}
        >
            <div className="flex h-[44px] w-full  items-center justify-between border-b px-[20px]">
                {isGoldTheme() ? (
                    <IconLogoYumiGold className="h-[28px] w-[105px] flex-shrink-0 cursor-pointer bg-cover bg-center bg-no-repeat" />
                ) : (
                    <IconLogoYumi className="h-[28px] w-[105px] flex-shrink-0 cursor-pointer bg-cover bg-center bg-no-repeat" />
                )}

                <YumiIcon
                    name="action-close"
                    color="#666666"
                    className="!text-lg"
                    onClick={() => setMenuDrawer(false)}
                />
            </div>
            <nav className="flex flex-col">
                {items.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={cn([
                            'mx-5 flex h-12 items-center border-b text-[14px] text-[#808080]',
                            item.path === pathname && 'text-black',
                        ])}
                        onClick={() => setMenuDrawer(false)}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </Drawer>
    );
};

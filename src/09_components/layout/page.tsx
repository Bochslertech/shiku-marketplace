import { useEffect } from 'react';
import { useAppStore } from '@/07_stores/app';
import { PreloadIcons } from '../icons';
import KycPromptModal from '../layout/components/kyc-prompt';
import GoldModal from '../modal/gold-modal';
import Cart from './components/cart';
import Footer from './components/footer';
import { SiteHeader } from './components/site-header';
import TailwindIndicator from './components/tailwind-indicator';
import TransactionNotification from './components/transaction';
import UserSidebar from './components/user-sidebar';
import { FundsModal } from './components/user-sidebar/funds';

function PageLayout({ children }) {
    //主题颜色设置
    const theme = useAppStore((s) => s.theme);
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden font-inter-regular">
            <SiteHeader />

            <div className="mx-auto w-screen flex-1 pt-[44px] md:pt-[75px]">{children}</div>

            <UserSidebar />
            <FundsModal />
            {/* <BuyRecorder /> */}
            <TransactionNotification />
            <Cart />
            <KycPromptModal />
            <GoldModal />
            <PreloadIcons />

            <Footer />

            <TailwindIndicator />
        </div>
    );
}
export default PageLayout;

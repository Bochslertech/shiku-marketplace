import { useDeviceStore } from '@/07_stores/device';
import GoldCards from './cards';
import GoldNewsPart from './components/gold-news';
import GoldPricePart from './components/gold-price';

const Items = () => {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    return (
        <>
            <GoldCards />
            <div
                className={`pd-y-[20px] flex h-auto w-full ${
                    isMobile ? 'flex-col' : ''
                } items-start  justify-between lg:h-[605px] lg:pb-[20px] lg:pt-[20px]`}
            >
                <GoldPricePart />
                <GoldNewsPart />
            </div>
        </>
    );
};

export default Items;

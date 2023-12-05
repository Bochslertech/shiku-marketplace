import { useMemo, useState } from 'react';
import { cn } from '@/02_common/cn';
import GoldIntroduction from './components/introduction';
import PriceTrend from './components/price-trend';
import Activity from './tabs/activity';
import Items from './tabs/items';

function GoldMarket() {
    const tabs = useMemo(() => ['Items', 'Activity'], []);
    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    return (
        <div className=" p-[15px] lg:p-0">
            <GoldIntroduction />
            <PriceTrend />
            <div className="lg:px-[40px]">
                <div className=" my-[20px] flex border-b border-[#e0e0e0] font-inter-bold text-[18px]">
                    {tabs.map((item) => {
                        return (
                            <div
                                onClick={() => setSelectedTab(item)}
                                key={item}
                                className={cn([
                                    'mr-[20px] flex cursor-pointer flex-col items-center px-[10px]  text-[#999]',
                                    selectedTab === item && ' text-stress',
                                ])}
                            >
                                {item}
                                <span
                                    className={`mt-[16px] inline-block h-[3px] w-[56px] rounded-md ${
                                        selectedTab === item ? 'bg-[#000]' : 'bg-transparent'
                                    } `}
                                ></span>
                            </div>
                        );
                    })}
                </div>

                {selectedTab === 'Items' ? <Items /> : <Activity />}
            </div>
        </div>
    );
}

export default GoldMarket;

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { queryTokenExchangePriceList } from '@/05_utils/apis/yumi/api';
import { useDeviceStore } from '@/07_stores/device';

type PriceItem = {
    name: string;
    price: number | string;
    up: boolean;
    type: string;
    p: number | string;
    symbol?: string;
};

const PriceTrend = () => {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);
    const [items, setItems] = useState<PriceItem[]>([
        {
            name: 'Gold USD/oz',
            price: 0,
            p: 0,
            up: false,
            type: 'OGY',
        },
        {
            name: 'Gold USD/g',
            price: 0,
            p: 0,
            up: true,
            type: 'XAU',
        },
        {
            name: 'ICP/USD',
            price: 0,
            p: 0,
            up: false,
            type: 'ICP',
        },
    ]);
    useEffect(() => {
        //获取实时涨幅度
        queryTokenExchangePriceList()
            .then((price) => {
                items.forEach((item: PriceItem) => {
                    const it = price.find((i) => i.symbol === item.type);
                    if (it) {
                        item.price = it.price;
                        item.p = it.priceChangePercent;
                        // if (item.type === "OGY") {
                        //   item.price = item.price * 31.1034768;
                        //   item.p = item.p * 31.1034768;
                        // }
                    }
                });
                items[0].price = Number(items[1].price) * 31.1034768;
                items[0].p = items[1].p;
                setItems([...items]);
            })
            .catch((err) => {
                console.error('can not get exchangePrice', err);
            });
    }, []);
    return (
        <div className="my-[20px] box-border flex items-center justify-around overflow-hidden whitespace-nowrap rounded-lg  bg-[#f5f5f5] p-0 text-[12px] lg:m-[20px] lg:mx-[40px]">
            <motion.div
                animate={
                    isMobile
                        ? {
                              x: ['100%', '-100%'],
                          }
                        : {}
                }
                transition={{
                    duration: 20,
                    repeat: Infinity,
                }}
                className="flex lg:w-[100%] "
            >
                {items.map((item) => (
                    <div
                        className=" box-border flex flex-1 flex-row items-center justify-center overflow-hidden  px-[20px]"
                        key={item.name}
                    >
                        <span className="whitespace-nowrap font-extrabold leading-[48px]">
                            {item.name}
                        </span>
                        <span className=" ml-[12px] whitespace-nowrap">
                            {Number(item.price).toFixed(2)}
                        </span>
                        <span
                            className={`ml-[11px] mr-[5px]  border-l-[8px] border-r-[8px]  border-solid  border-x-[transparent] ${
                                Number(item.p) > 0
                                    ? 'block border-b-[13px] border-b-[#1ecc75]'
                                    : 'border-t-[13px] border-t-[#e62243]'
                            }`}
                        ></span>
                        <span className="p">{Number(Number(item.p) * 100).toFixed(2)}%</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default PriceTrend;

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { formatDateByDate } from '@/02_common/data/dates';
import { FirstRenderByData } from '@/02_common/react/render';
import { TokenExchangePrice } from '@/04_apis/yumi/api';
import { queryTokenExchangePriceList } from '@/05_utils/apis/yumi/api';
import { queryGoldTimeSeries } from '@/05_utils/apis/yumi/gold-api';
import { useDeviceStore } from '@/07_stores/device';

const GoldPricePart = () => {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    const [exchangePrice, setExchangePrice] = useState<TokenExchangePrice>({
        symbol: 'XAU',
        price: '0',
        priceChange: 0,
        priceChangePercent: 0,
    });

    const getExchangePrice = () => {
        queryTokenExchangePriceList().then((res) => {
            const find = res.find((item) => item.symbol === 'XAU');
            if (find) setExchangePrice(find);
        });
    };
    const goldCharts = useRef(null);
    const [priceList, setPriceList] = useState<undefined | { Date: Date; Price: number }[]>(
        undefined,
    );

    const [once_chart] = useState(new FirstRenderByData());
    useEffect(
        () =>
            once_chart.once([!!goldCharts.current, !!priceList], () => {
                if (!goldCharts.current || !priceList) return;
                const myChart = echarts.init(goldCharts.current);
                const option = {
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        boundaryGap: false,
                        type: 'category',
                        data: priceList.map((item) => dayjs(item.Date).format('YYYY-MM')),
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#949494',
                                width: 2,
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: ['#f5f5f5'],
                            },
                        },
                        axisLabel: {
                            rotate: isMobile && -90,
                        },
                    },
                    grid: {
                        left: '2%',
                        right: '4%',
                        bottom: '5%',
                        top: '5%',
                        show: false,
                        containLabel: true,
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#949494',
                                width: 2,
                            },
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: ['#f5f5f5'],
                            },
                        },
                    },
                    series: [
                        {
                            data: priceList.map((item) => item.Price),
                            type: 'line',
                            symbol: 'none',
                            itemStyle: { color: '#DBC11A' },
                            lineStyle: {
                                color: '#DBC11A',
                            },
                        },
                    ],
                };
                myChart.setOption(option);
            }),
        [goldCharts, priceList],
    );

    useEffect(() => {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        const now = new Date();
        queryGoldTimeSeries({
            start_at: formatDateByDate(lastYear),
            end_at: formatDateByDate(now),
        }).then((rates) => {
            setPriceList(
                rates.map((item: { tradeAt: string; price: number }) => {
                    return {
                        Date: new Date(item.tradeAt),
                        Price: Number((1 / item.price).toFixed(2)),
                    };
                }),
            );
        });
    }, []);

    useEffect(() => getExchangePrice(), []);

    return (
        <>
            <div className="w-full flex-1">
                <div className="mb-[10px] border-b border-gray-300 pb-[10px] text-lg font-bold">
                    Gold Price
                </div>
                <div className="desc">XAU:USD</div>
                <div className="mb-[28px] flex items-center">
                    <span className="mr-[6px] text-[32px] font-bold">
                        {(Number((31.1034768 * Number(exchangePrice.price)) / 1000) * 1000).toFixed(
                            2,
                        )}
                    </span>
                    <span className="mr-[24px]">USD/oz</span>
                    <span className="add-num">
                        {Number(31.1034768 * Number(exchangePrice.priceChange)).toFixed(2)}
                    </span>
                    <span
                        className={
                            Number(exchangePrice.priceChange) > 0
                                ? 'ml-[11px] mr-[5px] block border-b-[13px] border-l-[8px] border-r-[8px] border-solid border-[#ffffff] border-b-[#1ecc75] bg-transparent'
                                : 'ml-[11px] mr-[5px] block border-l-[8px] border-r-[8px] border-t-[13px] border-solid border-[#ffffff] border-t-[#e62243] bg-transparent'
                        }
                    ></span>
                    <span className="percent">
                        {(Number(exchangePrice.priceChangePercent) * 100).toFixed(2)}%
                    </span>
                </div>
                <div
                    ref={goldCharts}
                    className="h-[414px] rounded-[8px] border border-[#ebebeb]"
                ></div>
            </div>
        </>
    );
};

export default GoldPricePart;

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { FirstRenderByData } from '@/02_common/react/render';

type GoldPrice = {
    year: string;
    sales: number;
};
const NewDashBoard = ({
    volumeData,
    priceDate,
}: {
    volumeData: GoldPrice[];
    priceDate: GoldPrice[];
}) => {
    const volumeContainer = useRef(null);
    const curveContainer = useRef(null);

    const [once_volume] = useState(new FirstRenderByData());
    const [once_curve] = useState(new FirstRenderByData());

    //柱状图
    useEffect(() => {
        once_volume.once([!!volumeContainer.current], () => {
            const myChart = echarts.init(volumeContainer.current);
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                grid: {
                    left: '0%',
                    right: '4%',
                    bottom: '3%',
                    top: '3%',
                    show: true,
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: volumeData.map((item) => item.year),
                        axisTick: {
                            show: false,
                            lineStyle: {
                                color: '#949494',
                            },
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#949494',
                                width: 2,
                            },
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitNumber: 4,
                        max: function (value) {
                            return value.max + 20;
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#949494',
                                width: 2,
                            },
                        },
                    },
                ],
                series: {
                    name: 'Direct',
                    type: 'bar',
                    data: volumeData.map((item) => item.sales),
                    label: {
                        show: true,
                        position: 'top',
                        color: '#5833D8',
                        fontSize: 14,
                        fontFamily: 'inter-medium',
                        backgroundColor: '#fff',
                        borderWidth: 3,
                        borderType: 'solid',
                        width: 38,
                        height: 38,
                        borderRadius: 50,
                        shadowColor: '#BCAEF0',
                        shadowBlur: 7,
                        lineHeight: 37,
                        offset: [0, 14],
                        formatter: (params: { data: number }) => {
                            return params.data.toFixed(1);
                        },
                    },
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(51, 19, 178, 0.40)', // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(230, 223, 255, 0.08)', // 100% 处的颜色
                                },
                            ],
                            global: false, // 缺省为 false
                        },
                    },
                    barMaxWidth: 30,
                },
            };
            myChart.setOption(option);
        });
    }, [volumeContainer.current]);

    //折线图
    useEffect(() => {
        once_curve.once([!curveContainer.current], () => {
            const myChart = echarts.init(curveContainer.current);
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: priceDate.map((item) => item.year),
                    axisTick: {
                        show: false,
                    },
                },
                grid: {
                    left: '0%',
                    right: '4%',
                    bottom: '3%',
                    top: '3%',
                    show: true,
                    containLabel: true,
                },
                yAxis: {
                    type: 'value',
                    splitNumber: 4,
                    max: function (value) {
                        return value.max + 20;
                    },
                    min: 0,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#949494',
                            width: 2,
                        },
                    },
                },
                series: [
                    {
                        data: priceDate.map((item) => item.sales),
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(51, 19, 178, 0.40)', // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(230, 223, 255, 0.08)', // 100% 处的颜色
                                    },
                                ],
                                global: false, // 缺省为 false
                            },
                        },
                    },
                ],
                lineStyle: {
                    color: '#8D8AF9',
                },
            };
            myChart.setOption(option);
        });
    }, [curveContainer.current]);
    return (
        <>
            <div className="w-full">
                <div className=" mb-[32px]">Daily Volume</div>
                <div ref={volumeContainer} className="min-h-[300px]"></div>
            </div>
            <div className="w-full">
                <div className=" mb-[32px]">Price</div>
                <div ref={curveContainer} className="min-h-[300px]"></div>
            </div>
        </>
    );
};
export default NewDashBoard;

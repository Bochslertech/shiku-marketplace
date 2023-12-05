import { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { RankedCollection } from '@/04_apis/yumi/aws';
import { queryRankedCollectionList } from '@/05_utils/apis/yumi/aws';
import message from '@/09_components/message';
import { Button } from '@/09_components/ui/button';
import YumiIcon from '@/09_components/ui/yumi-icon';
import { Items, ItemsSkeleton } from './components/items';
import Top7 from './components/top';
import './index.less';

function RankingPage() {
    const [list, setList] = useState<RankedCollection[]>();

    useEffect(() => {
        queryRankedCollectionList()
            .then(setList)
            .catch((e) => {
                console.debug(`🚀 ~ file: index.tsx:142 ~ useEffect ~ e:`, e);
                message.error(`loading rankings failed`);
            });
    }, []);

    const [show, setShow] = useState<number>(20);

    return (
        <div className="mt-[17px]  w-full overflow-scroll px-[16px] md:mt-[52px]  md:px-[40px]">
            <div className="font-inter-semibold text-[18px] md:text-[24px] ">
                Top collection by volume over last 7 days
            </div>
            <Top7 list={list} />

            <div className="mt-[17px] md:mt-[50px]">
                <div className="w-full overflow-scroll">
                    {' '}
                    <div className="grid w-full min-w-[800px] grid-cols-ranking-table justify-between gap-x-3 rounded-[8px] bg-[#F9F9F9]  px-[15px] py-[10px] font-inter-bold text-[14px] md:px-[57px]  md:py-[21px] md:text-[16px]">
                        <div>Collection</div>
                        <div className="">Vol.</div>
                        <div className="">Floor Price</div>
                        <div className="flex items-center gap-x-[5px]">
                            <span className=" h-[16px] leading-[16px] ">7D%</span>{' '}
                            <Tooltip
                                className="shadow-lg"
                                overlayClassName="ranking-tooltip"
                                color="white"
                                title={'Calculate statistics in UTC+0'}
                                placement="bottom"
                            >
                                <YumiIcon
                                    name="action-question"
                                    size={20}
                                    className="cursor-pointer opacity-20 hover:opacity-100"
                                />
                            </Tooltip>{' '}
                        </div>
                        <div className="">Owners</div>
                        <div className="text-right">Items</div>
                    </div>
                    {!list ? <ItemsSkeleton /> : <Items current={list.slice(0, show)} />}
                </div>
                {list && show < list.length && (
                    <div className="mt-[20px] flex w-full justify-center">
                        <Button onClick={() => setShow((show) => Math.min(show + 10, list.length))}>
                            View More
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RankingPage;

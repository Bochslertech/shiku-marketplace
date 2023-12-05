import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { cdn } from '@/02_common/cdn';
import { formatDateTimeByNano } from '@/02_common/data/dates';
import { GoldNews } from '@/04_apis/yumi/gold-api';
import { queryGoldNewMessage } from '@/05_utils/apis/yumi/gold-api';

function GoldNewsPart() {
    const [news, setNews] = useState<GoldNews[] | []>([]);

    const getNews = () => {
        queryGoldNewMessage().then((res) => {
            setNews(
                res
                    .filter(
                        (n) =>
                            ![
                                '0b44e2fd-261d-48bc-b193-cc82d7a2c4ed', // 这个图片显示不了
                            ].includes(n.uuid),
                    )
                    .slice(0, 4) || [],
            );
        });
    };

    useEffect(() => getNews(), []);
    return (
        <>
            <div className="ml-[10px] mt-[40px] h-full flex-1 lg:mt-0">
                <div className="mb-[10px] border-b border-[#e0e0e0] pb-[10px] text-[18px] font-bold">
                    News
                </div>
                <div
                    className="flex h-full flex-col justify-between"
                    style={{ height: 'calc(100% - 50px)' }}
                >
                    {news.map((item: GoldNews) => {
                        return (
                            <Link
                                key={item.uuid}
                                to={item.url}
                                target="_blank"
                                className="flex"
                                rel="noreferrer"
                            >
                                <img
                                    className="mb-[40px] h-[100px] w-[100px] rounded-[4px] object-cover"
                                    src={cdn(item.image_url)}
                                    alt=""
                                />
                                <div className="ml-[12px] flex h-[100px] flex-1 flex-col justify-between">
                                    <div className="line-clamp-2 overflow-hidden truncate whitespace-normal text-[16px]">
                                        {item.title}
                                    </div>
                                    <div className="text-[12px] text-[#999999]">
                                        {formatDateTimeByNano(
                                            `${dayjs(item.published_at).toDate().getTime() * 1e6}`,
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default GoldNewsPart;

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { cn } from '@/02_common/cn';
import { AppAnnouncement } from '@/03_canisters/yumi/yumi_application';

// PC 界面左边列表
export const AnnouncementListByAll = ({
    announcements,
    current,
    onAnnouncement,
}: {
    announcements: AppAnnouncement[] | undefined;
    current: string | undefined;
    onAnnouncement: (id: string) => void;
}) => {
    return (
        <div
            className="mr-[2px] flex min-w-[380px] flex-col items-end bg-[#fff] px-[30px] py-[70px]"
            style={{ width: 'calc(100% - 1182px)' }}
        >
            <div className="w-full max-w-[350px]">
                {announcements ? (
                    announcements.map((item) => {
                        return (
                            <div
                                key={item.id}
                                onClick={() => onAnnouncement(item.id)}
                                className={cn([
                                    ' h-[40px] w-[370px] cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap pl-[10px] text-[14px] leading-[39px]',
                                    current === item.id &&
                                        'bg-[#f5f5f5] font-inter-bold text-[#000]',
                                ])}
                            >
                                {item.title}
                            </div>
                        );
                    })
                ) : (
                    <Skeleton title={false} paragraph={{ rows: 11 }} active />
                )}
            </div>
        </div>
    );
};

// 手机界面列表页
export const AnnouncementListByPage = ({
    announcements,
}: {
    announcements: AppAnnouncement[] | undefined;
}) => {
    const size = 7;
    const [end, setEnd] = useState<number>(7);

    const wrapped = useMemo(() => {
        if (announcements === undefined) return undefined;
        return announcements.slice(0, end);
    }, [announcements, end]);

    return (
        <div className="w-full px-[20px] pb-[60px] pt-[20px]">
            {wrapped ? (
                <>
                    {wrapped.map((item) => (
                        <Link
                            key={item.id}
                            to={`/announcements/${item.id}`}
                            className=" w-full border-b  border-[#0000001a] py-[10px] text-[14px] leading-[22px]"
                        >
                            <div className="title">{item.title}</div>
                        </Link>
                    ))}
                    {announcements && wrapped.length < announcements.length && (
                        <div
                            className=" mx-auto mt-[50px] flex h-[43px] w-[160px] items-center justify-center border-[#000] border-opacity-[0.3] text-[16px]"
                            onClick={() => setEnd((end) => end + size)}
                        >
                            View more
                        </div>
                    )}
                </>
            ) : (
                <Skeleton
                    title={false}
                    paragraph={{
                        rows: 7,
                    }}
                    active
                />
            )}
        </div>
    );
};

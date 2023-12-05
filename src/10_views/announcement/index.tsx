import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from 'antd';
import { cn } from '@/02_common/cn';
import { useApplicationStore } from '@/07_stores/application';
import { useDeviceStore } from '@/07_stores/device';
import { BrowserView, MobileView } from '@/08_hooks/app/device';
import message from '@/09_components/message';
import { AnnouncementListByAll, AnnouncementListByPage } from './components';
import style from './index.module.less';

function AnnouncementPage() {
    const navigate = useNavigate();
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    const { announcements, reloadAnnouncements } = useApplicationStore((s) => s);
    useEffect(() => {
        if (announcements) return;
        reloadAnnouncements().catch((e) => {
            console.debug(`🚀 ~ file: index.tsx:18 ~ reloadAnnouncements ~ e:`, e);
            message.error(`load announcements failed`);
        });
    }, [announcements]);

    const { id } = useParams(); // 获取参数

    const [current, setCurrent] = useState<string | undefined>(undefined);

    const announcement = useMemo(() => {
        if (announcements === undefined) return undefined;
        if (announcements.length === 0) {
            message.error(`no announcements`);
            return undefined;
        }
        const wrapped_id = id ?? current ?? announcements[0].id;
        const announcement = announcements.find((a) => a.id === wrapped_id);
        if (announcement === undefined) {
            message.error({ content: `wrong id` });
            navigate('/announcements');
            return undefined;
        }
        return announcement;
    }, [announcements, id, current]);

    const onAnnouncement = (id: string) => {
        if (id) navigate(`/announcements/${id}`);
        else setCurrent(id);
    };

    return (
        <div>
            {(!isMobile || id === undefined) && (
                <div
                    className={cn(
                        'flex h-[62px] w-full items-center justify-center bg-[#f5f5f5] text-center font-inter-black leading-[61px]',
                        isMobile ? 'text-[16px]' : 'text-[18px]',
                    )}
                >
                    Announcement
                </div>
            )}
            <div
                className={cn(
                    'flex  w-full max-w-[1920px] items-stretch justify-between',
                    !isMobile && 'min-h-[1008px] bg-[#f5f5f5]',
                )}
            >
                <BrowserView>
                    <AnnouncementListByAll
                        announcements={announcements}
                        current={id ?? current ?? (announcements && announcements[0].id)}
                        onAnnouncement={onAnnouncement}
                    />
                </BrowserView>
                {isMobile && id === undefined ? (
                    <AnnouncementListByPage announcements={announcements} />
                ) : (
                    <>
                        {announcement ? (
                            <>
                                <BrowserView>
                                    <div className=" w-[1180px] bg-[#fff] px-[140px] py-[60px]">
                                        <div className="mb-[15px] w-full break-all font-inter-black text-[18px] leading-[22px]">
                                            {announcement.title}
                                        </div>
                                        <div
                                            className={style['content']}
                                            dangerouslySetInnerHTML={{
                                                __html: announcement.content,
                                            }}
                                        ></div>
                                    </div>
                                </BrowserView>
                                <MobileView>
                                    <div className="w-full px-[20px] pb-[60px] pt-[20px]">
                                        <div className="mb-[15px] w-full break-all font-inter-black text-[18px] leading-[22px]">
                                            {announcement.title}
                                        </div>
                                        <div
                                            className={style['content']}
                                            dangerouslySetInnerHTML={{
                                                __html: announcement.content,
                                            }}
                                        ></div>
                                    </div>
                                </MobileView>
                            </>
                        ) : (
                            <Skeleton title={false} paragraph={{ rows: 11 }} active />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AnnouncementPage;

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Drawer, Empty, message, Skeleton } from 'antd';
import { cn } from '@/02_common/cn';
import { formatDateTimeByNano } from '@/02_common/data/dates';
import { ArtistNotice } from '@/03_canisters/yumi/yumi_artist_router';
import { queryNoticeList, readNotices } from '@/05_utils/canisters/yumi/artist_router';
import { useIdentityStore } from '@/07_stores/identity';
import YumiIcon from '@/09_components/ui/yumi-icon';
import { IconCloseModal, IconDirectionDownSelect } from '../../icons';

// 筛选选项类型
type FilterItem = {
    label: string;
    key?: string;
};

export function NoticeDrawer({
    showNoticeDrawer,
    setShowNoticeDrawer,
}: {
    showNoticeDrawer: boolean;
    setShowNoticeDrawer: (open: boolean) => void;
}) {
    const listenRef = useRef<void | null>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const [open, setOpen] = useState(false);
    const [currentFilter, setCurrentFilter] = useState<FilterItem>({
        label: t('home.notice.viewAll'),
        key: '',
    });
    const [loading, setLoading] = useState(false);
    const [domInnerWidth, seDomInnerWidth] = useState(window.innerWidth);
    const [noticeList, setNoticeList] = useState<ArtistNotice[]>([]);
    const [noticeAllList, setNoticeAllList] = useState<ArtistNotice[]>([]);
    const isAllRead = useMemo(() => {
        if (noticeAllList) {
            return noticeAllList.every((item) => item.status === 'read');
        } else {
            return false;
        }
    }, [noticeAllList]);

    const filterList: FilterItem[] = useMemo(() => {
        return [
            { label: t('home.notice.alreadyRead'), key: 'read' },
            { label: t('home.notice.unread'), key: 'unread' },
            { label: t('home.notice.viewAll'), key: '' },
        ];
    }, [open]);

    // 获取通知
    const getNotice = () => {
        if (identity) {
            setLoading(true);
            // const spend = Spend.start(`uploadFileToBucket:`);

            queryNoticeList(identity)
                .then((list) => {
                    // 筛选
                    let newList = currentFilter.key
                        ? list.filter((s) => s.status === currentFilter.key)
                        : list;
                    newList = newList.map((item: ArtistNotice) => {
                        return item;
                    });

                    newList.sort((a, b) => {
                        return Number(b.timestamp) - Number(a.timestamp);
                    });

                    setLoading(false);
                    setNoticeList(newList);
                    setNoticeAllList(newList);
                })
                .catch((e) => {
                    console.error(e.message);
                    setLoading(false);
                    message.error('load notice failed');
                    // spend.mark('load notice failed');
                    throw e;
                });
        }
    };

    useEffect(() => {
        showNoticeDrawer && getNotice();
        listenRef.current = addEventListener('resize', (event) => {
            const { innerWidth } = event.target as Window;
            seDomInnerWidth(innerWidth);
        });

        return () => {
            listenRef.current = null;
        };
    }, [showNoticeDrawer]);

    // 筛选
    const handleMenuClick = (e) => {
        setCurrentFilter({ label: e.label, key: e.key });
        setOpen(false);
    };

    // 筛选修改之后，重新设置显示notice列表
    useEffect(() => {
        const newList = currentFilter.key
            ? noticeAllList.filter((s) => s.status === currentFilter.key)
            : noticeAllList;

        setNoticeList(newList);
    }, [noticeAllList, currentFilter]);

    // 已读所有
    const markAllRead = () => {
        if (identity) {
            const ids = noticeAllList
                .filter((item) => item.status === 'unread')
                .map((item) => item.id);

            const newAllList = noticeAllList.map((item) => {
                if (ids.indexOf(item.id) > -1) {
                    item.status = 'read';
                }
                return item;
            });
            setNoticeAllList(newAllList);
            ids.length > 0 && readNotices(identity, ids);
        }
    };

    // 已读单条
    const markOneRead = (notice: ArtistNotice) => {
        if (identity) {
            const newAllList = noticeAllList.map((item) => {
                if (notice.id === item.id) {
                    item.status = 'read';
                }
                return item;
            });
            setNoticeAllList(newAllList);
            readNotices(identity, [notice.id]);
        }
    };

    // 点击单条跳转
    const goNoticeDetail = (item: ArtistNotice) => {
        const { accept } = item.result as { accept: string };
        if (accept) {
            navigate(`/profile?tab=Created`);
            markOneRead(item);
            setShowNoticeDrawer(false);
        }
    };

    return (
        <Drawer
            placement="right"
            width={domInnerWidth > 1180 ? '465px' : '100%'}
            contentWrapperStyle={{ height: '685px', top: domInnerWidth < 768 ? 44 : 75 }}
            styles={{
                header: { display: 'none' },
                body: { padding: 0 },
                footer: { padding: 0 },
            }}
            height={667}
            onClose={() => setShowNoticeDrawer(false)}
            open={showNoticeDrawer}
            zIndex={10}
            footer={
                <div
                    className={cn(
                        ['align-center flex cursor-pointer justify-center p-[20px] text-center'],
                        isAllRead ? 'opacity-40' : '',
                    )}
                >
                    <div className="text-[14px]" onClick={() => !isAllRead && markAllRead()}>
                        {t('home.notice.markAsAllRead')}
                    </div>
                    <YumiIcon name="action-read" size={22} color="#333333" className="ml-[5px]" />
                </div>
            }
        >
            <div className="absolute left-0 top-0 flex w-full items-center justify-between bg-white p-[20px]">
                <div className="flex h-[24px] flex-1 items-center text-left text-[20px] font-bold">
                    {t('home.notice.title')}
                </div>
                <div className="flex h-[24px] items-center justify-between">
                    <div className="relative h-[24px]">
                        <div
                            className="text-base[18px] flex h-[24px] items-center"
                            onClick={() => {
                                setOpen(!open);
                            }}
                        >
                            <div className="w-full text-[18px]">{currentFilter.label}</div>
                            <IconDirectionDownSelect
                                className={cn(
                                    ['ml-[15px] h-[12px] w-[12px] transition'],
                                    open ? '' : '-rotate-90',
                                )}
                            />
                        </div>
                        {open ? (
                            <div
                                className={cn(
                                    [
                                        'absolute left-[-20px] top-20 w-[150px] border shadow transition',
                                    ],
                                    open ? '-translate-y-10' : '',
                                )}
                            >
                                {filterList.map((item: FilterItem) => {
                                    return (
                                        <div
                                            key={item?.key}
                                            className={cn(
                                                [
                                                    'w-full px-[20px] py-[14px] text-[16px] hover:bg-[#F9F9F9]',
                                                ],
                                                currentFilter.label === item.label
                                                    ? 'bg-[#F9F9F9] font-bold'
                                                    : 'bg-[#fff]',
                                            )}
                                            onClick={() => {
                                                handleMenuClick(item);
                                            }}
                                        >
                                            {item?.label}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                    <IconCloseModal
                        className="ml-[25px] h-[17px] w-[17px]"
                        onClick={() => setShowNoticeDrawer(false)}
                    />
                </div>
            </div>

            <div className="mt-[64px] min-h-[554px] bg-[#f6f6f6] p-[20px] md:min-h-[560px]">
                {loading && (
                    <div className="">
                        <div className="mb-6 mt-2 flex h-[170px] items-center justify-between rounded bg-white px-[20px] shadow">
                            <Skeleton
                                title={false}
                                paragraph={{
                                    rows: 3,
                                }}
                                active
                            />
                        </div>
                        <div className="mb-6 mt-2 flex h-[170px] items-center justify-between rounded bg-white px-[20px] shadow">
                            <Skeleton
                                title={false}
                                paragraph={{
                                    rows: 3,
                                }}
                                active
                            />
                        </div>
                    </div>
                )}
                {!loading &&
                    noticeList.length > 0 &&
                    noticeList.map((item: ArtistNotice, index: number) => {
                        return (
                            <NoticeItem
                                item={item}
                                index={index}
                                markOneRead={markOneRead}
                                goNoticeDetail={goNoticeDetail}
                            />
                        );
                    })}

                {!loading && noticeList.length === 0 && (
                    <div className="flex min-h-[450px] flex-col justify-center text-center md:min-h-[424px]">
                        <Empty
                            image="https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon-empty.png"
                            imageStyle={{
                                width: 40,
                                height: 40,
                                margin: '0 auto 10px',
                            }}
                            description={
                                <div className="mt-[5px] text-[14px]">
                                    {t('home.notice.noData')}
                                </div>
                            }
                        />
                    </div>
                )}
            </div>
        </Drawer>
    );
}

// 单个消息卡片
const NoticeItem = ({
    item,
    index,
    markOneRead,
    goNoticeDetail,
}: {
    item: ArtistNotice;
    index: number;
    markOneRead: (item: ArtistNotice) => void;
    goNoticeDetail: (item: ArtistNotice) => void;
}) => {
    const { t } = useTranslation();

    const getNoticeContent = (result): string => {
        const { accept, reject } = result;
        return accept
            ? t('home.notice.accept')
            : reject
            ? t('home.notice.reject')
            : t('home.notice.goView');
    };

    return (
        <div
            className={cn(
                ['mb-6 mt-2 flex flex-col items-center justify-between rounded bg-white shadow'],
                item.status === 'read' ? 'text-black/40' : '',
            )}
        >
            <div key={`notice_${item.id}_${index}`} className="w-full">
                <div className="w-full px-6 py-6">
                    <div className="text-[14px]">{formatDateTimeByNano(item.timestamp, '-')}</div>
                    <div
                        className="mt-[20px] text-[14px]"
                        onClick={() => {
                            goNoticeDetail(item);
                        }}
                    >
                        {getNoticeContent(item.result)}
                    </div>
                </div>
                <div className="align-center flex w-full cursor-pointer justify-center border-t-[1px] p-[20px] text-center">
                    <div
                        className="text-[14px]"
                        onClick={() => item.status === 'unread' && markOneRead(item)}
                    >
                        {t('home.notice.markAsRead')}
                    </div>
                    <YumiIcon name="action-read" size={22} color="#333333" className="ml-[5px]" />
                </div>
            </div>
        </div>
    );
};

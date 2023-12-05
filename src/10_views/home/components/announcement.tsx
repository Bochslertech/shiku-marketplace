import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useApplicationStore } from '@/07_stores/application';
import { useDeviceStore } from '@/07_stores/device';
import YumiIcon from '@/09_components/ui/yumi-icon';

const HomeAnnouncement = () => {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    const { announcements, reloadAnnouncements } = useApplicationStore((s) => s);
    useEffect(() => {
        if (announcements) return;
        reloadAnnouncements();
    }, [announcements]);

    const current = useMemo(() => {
        if (announcements === undefined) return undefined;
        return announcements.slice(0, 3);
    }, [announcements]);

    if (current === undefined) return <></>;
    return (
        <div className="mx-auto mt-[8px] w-full max-w-[1920px] bg-[#f2f2f2] lg:px-[40px]">
            <div className="relative mx-auto h-[64px] w-full overflow-hidden">
                <Swiper
                    className="announcement-cells"
                    direction="vertical"
                    height={isMobile ? 106 : 64}
                    loop={true}
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 3000,
                        stopOnLastSlide: false,
                        disableOnInteraction: true,
                    }}
                >
                    {current.map((item) => {
                        return (
                            <SwiperSlide key={item.id}>
                                <div className="flex h-[53px] w-full flex-col items-start py-[11px] pl-[15px] text-[12px] lg:h-[64px] lg:flex-row  lg:items-center lg:justify-between lg:py-0 lg:pr-[252px] lg:text-[14px]">
                                    <Link
                                        to={`/announcements/${item.id}`}
                                        className=" cursor-pointer overflow-hidden text-ellipsis break-all font-inter-semibold leading-[31px] hover:underline lg:leading-[17px] "
                                        style={{ width: 'calc(100% - 150px)' }}
                                    >
                                        {item.title}
                                    </Link>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                <Link
                    to="/announcements"
                    className="absolute right-[20px] top-[27px] z-10 flex cursor-pointer items-center font-inter-semibold text-[12px] text-[#999] hover:text-[#000] md:text-[14px] lg:right-0 lg:top-[50%] lg:pr-[6px]"
                    style={{ transform: 'translateY(-50%)' }}
                >
                    Read more
                    <YumiIcon
                        name="arrow-right"
                        size={28}
                        className="ml-[7px] text-[#999] hover:text-[#666]"
                    />
                </Link>
            </div>
        </div>
    );
};

export default HomeAnnouncement;

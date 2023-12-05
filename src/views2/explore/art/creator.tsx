import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { cdn } from '@/02_common/cdn';

function ArtistCreator() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col">
            <div className="relative flex w-full">
                <img
                    className="hidden h-[274px] w-full object-cover md:flex"
                    src={cdn(
                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/banner/1676456829786_creators.png',
                    )}
                    alt=""
                />
                <img
                    className="flex h-[100px] w-full object-cover md:hidden"
                    src={cdn(
                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/artist/1660186429602_creatorMobilebg.png',
                    )}
                    alt=""
                />
                <span className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center">
                    <p className="font-[Inter-Black] text-[20px] text-[#fff] md:text-[62px]">
                        {t('explore.creator.title1')}
                    </p>
                    <p className="font-[Inter-Black] text-[20px] text-[#fff] md:text-[62px]">
                        {t('explore.creator.title2')}
                    </p>
                </span>
            </div>
            <div className="mx-auto mt-[30px] flex w-full max-w-[1100px] flex-col bg-white px-[20px] md:mt-[120px] md:px-[30px]">
                <p className="text-center font-[Inter-Black] text-[32px] text-[#000]">
                    {t('explore.creator.advantages.title')}
                </p>
                <div className="relative flex w-full flex-col pt-[20px] md:flex-row md:pt-[60px]">
                    <img
                        className="absolute -top-[25px] hidden scale-50 md:-right-[200px] md:top-0 md:flex"
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/artist/1659492017501_点点.png',
                        )}
                        alt=""
                    />
                    <div className="relative z-10 mb-[20px] mr-0 flex flex-1 flex-col items-center rounded-[8px] bg-white px-5 pb-5 shadow-md md:mb-0 md:mr-[40px] md:h-[240px] md:pb-0">
                        <img
                            className="mt-[30px] h-[58px] w-[58px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/artist/1659492017495_creator Group2.png',
                            )}
                            alt=""
                        />
                        <p className="mt-5 line-clamp-2 h-[54px] text-center font-[Inter-Black] text-[18px] text-[#000]">
                            {t('explore.creator.advantages.text1')}
                        </p>
                        <p className="mt-[15px] line-clamp-3 text-center font-[Inter-Regular] text-[14px] leading-[17px] text-[#999]">
                            {t('explore.creator.advantages.text4')}
                        </p>
                    </div>
                    <div className="relative z-10 mb-[20px] mr-0 flex flex-1 flex-col items-center rounded-[8px] bg-white px-5 pb-5 shadow-md md:mb-0 md:mr-[40px] md:h-[240px] md:pb-0">
                        <img
                            className="mt-[30px] h-[58px] w-[58px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/artist/1659492017496_creator Group3.png',
                            )}
                            alt=""
                        />
                        <p className="mt-5 h-[54px] text-center font-[Inter-Black] text-[18px] text-[#000]">
                            {t('explore.creator.advantages.text2')}
                        </p>
                        <p className="mt-[15px] text-center font-[Inter-Regular] text-[14px] leading-[17px] text-[#999]">
                            {t('explore.creator.advantages.text5')}
                        </p>
                    </div>
                    <div className="relative z-10 mb-[20px] flex flex-1 flex-col items-center rounded-[8px] bg-white px-5 pb-5 shadow-md md:mb-0 md:h-[240px] md:pb-0">
                        <img
                            className="mt-[30px] h-[58px] w-[58px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/artist/1659492017492_creator Group1.png',
                            )}
                            alt=""
                        />
                        <p className="mt-5 h-[54px] text-center font-[Inter-Black] text-[18px] text-[#000]">
                            {t('explore.creator.advantages.text3')}
                        </p>
                        <p className="mt-[15px] text-center font-[Inter-Regular] text-[14px] leading-[17px] text-[#999]">
                            {t('explore.creator.advantages.text6')}
                        </p>
                    </div>
                </div>
                <Link
                    to={`/art/apply`}
                    className="mx-auto mt-[40px] flex h-[48px] w-[160px] items-center justify-center bg-black text-[16px] font-bold text-white md:mt-[120px]"
                >
                    {t('explore.creator.advantages.become')}
                </Link>
                <div className="mx-auto mt-[120px] hidden w-[688px] justify-center text-center font-[Inter-Black] text-[20px] text-[#000] md:flex md:text-[32px]">
                    {t('explore.creator.creator.title')}
                </div>
                <div className="mt-[60px] grid grid-cols-1 gap-x-[40px] gap-y-[40px] md:grid-cols-2">
                    <div className="flex h-[140px] flex-col justify-between rounded-[8px] px-[30px] py-[20px] shadow-md md:h-[170px] md:px-[20px] md:py-[30px]">
                        <img
                            className="h-[58px] w-[58px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/artist/1659492017497_creator icon1.png',
                            )}
                            alt=""
                        />
                        <p className="font-[Inter-Black] text-[18px] text-[#000]">
                            {t('explore.creator.creator.text1')}
                        </p>
                    </div>
                    <div className="flex h-[140px] flex-col justify-between rounded-[8px] px-[30px] py-[20px] shadow-md md:h-[170px] md:px-[20px] md:py-[30px]">
                        <img
                            className="h-[58px] w-[58px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/artist/1659492017499_creator icon2.png',
                            )}
                            alt=""
                        />
                        <p className="font-[Inter-Black] text-[18px] text-[#000]">
                            {t('explore.creator.creator.text2')}
                        </p>
                    </div>
                    <div className="flex h-[140px] flex-col justify-between rounded-[8px] px-[30px] py-[20px] shadow-md md:h-[170px] md:px-[20px] md:py-[30px]">
                        <img
                            className="h-[58px] w-[58px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/artist/1659492017500_creator icon3.png',
                            )}
                            alt=""
                        />
                        <p className="font-[Inter-Black] text-[18px] text-[#000]">
                            {t('explore.creator.creator.text3')}
                        </p>
                    </div>
                    <div className="flex h-[140px] flex-col justify-between rounded-[8px] px-[30px] py-[20px] shadow-md md:h-[170px] md:px-[20px] md:py-[30px]">
                        <img
                            className="h-[58px] w-[58px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/artist/1659492017500_creator icon4.png',
                            )}
                            alt=""
                        />
                        <p className="font-[Inter-Black] text-[18px] text-[#000]">
                            {t('explore.creator.creator.text4')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArtistCreator;

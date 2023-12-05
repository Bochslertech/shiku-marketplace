import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { cdn_by_assets, url_cdn_by_assets } from '@/02_common/cdn';
import { Button } from '@/09_components/ui/button';

export default function HomePartner() {
    const { t } = useTranslation();
    return (
        <div className="mx-auto max-w-[1920px]">
            <div
                className="mr-10 mt-[30px] flex w-full flex-col items-center justify-between rounded-t-3xl bg-[length:100%_100%] bg-center px-5 py-6  md:mt-[50px] md:flex-row md:px-[40px] md:py-[60px]"
                style={{
                    backgroundImage: `${url_cdn_by_assets('/images/home/partner-background.png')}`,
                }}
            >
                <div className="w-[100%] md:w-[30%]">
                    <div className="font-inter-medium text-[26px] leading-[39px]">
                        {t('home.partner.title')}
                    </div>
                    <img
                        src={cdn_by_assets('/images/home/partner-nfts.png')}
                        className="my-4 flex w-[100%] md:hidden"
                        alt=""
                    />
                    <div className="font-normals mb-[30px] mt-[10px] break-words text-[14px] leading-[134%] text-[#666c] md:mb-[70px]">
                        {t('home.partner.tip')}
                    </div>
                    <div className="flex justify-between md:justify-start">
                        <Link to={'/art/create'}>
                            <Button className="mr-4 h-[45px] w-[160px] border border-gray-700 border-opacity-50 bg-transparent text-[#000] hover:bg-[#000] hover:text-[#fff] md:mr-14 md:w-[142px]">
                                {t('home.partner.contact')}
                            </Button>
                        </Link>
                        <Link
                            to={
                                'https://yuminftmarketplace.gitbook.io/yumi-docs/creating/collaboration-with-yumi'
                            }
                            target="_blank"
                        >
                            <Button className="h-[45px] w-[160px] border border-gray-700 border-opacity-50 bg-transparent text-[#000] hover:bg-[#000] hover:text-[#fff] md:w-[142px]">
                                {t('home.partner.guide')}
                            </Button>
                        </Link>
                    </div>
                </div>
                <img
                    src={cdn_by_assets('/images/home/partner-nfts.png')}
                    className="hidden w-[66%] md:flex"
                    alt=""
                />
            </div>
        </div>
    );
}

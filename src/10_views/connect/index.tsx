import { Link, useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { ConnectType } from '@/01_types/identity';
import { url_cdn_by_assets } from '@/02_common/cdn';
import { useConnectHooks } from '@/08_hooks/views/connect';
import { IconLogoShiku } from '@/09_components/icons';
import YumiIcon from '@/09_components/ui/yumi-icon';

// wallet icons
const WALLET_ICONS: Record<ConnectType, [string, number]> = {
    me: ['me.svg', 1],
    infinity: ['infinity.svg', 0.8],
    ii: ['ii.svg', 0.9],
    plug: ['plug.svg', 0.95],
    nfid: ['nfid.svg', 1.05],
    stoic: ['stoic.png', 0.85],
};

function ConnectPage() {
    const navigate = useNavigate();

    const { records, onConnect } = useConnectHooks();

    return (
        <div className="absolute left-0 top-0 z-50 flex max-h-screen w-full bg-white">
            <div
                className="relative hidden h-screen bg-cover bg-no-repeat md:w-[423px] lg:flex"
                style={{ backgroundImage: url_cdn_by_assets('/images/connect/background.png') }}
            >
                <div
                    className="ml-[30px] mt-[25px] h-[32px] w-[130px] bg-contain bg-no-repeat"
                    style={{ backgroundImage: url_cdn_by_assets('/svgs/logo/yumi-white.svg') }}
                />
                <div className="absolute bottom-[23px] mx-[41px]  font-inter-medium text-[14px] leading-[17px]  text-white/[.8]">
                    {t('home.connect.leftImage.text')}
                </div>
            </div>
            <div className="scrollbar-none box-border flex h-screen flex-col overflow-scroll pl-[15px] pr-[15px] pt-[17px] md:pl-[132px]  md:pt-[44px] ">
                <IconLogoShiku
                    className="mb-[31px] h-[24px] w-[91px] flex-shrink-0 cursor-pointer bg-cover bg-center bg-no-repeat md:hidden"
                    onClick={() => navigate('/')}
                />

                <h1 className="hidden w-full font-inter-bold text-3xl font-bold leading-[38px] text-black md:block">
                    {t('home.connect.text')}
                </h1>
                <div className="flex items-center justify-between md:hidden">
                    <h1 className="w-full font-inter-bold text-3xl font-bold leading-[38px] text-black">
                        {t('home.connect.text')}
                    </h1>
                    <div
                        className="group h-[20px] w-[20px] cursor-pointer bg-contain"
                        onClick={() => navigate(-1)}
                    >
                        <YumiIcon
                            name="action-close"
                            className="text-[#CBCBCB] group-hover:text-black"
                        />
                    </div>
                </div>
                <div className="mt-[14px] max-w-[420px] text-[14px] leading-[24px] text-black/[.8] md:mt-[9px]">
                    {t('home.connect.intro')}
                </div>
                <div className="connect-types mt-[30px] flex flex-col gap-[16px]">
                    {records.map((r) => (
                        <div
                            className="flex h-[50px] w-full cursor-pointer items-center rounded-lg border border-solid border-gray-200 hover:border-black md:h-[55px] md:w-[402px]"
                            key={r.type}
                        >
                            <button
                                className="ml-[38px] flex w-full items-center justify-start pb-[3px] pt-[3px] md:ml-[28px] md:py-3 "
                                onClick={() => onConnect(r.type)}
                            >
                                <div
                                    className={'flex h-[44px] w-[44px] items-center justify-center'}
                                >
                                    <div
                                        className="h-[44px] w-[44px] bg-cover bg-no-repeat"
                                        style={{
                                            backgroundImage: `${url_cdn_by_assets(
                                                `/images/connect/type/${WALLET_ICONS[r.type][0]}`,
                                            )}`,
                                            transform: `scale(${WALLET_ICONS[r.type][1]})`,
                                        }}
                                    ></div>
                                </div>
                                <div className="ml-[16px] flex flex-col justify-center font-inter-medium text-[12px] font-bold md:text-[14px]">
                                    {t(`home.wallet.${r.type}`)}
                                </div>
                                {/* <div>{`身份个数: ${r.connectIdentities} | 总次数: ${
                                    r.allConnectTimes
                                } | 上次该方式身份: ${r.latestPrincipal} | 上次时间: ${
                                    r.latestTimestamp === 0 ? '--' : new Date(r.latestTimestamp)
                                }${latestContentType === r.type ? ' 上次选择' : ''}`}</div> */}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex w-full md:block md:w-[402px]">
                    <div className="mt-[40px] font-inter-medium text-[14px] text-symbol md:mt-[20px]">
                        {t('home.connect.learnMore.text')}
                        <Link
                            to="https://yuminftmarketplace.gitbook.io/yumi-docs/getting-started/install-a-wallet"
                            target="_blank"
                            className="text-[#472AAF]"
                        >
                            {t('home.connect.learnMore.link')}
                        </Link>
                    </div>
                </div>
            </div>
            <div
                className="group absolute right-[27px] top-[27px] hidden h-[17px] w-[17px] cursor-pointer bg-contain md:block"
                onClick={() => navigate(-1)}
            >
                <YumiIcon name="action-close" className="text-[#CBCBCB] group-hover:text-black" />
            </div>
        </div>
    );
}

export default ConnectPage;

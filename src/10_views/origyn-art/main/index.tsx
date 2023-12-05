import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { cdn } from '@/02_common/cdn';
import { AssureLink } from '@/02_common/react/link';
import { useIdentityStore } from '@/07_stores/identity';
import { IconLogoYumiWhite } from '@/09_components/icons';
import YumiIcon from '@/09_components/ui/yumi-icon';
import './index.less';

function OrigynArtMainPage() {
    const { t } = useTranslation();
    const identity = useIdentityStore((s) => s.connectedIdentity);
    return (
        <div className="flex flex-col bg-[#f5f5f5]">
            <div className="top-bj">
                <div className="top-linear">
                    <div className="flex w-full flex-col items-center">
                        <img
                            className="mt-[50px] w-[140px] md:mt-[93px] md:w-[194px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1666835521234_origyn-logo.png',
                            )}
                            alt=""
                        />
                        <h1 className="mt-[40px] text-center font-[Montserrat-Bold] text-[45px] font-bold leading-[50px] text-[#151515] md:text-[90px] md:leading-[85px]">
                            {t('owned.main.title')}
                            <br />
                            {t('owned.main.title2')}
                        </h1>
                        <p className="mt-[22px] w-full px-5 text-center font-[Montserrat-Regular] text-[18px] font-light leading-[30px] text-[#151515]/80 md:w-[628px] md:text-[20px] md:leading-[35px]">
                            {t('owned.main.tip')}
                        </p>
                    </div>

                    <div className="mx-auto mt-7 flex w-full flex-col items-center px-5 md:mt-10 md:w-[1020px]">
                        <p className="mb-[30px] text-center font-[Montserrat-ExtraBold] text-[14px] font-bold tracking-[2px] md:mb-[80px] md:text-[18px]">
                            {t('owned.main.explore')}
                        </p>

                        <div className="mt-[20px] flex w-full flex-col md:mt-[25px] md:flex-row">
                            <div className="mb-4 flex h-[350px] flex-shrink-0 flex-col items-center justify-center rounded-[8px] bg-[#000]/80 md:mb-0 md:mr-[20px] md:h-[480px] md:flex-1">
                                <h2 className="mb-7 font-[Montserrat-Bold] text-[28px] font-bold text-[#fff] md:text-[50px]">
                                    {t('owned.main.card1.title')}
                                </h2>
                                <p className="mb-1 text-center text-[16px] text-[#fff]/60 md:text-[18px]">
                                    {t('owned.main.card1.text1')}
                                </p>
                                <p className="mb-1 text-center text-[16px] text-[#fff]/60 md:text-[18px]">
                                    {t('owned.main.card1.text2')}
                                </p>
                                <p className="mb-1 text-center text-[16px] text-[#fff]/60 md:text-[18px]">
                                    {t('owned.main.card1.text3')}
                                </p>
                                <Link
                                    to="/origyn/launchpad"
                                    className="mt-[30px] flex h-[55px] w-[172px] cursor-pointer items-center justify-center bg-[#fff] text-[14px] font-bold text-[#000] duration-150 hover:bg-[#fff]/80"
                                >
                                    {t('owned.main.exploreBtn')}
                                </Link>
                            </div>
                            <div className="flex h-[350px] flex-shrink-0 flex-col items-center justify-center rounded-[8px] bg-[#000]/80 md:h-[480px] md:flex-1">
                                <h2 className="mb-7 font-[Montserrat-Bold] text-[28px] font-bold text-[#fff] md:text-[50px]">
                                    {t('owned.main.card2.title')}
                                </h2>
                                <p className="mb-1 text-center text-[16px] text-[#fff]/60 md:text-[18px]">
                                    {t('owned.main.card2.text1')}
                                </p>
                                <p className="mb-1 text-center text-[16px] text-[#fff]/60 md:text-[18px]">
                                    {t('owned.main.card2.text2')}
                                </p>
                                <p className="mb-1 text-center text-[16px] text-[#fff]/60 md:text-[18px]">
                                    &nbsp;
                                </p>
                                <Link
                                    to="/origyn/market"
                                    className="mt-[30px] flex h-[55px] w-[172px] cursor-pointer items-center justify-center bg-[#fff] text-[14px] font-bold text-[#000] duration-150 hover:bg-[#fff]/80"
                                >
                                    {t('owned.main.exploreBtn')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-7 flex w-full flex-col items-center px-5 md:mt-10 md:w-[1020px]">
                <div className="relative mt-[20px] flex w-full flex-col border border-[#E5E5E5] bg-white px-[20px] py-[20px] md:mt-[25px] md:px-[96px] md:pt-[46px]">
                    <div className="flex w-full text-[28px] md:w-[375px] md:text-[38px]">
                        {t('owned.main.wallet.title')}
                    </div>
                    <p className="mt-[10px] w-full font-[Inter-Light] text-[14px] font-light leading-[24px] text-[#000]/60 md:mt-[18px] md:w-[450px] md:text-[18px]">
                        {t('owned.main.wallet.tip')}
                    </p>

                    <div className="co-card-bg relative mt-5 flex h-auto w-full flex-col justify-center overflow-hidden rounded-[10px] py-5 md:h-[293px] md:flex-row md:items-center md:py-0 md:pl-0 md:pt-0">
                        <img
                            className="relative z-10 h-[135px] w-[135px] md:ml-[50px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1670827648129_origyn-home-step-icon-1.png',
                            )}
                            alt=""
                        />
                        <div className="relative -top-[30px] ml-8 mr-4 mt-3 flex h-full flex-1 md:top-0 md:ml-4 md:mr-0 md:mt-0 md:items-center">
                            <p className="relative z-10 w-full text-[16px] font-light leading-[30px] text-[#fffc] md:w-[45%] md:text-[20px]">
                                {t('owned.main.card3.text1')}{' '}
                                <Link
                                    to="https://astrox.me/"
                                    target="_blank"
                                    className="cursor-pointer underline underline-offset-1"
                                >
                                    {t('owned.main.card3.me')}
                                </Link>
                                ,{' '}
                                <Link
                                    to="https://wallet.infinityswap.one"
                                    target="_blank"
                                    className="cursor-pointer underline underline-offset-1"
                                >
                                    {t('owned.main.card3.iw')}
                                </Link>
                                ,{' '}
                                <Link
                                    to="https://identity.ic0.app"
                                    target="_blank"
                                    className="cursor-pointer underline underline-offset-1"
                                >
                                    {t('owned.main.card3.ii')}
                                </Link>{' '}
                                ,
                                <Link
                                    to="https://plugwallet.ooo"
                                    target="_blank"
                                    className="cursor-pointer underline underline-offset-1"
                                >
                                    {t('owned.main.card3.plug')}
                                </Link>{' '}
                                {t('owned.main.card3.and')}{' '}
                                <Link
                                    to="https://www.stoicwallet.com"
                                    target="_blank"
                                    className="cursor-pointer underline underline-offset-1"
                                >
                                    {t('owned.main.card3.stoic')}
                                </Link>
                                .
                            </p>
                        </div>
                        <img
                            className="absolute right-0 top-0 hidden h-full object-cover md:flex"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1670481922173_origyn-home-step-bg-1.png',
                            )}
                            alt=""
                        />
                        <img
                            className="absolute right-0 top-0 flex h-full object-cover md:hidden"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1671004266255_origyn-home-step-mobile-bg-1.png',
                            )}
                            alt=""
                        />
                    </div>
                    <div className="co-card-bg relative mt-5 flex h-auto w-full flex-col justify-center overflow-hidden rounded-[10px] py-5 md:h-[293px] md:flex-row md:items-center md:py-0 md:pl-0 md:pt-0">
                        <img
                            className="relative z-10 h-[135px] w-[135px] md:ml-[50px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1670827648134_origyn-home-step-icon-2.png',
                            )}
                            alt=""
                        />
                        <div className="relative -top-[30px] ml-8 mr-4 mt-3 flex h-full flex-1 md:top-0 md:ml-4 md:mr-0 md:mt-0 md:items-center">
                            <p className="relative z-10 w-full text-[16px] font-light leading-[30px] text-[#fffc] md:w-[45%] md:text-[20px]">
                                {t('owned.main.card3.text2')}{' '}
                                <Link
                                    to="https://www.coinbase.com/price/internet-computer"
                                    target="_blank"
                                    className="cursor-pointer underline underline-offset-1"
                                >
                                    {t('owned.main.card3.coinbase')}
                                </Link>
                                ,{' '}
                                <Link
                                    to="https://www.binance.com/en/trade/ICP_BUSD?_from=markets&type=spot"
                                    target="_blank"
                                    className="cursor-pointer underline underline-offset-1"
                                >
                                    {t('owned.main.card3.binance')}
                                </Link>
                                ,{' '}
                                <Link
                                    to="https://www.kraken.com/prices/internet-computer"
                                    target="_blank"
                                    className="cursor-pointer underline underline-offset-1"
                                >
                                    {t('owned.main.card3.kraken')}
                                </Link>
                                ,{' '}
                                <Link
                                    to="https://www.huobi.com/en-us/exchange/icp_btc/"
                                    target="_blank"
                                    className="cursor-pointer underline underline-offset-1"
                                >
                                    {t('owned.main.card3.huobi')}
                                </Link>
                                ,{' '}
                                <Link
                                    to="https://trading.bitfinex.com/t/ICP:USD?type=exchange"
                                    target="_blank"
                                    className="cursor-pointer underline underline-offset-1"
                                >
                                    {t('owned.main.card3.bitfinex')}
                                </Link>
                                , {t('owned.main.card3.other')}.
                            </p>
                        </div>
                        <img
                            className="absolute right-0 top-0 hidden h-full object-cover md:flex"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1670481922172_origyn-home-step-bg-2.png',
                            )}
                            alt=""
                        />
                        <img
                            className="absolute right-0 top-0 flex h-full object-cover md:hidden"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1671004266258_origyn-home-step-mobile-bg-2.png',
                            )}
                            alt=""
                        />
                    </div>
                    <div className="co-card-bg relative mt-5 flex h-auto w-full flex-col justify-center overflow-hidden rounded-[10px] py-5 pb-14 md:h-[293px] md:flex-row md:items-center md:py-0 md:pl-0 md:pt-0">
                        <img
                            className="relative z-10 h-[135px] w-[135px] md:ml-[50px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1670827648136_origyn-home-step-icon-3.png',
                            )}
                            alt=""
                        />
                        <div className="relative -top-[30px] ml-8 mr-4 mt-3 flex h-full flex-1 md:top-0 md:ml-4 md:mr-0 md:mt-0 md:items-center">
                            <p className="relative z-10 w-full text-[16px] font-light leading-[30px] text-[#fffc] md:w-[45%] md:text-[22px]">
                                {t('owned.main.card3.text6')}
                            </p>
                        </div>
                        <img
                            className="absolute right-0 top-0 hidden h-full object-cover md:flex"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1670481922170_origyn-home-step-bg-3.png',
                            )}
                            alt=""
                        />
                        <img
                            className="absolute right-0 top-0 flex h-full object-cover md:hidden"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1671004266249_origyn-home-step-mobile-bg-3.png',
                            )}
                            alt=""
                        />
                    </div>

                    <div className="relative z-20 mx-auto -mt-[60px] flex w-[80%] md:-mt-[50px]">
                        <AssureLink
                            to={!identity ? `/connect` : undefined}
                            className="co-card-bg2 rounded-[30px] px-[20px] py-3 text-[16px] font-light leading-[30px] text-[#fffc] md:rounded-full md:px-[80px] md:py-5 md:text-[22px]"
                        >
                            {t('owned.main.card3.text4')}{' '}
                            <IconLogoYumiWhite className="inline h-[17px]" />{' '}
                            {t('owned.main.card3.text5')}
                        </AssureLink>
                    </div>

                    <div className="relative z-10 mt-[15px] w-full text-center font-[Montserrat-Light] text-[12px] font-light text-[#0009] md:mt-[37px] md:text-[16px]">
                        {t('owned.main.card3.text3')}{' '}
                        <Link
                            to="https://yuminftmarketplace.gitbook.io/yumi-docs/getiing-started/install-a-wallet"
                            target="_blank"
                            className="cursor-pointer underline-offset-1"
                        >
                            {t('owned.main.card3.gitBook')}
                        </Link>
                        .
                    </div>
                </div>

                <div className="relative my-[20px] flex w-full flex-col bg-white md:my-[60px] md:flex-row">
                    <div className="flex flex-1 flex-shrink-0 flex-col items-center md:items-start ">
                        <div className="flex h-full flex-col items-center justify-center px-5 py-8 text-center md:pl-[70px] md:pr-[50px] md:text-left">
                            <h2 className="text-[22px] font-bold leading-[26px] md:text-[42px] md:leading-[50px]">
                                {t('owned.main.foundation.title')}
                            </h2>
                            <p className="mt-[20px] text-[14px] text-[#000] md:mt-[38px]">
                                {t('owned.main.foundation.text1')}
                            </p>
                            <p className="mt-[20px] text-[14px] text-[#000]">
                                {t('owned.main.foundation.text2')}
                            </p>
                            <Link
                                to="https://www.origyn.com"
                                target="_blank"
                                className="mt-4 flex w-full items-center justify-center text-center font-[Montserrat-Bold] text-[18px] font-bold md:mt-9 md:justify-start md:text-left"
                            >
                                {t('owned.main.foundation.more')}
                                <YumiIcon name="action-skip" size={22} className="ml-2" />
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-shrink-0">
                        <img
                            className="w-full flex-shrink-0"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1666836504593_origyn-home-bottom-cover.png',
                            )}
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrigynArtMainPage;

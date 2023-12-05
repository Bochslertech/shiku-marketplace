import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Checkbox, InputNumber, Modal, Tooltip } from 'antd';
import { cdn, cdn_by_assets } from '@/02_common/cdn';
import { IconCloseModal } from '@/09_components/icons';
import YumiIcon from '@/09_components/ui/yumi-icon';
import OrigynArtEmail from './components/email';
import './index.less';

function TooltipTip() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col p-4">
            <p className="text-[14px] leading-5 text-[#fff]">
                {t('owned.launchpad.tooltipTipText1')}
            </p>
            <p className="mt-5 text-[14px] leading-5 text-[#fff]">
                1.<strong>{t('owned.launchpad.tooltipTipText2')}</strong>
                {t('owned.launchpad.tooltipTipText3')}
            </p>
            <p className="mt-5 text-[14px] leading-5 text-[#fff]">
                2.
                <strong>{t('owned.launchpad.tooltipTipText4')}</strong>
                {t('owned.launchpad.tooltipTipText5')}
            </p>
        </div>
    );
}

function OrigynArtLaunchpad() {
    const { t } = useTranslation();

    const [loading, setLoading] = useState<boolean>(true);
    const [isBuyDisabled, setIsBuyDisabled] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
        setTimeout(() => setIsBuyDisabled(false), 2000);
    }, []);

    const [open, setOpen] = useState(false);
    const onConditionsChange = () => {
        console.log('onConditionsChange');
    };
    return (
        <>
            <div className="flex w-full flex-col bg-[#f6f6f6] pt-[20px]">
                <div className="mx-auto mt-2 flex w-full flex-col items-center px-5 md:mt-7 md:w-[1200px]">
                    <h1 className="text-center font-[Montserrat-Bold] text-[35px] font-bold leading-[50px] text-[#151515] md:text-[90px] md:leading-[85px]">
                        {t('owned.launchpad.title')}
                        <br />
                        {t('owned.launchpad.title2')}
                    </h1>
                    <p className="mt-[10px] w-full text-center font-[Inter-Light] text-[14px] font-light leading-[24px] text-[#151515]/80 md:mt-[22px] md:w-[460px] md:text-[18px] md:leading-[26px]">
                        {t('owned.launchpad.tip')}
                    </p>
                    {loading ? (
                        <div className="mb-[200px] mt-20 flex h-[100px] w-[100px]">
                            <img
                                className="flex h-full w-full"
                                src={cdn_by_assets('/images/common/loading.gif')}
                                alt=""
                            />
                        </div>
                    ) : (
                        <div className="mb-[60px] mt-[20px] flex w-full flex-col bg-white md:mt-[47px] md:flex-row">
                            <div className="custom-gradient flex h-full w-full md:w-2/5">
                                <div className="flex items-center justify-center md:my-[124px]">
                                    <img
                                        className="w-[100%] md:w-[60%]"
                                        src={cdn(
                                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669630828531_land-page-banner.png',
                                        )}
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div className="flex w-full flex-col px-5 md:w-3/5 md:pl-[84px] md:pr-[44px]">
                                <h2 className="pt-[30px] font-[Inter-Bold] text-[25px] font-bold italic leading-[25px] md:pt-[54px] md:text-[50px] md:leading-[50px]">
                                    Suzanne walking in leather skirt. 3, 2008
                                </h2>
                                <div className="mt-[20px] flex w-full flex-col md:mt-[30px] md:flex-row">
                                    <div className="mb-[15px] flex flex-1 flex-col md:mb-0 md:mr-[40px]">
                                        <p className="mb-[5px] flex text-[15px] font-bold text-[#000] md:mb-[18px]">
                                            {t('owned.launchpad.julian')}
                                        </p>
                                        <p className="flex font-[Montserrat-Regular] text-[14px] text-[#151515]">
                                            Vinyl on wooden stretcher 222 x 110,3 cm | 87 x 43 in.
                                            Stored in a secured vault in Switzerland
                                        </p>
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <p className="mb-[5px] flex text-[15px] font-bold text-[#000] md:mb-[18px]">
                                            {t('owned.launchpad.about')}
                                        </p>
                                        <p className="flex font-[Montserrat-Regular] text-[14px] text-[#151515]">
                                            The collection consists of 1000 NFTs, each representing
                                            a unique piece of the physical artwork and identified by
                                            coordinates and ID
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-[30px] flex w-full rounded-t-[3px] border border-[#d8d8d8]/80 md:rounded-[3px]">
                                    <div className="flex w-1/2 flex-col border-r py-3 pl-[19px] md:w-4/12">
                                        <p className="mb-[9px] text-[12px] font-bold">
                                            {t('owned.launchpad.price')}
                                        </p>
                                        <strong className="flex items-center text-[17px] font-bold">
                                            <img
                                                className="mr-1 h-[20px] w-[20px]"
                                                src={cdn(
                                                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon_icp.png',
                                                )}
                                                alt=""
                                            />
                                            35 ICP
                                        </strong>
                                    </div>
                                    <div className="hidden w-5/12 flex-col border-r py-3 pl-[19px] pr-[19px] md:flex">
                                        <p className="mb-[9px] text-[12px] font-bold">
                                            {t('owned.launchpad.time')}
                                        </p>
                                        <div className="flex rounded-[3px] border border-[#d8d8d8]/80">
                                            <span className="flex flex-1 flex-col items-center justify-center border-r border-[#d8d8d8]/80 py-[5px]">
                                                <p className="flex items-center text-[14px] font-bold text-[#000]">
                                                    00
                                                </p>
                                                <p className="flex items-center text-[14px] font-bold text-[#AEAEAE]">
                                                    {t('owned.launchpad.days')}
                                                </p>
                                            </span>
                                            <span className="flex flex-1 flex-col items-center justify-center border-r border-[#d8d8d8]/80 py-[5px]">
                                                <p className="flex items-center text-[14px] font-bold text-[#000]">
                                                    00
                                                </p>
                                                <p className="flex items-center text-[14px] font-bold text-[#AEAEAE]">
                                                    {t('owned.launchpad.hr')}
                                                </p>
                                            </span>
                                            <span className="flex flex-1 flex-col items-center justify-center border-r border-[#d8d8d8]/80 py-[5px]">
                                                <p className="flex items-center text-[14px] font-bold text-[#000]">
                                                    00
                                                </p>
                                                <p className="flex items-center text-[14px] font-bold text-[#AEAEAE]">
                                                    {t('owned.launchpad.mins')}
                                                </p>
                                            </span>
                                            <span className="flex flex-1 flex-col items-center justify-center py-[5px]">
                                                <p className="flex items-center text-[14px] font-bold text-[#000]">
                                                    00
                                                </p>
                                                <p className="flex items-center text-[14px] font-bold text-[#AEAEAE]">
                                                    {t('owned.launchpad.secs')}
                                                </p>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex  w-1/2 flex-col py-3 pl-[19px] md:w-3/12">
                                        <p className="mb-[9px] text-[12px] font-bold">
                                            {t('owned.launchpad.available')}
                                        </p>
                                        <strong className="flex items-center text-[17px] font-bold">
                                            70/1000
                                        </strong>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center rounded-b-[3px] border border-t-0 border-[#d8d8d8]/80 px-3 md:hidden">
                                    <p className="mb-[9px] mt-2 text-[12px] font-bold">
                                        {t('owned.launchpad.time')}
                                    </p>
                                    <div className="mb-2 flex w-full rounded-[3px] border border-[#d8d8d8]/80">
                                        <span className="flex flex-1 flex-col items-center justify-center border-r border-[#d8d8d8]/80 py-[5px]">
                                            <p className="flex items-center text-[14px] font-bold text-[#000]">
                                                00
                                            </p>
                                            <p className="flex items-center text-[14px] font-bold text-[#AEAEAE]">
                                                {t('owned.launchpad.days')}
                                            </p>
                                        </span>
                                        <span className="flex flex-1 flex-col items-center justify-center border-r border-[#d8d8d8]/80 py-[5px]">
                                            <p className="flex items-center text-[14px] font-bold text-[#000]">
                                                00
                                            </p>
                                            <p className="flex items-center text-[14px] font-bold text-[#AEAEAE]">
                                                {t('owned.launchpad.hr')}
                                            </p>
                                        </span>
                                        <span className="flex flex-1 flex-col items-center justify-center border-r border-[#d8d8d8]/80 py-[5px]">
                                            <p className="flex items-center text-[14px] font-bold text-[#000]">
                                                00
                                            </p>
                                            <p className="flex items-center text-[14px] font-bold text-[#AEAEAE]">
                                                {t('owned.launchpad.mins')}
                                            </p>
                                        </span>
                                        <span className="flex flex-1 flex-col items-center justify-center py-[5px]">
                                            <p className="flex items-center text-[14px] font-bold text-[#000]">
                                                00
                                            </p>
                                            <p className="flex items-center text-[14px] font-bold text-[#AEAEAE]">
                                                {t('owned.launchpad.secs')}
                                            </p>
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-col items-center justify-center rounded-[3px] border border-[#d8d8d8]/80">
                                    <p className="mb-2 mt-3 w-full px-[20px] font-[Inter-Bold] text-[12px] font-bold text-[#000] md:mt-5 md:px-[25px]">
                                        {t('owned.launchpad.pieces')}
                                    </p>
                                    <div className="flex w-full px-[20px] pb-4 md:px-[25px] md:pb-8">
                                        <div className="mr-2 flex flex-1 items-center rounded-[10px] bg-[#F5F5F5] md:mr-3">
                                            <InputNumber
                                                className="ml-[4px] flex h-[36px] w-[36px] items-center justify-center bg-white p-0 text-center text-[17px] hover:bg-white md:ml-[6px] md:h-[57px] md:w-[57px]"
                                                min={1}
                                                controls={false}
                                                max={99}
                                                bordered={false}
                                                defaultValue={1}
                                                type="number"
                                            />
                                            <p className="ml-2 flex items-center text-[12px] md:ml-4 md:text-[17px]">
                                                {t('owned.launchpad.total')}{' '}
                                                <img
                                                    className="mx-1 w-[23px]"
                                                    src={cdn(
                                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon_icp.png',
                                                    )}
                                                    alt=""
                                                />{' '}
                                                <em className="font-[Inter-Bold] font-bold not-italic">
                                                    35 ICP
                                                </em>
                                            </p>
                                        </div>
                                        {isBuyDisabled ? (
                                            <div
                                                onClick={() => setOpen(true)}
                                                className="flex h-[40px] w-[70px] cursor-not-allowed items-center justify-center bg-[#999] text-[12px] text-[#fff] md:h-[60px] md:w-[132px] md:text-[17px]"
                                            >
                                                {t('owned.launchpad.buy')}
                                            </div>
                                        ) : (
                                            <div className="flex h-[40px] w-[70px] cursor-not-allowed items-center justify-center bg-black text-[12px] text-[#fff] opacity-40 md:h-[60px] md:w-[132px] md:text-[17px]">
                                                {t('owned.launchpad.soldOut')}
                                            </div>
                                        )}
                                    </div>
                                    <Link
                                        to="https://yuminftmarketplace.gitbook.io/yumi-docs/buying/buying-on-co-owned-nft-launchpad"
                                        target="_blank"
                                        className="flex h-[34px] w-full items-center border-t border-[#d8d8d8]/80 bg-[#fbfbfb] px-[25px] text-[12px] text-[#7b7777]"
                                    >
                                        {t('owned.launchpad.buying')}
                                        <YumiIcon
                                            name="arrow-right-origyn"
                                            size={10}
                                            color="#646464"
                                        />
                                    </Link>
                                </div>

                                <div className="mt-5 flex flex-col items-center justify-center rounded-[3px] border border-[#d8d8d8]/80">
                                    <p className="mb-2 mt-4 w-full px-[20px] font-[Inter-Bold] text-[12px] font-bold text-[#000] md:mt-5 md:px-[25px]">
                                        {t('owned.launchpad.conditions')}
                                    </p>
                                    <div className="mt-2 flex w-full flex-col items-center px-[20px] pb-5 md:mb-5 md:flex-row md:px-[25px] md:pb-0">
                                        <div className="relative flex w-full flex-row items-center bg-[#f6f6f6]/80 px-[20px] py-[20px] md:w-auto md:flex-1 md:px-[26px] md:py-[18px]">
                                            <Tooltip
                                                placement="bottom"
                                                overlayInnerStyle={{ width: '262px' }}
                                                title={<TooltipTip />}
                                            >
                                                <div className="absolute right-[8px] top-[8px] flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-[#232323] font-[Inter-Bold] text-[12px] text-[#fff]">
                                                    ?
                                                </div>
                                            </Tooltip>
                                            <div className="relative mr-10 h-[120px] w-[51px] rounded-[6px] bg-[#0000000f] md:mr-[6px]">
                                                <div
                                                    style={{ height: '93%' }}
                                                    className="absolute bottom-0 left-0 flex w-full items-center justify-center rounded-[6px] bg-[#5C5C5C] font-[Montserrat-Bold] text-[12px] font-bold text-[#fff]"
                                                >
                                                    93%
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center text-center font-[Montserrat-Bold] text-[14px] text-[#7B7777]">
                                                    {t('owned.launchpad.sold')}
                                                </div>
                                                <div className="text-center font-[Montserrat-Light] text-[14px] text-[#7b7777]">
                                                    930/1000
                                                </div>
                                            </div>
                                        </div>
                                        <em className="mx-[15px] my-2 text-[14px] font-bold not-italic text-[#7b7777] md:my-5">
                                            {t('owned.launchpad.or')}
                                        </em>
                                        <div className="relative flex w-full flex-row items-center bg-[#f6f6f6]/80 px-[10px] py-[10px] md:w-auto md:flex-1 md:px-[26px] md:py-[18px]">
                                            <Tooltip
                                                placement="bottom"
                                                overlayInnerStyle={{ width: '262px' }}
                                                title={<TooltipTip />}
                                            >
                                                <div className="absolute right-[8px] top-[8px] flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-[#232323] font-[Inter-Bold] text-[12px] text-[#fff]">
                                                    ?
                                                </div>
                                            </Tooltip>
                                            <div className="relative mr-10 h-[120px] w-[51px] rounded-[6px] bg-[#0000000f] md:mr-[6px]">
                                                <div
                                                    style={{ height: '100%' }}
                                                    className="absolute bottom-0 left-0 flex w-full items-center justify-center rounded-[6px] bg-[#5C5C5C] font-[Montserrat-Bold] text-[12px] font-bold text-[#fff]"
                                                >
                                                    100%
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center text-center font-[Montserrat-Bold] text-[14px] text-[#7B7777]">
                                                    {t('owned.launchpad.reached')}
                                                </div>
                                                <div className="text-center font-[Montserrat-Light] text-[14px] text-[#7b7777]">
                                                    150k/150k
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to="/origyn/land"
                                    className="mb-[20px] mt-[20px] flex w-full items-center justify-center font-[Montserrat-Bold] text-[16px] font-bold text-[#000] md:mb-[30px] md:mt-[30px]"
                                >
                                    {t('owned.launchpad.details')}
                                    <YumiIcon
                                        name="arrow-right-origyn"
                                        size={16}
                                        color="#666666"
                                        className="ml-3"
                                    />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <OrigynArtEmail />

            <Modal open={open} footer={null} centered={true} closeIcon={null} width={720}>
                <div className="relative flex w-full items-center">
                    <div className="flex w-4/12 items-center justify-center">
                        <img
                            className="w-[100%] md:w-[60%]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669630828531_land-page-banner.png',
                            )}
                            alt=""
                        />
                    </div>

                    <div className="ml-[15px] flex h-full w-8/12 flex-1 flex-col md:ml-[50px]">
                        <IconCloseModal
                            onClick={() => setOpen(false)}
                            className="ml-auto h-[20px] w-[20px] cursor-pointer md:h-[24px] md:w-[24px]"
                        />
                        <h2 className="mt-[18px] font-[Inter-Bold] text-[16px] font-semibold italic text-[#151515] md:text-[30px]">
                            Suzanne walking in leather skirt. 3, 2008
                        </h2>
                        <p className="mt-[6px] text-[14px] font-semibold text-[#151515] md:mt-[12px] md:text-[17px]">
                            Julian Opie (b. 1958)
                        </p>
                        <div className="mt-[20px] flex h-[30px] w-full items-center justify-between border-b border-[#E5E5E5] md:mt-[32px] md:h-[58px]">
                            <p className="flex text-[14px] md:text-[17px]">5 NFT</p>
                            <p className="flex items-center font-[Inter-Bold] text-[16px] font-bold text-[#151515] md:text-[24px]">
                                <img
                                    className="mr-2 h-[24px]"
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon_icp.png',
                                    )}
                                    alt=""
                                />
                                10 ICP
                            </p>
                        </div>
                        <div className="origyn-art-checkbox mb-[30px] mt-[24px] flex flex-col items-center justify-between md:flex-row">
                            <Checkbox onChange={onConditionsChange}>
                                {t('owned.launchpad.accept')}
                            </Checkbox>
                            <div className="mt-[15px] flex h-[40px] w-[132px] cursor-pointer items-center justify-center bg-[#151515] font-[Inter-Bold] font-semibold text-[#fff] duration-150 hover:bg-[#151515]/80 md:mt-0">
                                {t('owned.launchpad.confirm')}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default OrigynArtLaunchpad;

import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { message, Skeleton } from 'antd';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import {
    LaunchpadCollectionInfo,
    LaunchpadCollectionStatus,
} from '@/03_canisters/yumi/yumi_launchpad';
import { useIdentityStore } from '@/07_stores/identity';
import { useLaunchpadPurchase } from '@/08_hooks/views/launchpad';
import TokenPrice from '@/09_components/data/price';
import Usd from '@/09_components/data/usd';
import { IconCopy, IconDirectionDownSelect } from '@/09_components/icons';
import YumiIcon from '@/09_components/ui/yumi-icon';
import { LaunchpadBuyModal } from './buy-modal';

export const LaunchpadBuyNow = ({
    info,
    status,
    update,
}: {
    info: LaunchpadCollectionInfo;
    status: LaunchpadCollectionStatus;
    update: () => void;
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const description = info.description;

    const identity = useIdentityStore((s) => s.connectedIdentity);
    // 是否展开
    const showReadMore = description.length > 150;
    const [fold, setFold] = useState<boolean>(showReadMore);

    // 购买相关
    const { max, price, buy, action } = useLaunchpadPurchase(info, status);

    const [purchaseQuantity, setPurchaseQuantity] = useState<number>(1);

    useEffect(() => {
        if (max <= 0) setPurchaseQuantity(1);
        else if (purchaseQuantity > max) setPurchaseQuantity(max);
        else if (purchaseQuantity === 0 && max > 0) setPurchaseQuantity(1);
    }, [max]);

    const onPurchaseQuantityChange = ({ target: { value } }) => {
        try {
            let num = Number(value);
            if (isNaN(num)) throw new Error('not a number');
            if (num < 1) num = 1;
            if (num >= max) num = max;
            setPurchaseQuantity(num ? num : 1);
        } catch {
            setPurchaseQuantity(1);
        }
    };
    const purchaseQuantitySubtract = () => {
        if (max === 0) return message.error(`you can not purchase`);
        if (purchaseQuantity <= 1) return message.error('too small');
        setPurchaseQuantity(purchaseQuantity - 1);
    };
    const purchaseQuantityAdd = () => {
        if (max === 0) return message.error(`you can not purchase`);
        if (purchaseQuantity >= max) return message.error('too large');
        setPurchaseQuantity(purchaseQuantity + 1);
    };

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const onBuy = () => {
        if (!identity) return navigate('/connect'); // 要求登录
        if (max === 0) return message.error(`you can not purchase`); // 要求有购买额度
        // 外部只检查资格不检查余额
        setModalOpen(true);
    };
    const onClose = () => {
        setModalOpen(false);
    };

    return (
        <>
            {modalOpen && (
                <LaunchpadBuyModal
                    info={{
                        featured: info.featured,
                        name: info.name,
                        price: price,
                        amount: purchaseQuantity,
                    }}
                    onClose={onClose}
                    buy={buy}
                    update={update}
                    action={action}
                />
            )}

            <img
                className="mb-10 w-full rounded-[16px] md:w-5/12"
                src={cdn(info.featured)}
                alt=""
            />
            <div className="top-[100px] z-10 flex h-0 flex-1 flex-col md:sticky md:pl-14">
                <h2 className="text-[24px] font-semibold text-black">{info.name}</h2>
                <p className={`mt-2 text-[14px] text-[#000]/80 md:mt-4 md:text-[16px]`}>
                    {showReadMore && fold ? `${description.substring(0, 150)}...` : description}
                </p>
                {showReadMore ? (
                    <div
                        onClick={() => setFold(!fold)}
                        className="group mt-3 flex cursor-pointer text-[14px] font-bold text-[#000]"
                    >
                        {t('launchpad.main.readMore')}
                        <div className="flex h-full items-center">
                            <IconDirectionDownSelect
                                className={`ml-1 h-2 w-3 transition-transform duration-500 ${
                                    !fold
                                        ? 'rotate-180 group-hover:rotate-180 md:group-hover:rotate-0'
                                        : 'group-hover:rotate-0 md:group-hover:rotate-180'
                                }`}
                            />
                        </div>
                    </div>
                ) : null}

                <div className="mt-3 flex flex-col md:mt-7">
                    <span className="mb-4 flex justify-between">
                        <p className="text-[12px] text-[#000]">{t('launchpad.main.blockchain')}</p>
                        <p className="text-[12px] text-[#000]">Internet Computer</p>
                    </span>
                    <span className="flex justify-between">
                        <p className="text-[12px] text-[#000]">{t('launchpad.main.address')}</p>
                        <p className="flex text-[12px] text-[#000]">
                            <CopyToClipboard
                                text={info.collection}
                                onCopy={() => message.success(`Copied`)}
                            >
                                <IconCopy className="mr-[6px] w-3 cursor-pointer" />
                            </CopyToClipboard>
                            {info.collection}
                        </p>
                    </span>
                </div>
                <div className="mt-[26px] flex flex-col">
                    <span className="mb-3 flex justify-between">
                        <p className="text-[12px] text-[#000]">{t('launchpad.main.total')}</p>
                        <p className="flex text-[12px] text-[#000]">
                            {Number(info.remain)}/
                            <em className="not-italic text-symbol">{info.supply}</em>
                        </p>
                    </span>
                    <div className="relative mt-2">
                        <div className=" h-3 rounded-[6px] bg-[#F1F1F1]"></div>
                        <div
                            className="absolute left-0 top-0 flex h-3 justify-end rounded-[6px] bg-[#000]"
                            style={{
                                width: `${(Number(info.remain) / Number(info.supply)) * 100}%`,
                            }}
                        >
                            <i className="relative -top-[3px] h-[18px] w-[18px] rounded-full border-[4px] border-[#000] bg-[#fff]"></i>
                        </div>
                    </div>
                    <div className="mt-9 flex w-full flex-row items-center justify-between rounded-[6px] bg-[#F3F3F3] px-[5px] py-[10px] md:h-[100px] md:rounded-[16px] md:px-5 md:py-5">
                        <div className="flex items-center">
                            <div
                                onClick={purchaseQuantitySubtract}
                                className="mr-[5px] flex h-[13px] w-[13px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[4px] bg-white md:h-[24px] md:w-[24px]"
                            >
                                <YumiIcon
                                    name="action-decrement"
                                    size={14}
                                    className="text-[#999] hover:text-[#666]"
                                />
                            </div>
                            <div className="h-[35px] w-[35px] flex-shrink-0 rounded-[8px] bg-white px-[5px] md:h-[65px] md:w-[65px]">
                                <input
                                    className="custom-input h-full w-full text-center text-[22px] font-bold text-[#000] outline-none"
                                    value={purchaseQuantity}
                                    onChange={onPurchaseQuantityChange}
                                    type="number"
                                />
                            </div>
                            <div
                                onClick={purchaseQuantityAdd}
                                className="ml-[5px] flex h-[13px] w-[13px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[4px] bg-white md:h-[24px] md:w-[24px]"
                            >
                                <YumiIcon
                                    name="action-increment"
                                    size={14}
                                    className="text-[#999] hover:text-[#666]"
                                />
                            </div>
                        </div>
                        <div className="flex flex-1 items-center justify-end text-[18px] font-bold text-[#000] md:mt-3 md:justify-center md:text-[22px]">
                            Total:&nbsp;
                            {price !== '0' ? (
                                <TokenPrice
                                    value={{
                                        value: `${Number(price) * Number(purchaseQuantity)}`,
                                        decimals: { type: 'exponent', value: 8 },
                                        scale: 2,
                                    }}
                                    className="font-inter text-[18px] md:text-[20px] "
                                />
                            ) : (
                                '--'
                            )}
                            <em className="not-italic text-symbol">&nbsp;ICP</em>
                            {purchaseQuantity > 0 ? (
                                <>
                                    <Usd
                                        value={{
                                            value: `${Number(price) * Number(purchaseQuantity)}`,
                                            decimals: { type: 'exponent', value: 8 },
                                            symbol: 'ICP',
                                            scale: 2,
                                        }}
                                        className="font-inter text-[18px] text-[#000] md:text-[20px]"
                                    />
                                </>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <div className="mt-[38px] flex h-[50px] justify-between">
                        <button
                            className={cn(
                                'flex h-full w-3/5 flex-shrink-0 cursor-pointer items-center justify-center rounded-[8px] bg-black text-[16px] font-bold text-[#fff]',
                                (max === 0 || action) &&
                                    identity &&
                                    'cursor-not-allowed opacity-10',
                            )}
                            onClick={() => {
                                max !== 0 && !action && onBuy();
                            }}
                        >
                            {identity && t('launchpad.main.buyNow')}
                            {!identity && t('launchpad.main.connect')}
                        </button>
                        <Link to={`/market/${info.collection}`}>
                            <div className=" flex h-full flex-1 cursor-pointer items-center text-[12px] font-bold text-[#999] md:ml-6 md:text-[16px]">
                                {t('launchpad.main.collection')}
                                <YumiIcon
                                    name="arrow-right"
                                    size={20}
                                    className="ml-[5px] cursor-pointer text-[#999] hover:text-[#666]"
                                />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export const LaunchpadBuyNowSkeleton = () => {
    return (
        <>
            <div className="mb-10 h-[400px] w-full rounded-[16px] md:w-5/12">
                <Skeleton.Image className="!h-full !w-full" />
            </div>
            <div className="top-[100px] z-10 flex h-0 flex-1 flex-col md:sticky md:pl-14">
                <Skeleton.Input className="!h-6 !w-3/5 !min-w-0" />

                <div className="mt-3">
                    <Skeleton.Input className="!h-4 !w-full !min-w-0" />
                    <Skeleton.Input className="!h-4 !w-full !min-w-0" />
                    <Skeleton.Input className="!h-4 !w-full !min-w-0" />
                </div>

                <div className="mt-3 flex flex-col md:mt-5">
                    <span className="mb-4 flex w-full justify-between">
                        <Skeleton.Input className="!h-4 !min-w-0" />
                        <Skeleton.Input className="!h-4 !min-w-0" />
                    </span>
                    <span className="flex justify-between">
                        <Skeleton.Input className="!h-4 !min-w-0" />
                        <Skeleton.Input className="!h-4 !min-w-0" />
                    </span>
                    <span className="mt-2 flex justify-between">
                        <Skeleton.Input className="!h-4 !min-w-0" />
                        <Skeleton.Input className="!h-4 !min-w-0" />
                    </span>
                </div>
                <Skeleton.Input className="mt-3 !h-4 !w-full !min-w-0" />

                <Skeleton.Button className="mt-3 !h-[50px] !w-full" />

                <div className="mt-[20px] flex h-[50px] md:mt-[30px]">
                    <div className="flex h-full w-3/5 flex-shrink-0 items-center justify-center rounded-[8px] text-[16px] font-bold text-[#fff]">
                        <Skeleton.Button className="!h-[50px] !w-full" />
                    </div>
                </div>
            </div>
        </>
    );
};

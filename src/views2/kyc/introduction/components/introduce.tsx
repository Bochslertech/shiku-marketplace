import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { cn } from '@/02_common/cn';
import { useDeviceStore } from '@/07_stores/device';
import { useIdentityStore } from '@/07_stores/identity';

const getAccess = [
    {
        value: 'Trade NFTs collections',
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1687665230590_kyc-collection.svg',
    },
    {
        value: 'Trade GLD NFTs',
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1687665230592_kyc-nfts.svg',
    },
    {
        value: 'Trade Physical Art NTFs',
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1687665230593_kyc-artNfts.svg',
    },
    {
        value: 'Trade Shiku Lands',
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1687665230594_kyc-lands.svg',
    },
    {
        value: 'Earn Yumi credits',
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1687665230595_kyc-credits.svg',
    },
    {
        value: 'Claim OAT',
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1687665230596_kyc-oat.svg',
    },
];

const tierList = [
    {
        label: 'Tier 0',
        up: '0 USD',
    },
    {
        label: 'Tier 1',
        up: '10K USD',
    },
    {
        label: 'Tier 2',
        up: '50K USD',
    },
    {
        label: 'Tier 3',
        up: false,
    },
];

const Introduce = ({ setApplyFlag }: { setApplyFlag: () => void }) => {
    const navigate = useNavigate();
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);
    const { kycResult } = useIdentityStore(
        (s) => ({
            kycResult: s.kycResult,
        }),
        shallow,
    );

    //每个卡片下 不同按钮 不同条件 展示判断
    const carBtn = useCallback(
        (index: number) => {
            if (index === 0) {
                return '';
            }
            if (kycResult) {
                const sliceTier = Number(kycResult.level.slice(-1));
                if (kycResult.level === 'NA' && kycResult.status === 'pending' && index === 1) {
                    return 'Continue';
                } else if (kycResult.status === 'pending' && sliceTier === index - 1) {
                    return 'Request pending';
                } else if (sliceTier === 2 && index === 3) {
                    return 'Contact Us';
                } else if (sliceTier === index - 1 || (kycResult.level === 'NA' && index === 1)) {
                    return 'Get started';
                } else if (sliceTier >= index) {
                    return 'Completed';
                } else {
                    return 'Not Verified';
                }
            } else return 'Not Verified';
        },
        [kycResult],
    );

    //不同按钮 点击不同功能
    const btnClick = useCallback((type: string) => {
        if (type === 'Get started' || type === 'Continue') {
            navigate('/kyc/register');
        } else if (type === 'Contact Us') setApplyFlag();
    }, []);

    //pc端
    const TierList_pc = () => {
        return (
            <div className="flex">
                {tierList.map((item, index) => {
                    //判断是否展示当前遮罩层
                    const mask = Number(kycResult?.level.slice(-1)) >= index;
                    return (
                        <div key={item.label.slice(-1)} className="ml-[30px]">
                            <div
                                className={cn([
                                    'cap-card relative h-[548px] w-[210px] rounded-[8px] border-2 border-[#333] bg-[#fff] text-center',
                                    !mask && ' cap-card-mask border-dashed border-[#757575]',
                                ])}
                            >
                                <div
                                    className={cn([
                                        'h-[43px] bg-[#0e0d0d] font-inter-semibold text-[24px] leading-[42px] text-[#fff]',
                                        !mask && 'bg-[#0000004d]',
                                    ])}
                                >
                                    {item.label}
                                </div>
                                <div
                                    className={cn([
                                        'mb-[90px] mt-[14px] text-[#0e0d0d]',
                                        !mask && 'text-[#0006]',
                                    ])}
                                >
                                    {!item.up ? (
                                        <>
                                            <div className=" font-inter-bold text-[32px] leading-[39px]">
                                                Custom
                                            </div>
                                            <span className="cursor-pointer font-inter-medium text-[15px] leading-[18px] underline">
                                                Contact us
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-inter-medium text-[15px] leading-[18px]">
                                                up to
                                            </span>
                                            <div className="font-inter-bold text-[32px] leading-[39px]">
                                                {item.up}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {Array.from({ length: 6 }).map((_, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className={cn([
                                                'h-[56px] bg-[url(https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1687678097011_kyccan.svg)] bg-center bg-no-repeat',
                                                i % 2 === 0 && 'bg-[#F0F0F0]',
                                                index === 0 &&
                                                    i <= 4 &&
                                                    'bg-[url(https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1687677879074_nocan.svg)]',
                                                !mask &&
                                                    'bg-[url(https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1689928927757_unKyc-icon.svg)]',
                                            ])}
                                        ></div>
                                    );
                                })}
                            </div>
                            {index !== 0 && (
                                <div
                                    className={cn([
                                        ' mx-auto mt-[30px] flex h-[50px] w-[170px] cursor-pointer items-center justify-center rounded-[8px] bg-[#b2b2b2] font-inter-bold text-[18px] text-[#fff]',
                                        (carBtn(index) === 'Continue' ||
                                            carBtn(index) === 'Completed') &&
                                            'btn-bg',
                                        (carBtn(index) === 'Contact Us' ||
                                            carBtn(index) === 'Get started') &&
                                            ' bg-[#000]',
                                    ])}
                                    onClick={() => btnClick(carBtn(index))}
                                >
                                    {carBtn(index)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    //mobile端
    const TierList_mobile = () => {
        return (
            <div>
                {tierList.map((item, index) => {
                    //判断是否展示当前遮罩层
                    const mask = Number(kycResult?.level.slice(-1)) >= index;
                    return (
                        <div className="mb-[30px]" key={item.label.slice(-1)}>
                            <div
                                className={cn([
                                    'cap-card relative flex h-[142px] w-full rounded-[8px] border-2 border-[#333] bg-[#fff] text-center',
                                    !mask && ' cap-card-mask border-dashed border-[#757575]',
                                ])}
                            >
                                <div
                                    className={cn([
                                        'flex h-full min-w-[45px] items-center justify-center bg-[#0e0d0d] font-inter-semibold text-[12px]  text-[#fff]',
                                        !mask && 'bg-[#0000004d]',
                                    ])}
                                >
                                    {item.label}
                                </div>
                                <div
                                    className={cn([
                                        ' flex w-[73px] flex-col items-center justify-center text-[#0e0d0d]',
                                        !mask && 'text-[#0006]',
                                    ])}
                                >
                                    {!item.up ? (
                                        <>
                                            <div className=" font-inter-bold text-[12px] ">
                                                Custom
                                            </div>
                                            <span className="cursor-pointer font-inter-medium text-[12px]  underline">
                                                Contact us
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-inter-medium text-[15px] leading-[18px]">
                                                up to
                                            </span>
                                            <div className="font-inter-bold text-[18px]">
                                                {item.up}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="flex flex-1">
                                    {Array.from({ length: 6 }).map((_, i) => {
                                        return (
                                            <div
                                                key={i}
                                                style={{ width: 'calc(100% / 6' }}
                                                className={cn([
                                                    'h-full  bg-[url(https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1687678097011_kyccan.svg)] bg-center bg-no-repeat',
                                                    i % 2 === 0 && 'bg-[#F0F0F0]',
                                                    index === 0 &&
                                                        i <= 4 &&
                                                        'bg-[url(https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1687677879074_nocan.svg)]',
                                                    !mask &&
                                                        'bg-[url(https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1689928927757_unKyc-icon.svg)]',
                                                ])}
                                            ></div>
                                        );
                                    })}
                                </div>
                            </div>
                            {index !== 0 && (
                                <div
                                    className={cn([
                                        ' mx-auto mt-[15px] flex h-[40px] w-[138px] cursor-pointer items-center justify-center rounded-[8px] bg-[#b2b2b2] font-inter-bold text-[14px] text-[#fff]',
                                        (carBtn(index) === 'Continue' ||
                                            carBtn(index) === 'Completed') &&
                                            'btn-bg',
                                        (carBtn(index) === 'Contact Us' ||
                                            carBtn(index) === 'Get started') &&
                                            ' bg-[#000]',
                                    ])}
                                    onClick={() => btnClick(carBtn(index))}
                                >
                                    {carBtn(index)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="items-center justify-between bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/home/1687673863810_bg-kyc-tier.png')] bg-contain px-[15px] pb-[25px] lg:flex lg:px-[40px] lg:pb-[58px]">
            <div className=" mb-[15px] flex lg:mb-0 lg:block">
                <div>
                    <div className="font-inter-semibold text-[14px] lg:text-[24px]">
                        Transaction cap
                    </div>
                    <span className="cap-underline mb-[48px] mt-[18px] hidden h-[4px] w-full max-w-[188px] rounded-[21px] lg:block"></span>
                </div>
                <div className=" mb-[21px] hidden font-inter-semibold text-[20px] leading-[24px] lg:block">
                    Get access to :
                </div>
                <div className=" ml-[16px] flex lg:ml-0 lg:block">
                    {getAccess.map((item) => {
                        return (
                            <div
                                key={item.value}
                                className="mr-[14px] flex items-center font-inter-medium text-[18px] lg:mb-[17px] lg:ml-0"
                            >
                                <span
                                    style={{ backgroundImage: `url("${item.icon}")` }}
                                    className=" inline-block h-[24px] w-[24px] bg-contain lg:mr-[14px] lg:h-[40px] lg:w-[40px]"
                                ></span>
                                {!isMobile && item.value}
                            </div>
                        );
                    })}
                </div>
            </div>
            {!isMobile && <TierList_pc />}
            {isMobile && <TierList_mobile />}
        </div>
    );
};
export default Introduce;

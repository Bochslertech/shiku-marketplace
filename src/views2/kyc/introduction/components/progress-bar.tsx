import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { shallow } from 'zustand/shallow';
import { AddLinkType, KycLinkType } from '@/04_apis/yumi/kyc';
import { queryKycLinkList } from '@/05_utils/apis/yumi/kyc';
import { useDeviceStore } from '@/07_stores/device';
import { useIdentityStore } from '@/07_stores/identity';
import { HandleLink, LinkNewAccount, ResultModal } from './link-modals';

const ProgressBar = ({ setApplyFlag }: { setApplyFlag: () => void }) => {
    const navigate = useNavigate();

    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    const [linkNewModal, setLinkNewModal] = useState(false);
    const [resultModal, setResultModal] = useState(false);
    const [handleModal, setHandleModal] = useState(false);
    const [handleType, setHandleType] = useState<undefined | 'link' | 'unLink'>(undefined);
    const [manage, setManage] = useState(false);
    const [addResultList, setAddResultList] = useState<undefined | AddLinkType>(undefined);

    const [userLink, setUserLink] = useState<KycLinkType | undefined>(undefined);
    const { kycResult, principal } = useIdentityStore(
        (s) => ({
            kycResult: s.kycResult,
            principal: s.connectedIdentity?.principal,
        }),
        shallow,
    );

    useEffect(() => {
        queryUserLink();
    }, [principal]);

    const queryUserLink = useCallback(() => {
        if (principal) {
            queryKycLinkList(principal).then((res: KycLinkType) => {
                setUserLink(res);
            });
        }
    }, [principal]);

    const tipsRender = (
        <div className="w-full text-center font-inter-regular text-[12px] leading-[15px] text-[#666]">
            Yumi values your privacy and won't share your personal data with third parties. Click
            &nbsp;<span className="text-[#7149ff] underline">here</span> to learn more about our KYC
            process and data handling.
        </div>
    );
    // current Tier 展示用户kyc等级 返回tier + 空格 + 等级
    const currentTier = useMemo(() => {
        if (kycResult) {
            if (kycResult.level === 'NA') {
                return 'Tier 0';
            } else return `Tier ${kycResult.level.slice(-1)}`;
        } else {
            return 'Tier 0';
        }
    }, [kycResult]);

    //指引用户升级kyc=> 升级后限额+等级
    const guideKyc = useMemo(() => {
        if (kycResult) {
            if (kycResult.level === 'NA') {
                return { tier: 'Tier 1', limit: '10,000' };
            } else if (kycResult.level === 'Tier1') {
                return { tier: 'Tier 2', limit: '50,000' };
            } else if (kycResult.level === 'Tier2') {
                return { tier: 'Tier 3', limit: '>50,000' };
            }
        } else return { tier: 'Tier 1', limit: '10,000' };
    }, [kycResult]);

    const quotaList = useMemo(() => {
        return ['0', '10K', '50K', 'Custom'];
    }, []);

    // 计算 三段进度条 每段百分比
    const CalculatedPercentage = useMemo(() => {
        const progList = ['0%', '0%', '0%'];
        if (kycResult) {
            if (kycResult.used < 10000) {
                progList[0] = (kycResult.used / 10000) * 100 + '%';
                return progList;
            } else if (kycResult.used < 50000) {
                progList[0] = '100%';
                progList[1] = (kycResult.used / 50000) * 100 + '%';
                return progList;
            } else {
                progList[0] = '100%';
                progList[1] = '100%';
                progList[2] = (kycResult.used / kycResult.quota) * 100 + '%';
            }
        } else return progList;
    }, [kycResult]);

    //用户kyc 限额、百分比、当前已消费 展示面板
    const quotaShow = () => {
        return (
            <div className="flex items-center text-center font-inter-medium text-[12px] leading-[19px] text-[#666] lg:w-full lg:text-[16px]">
                <div className="w-[33%] xl:w-auto">
                    <div className="mb-[22px] lg:mb-[43px]">Current trading limit</div>
                    <div>
                        <span className="text-[16px] text-[#000] lg:text-[25px]">
                            {kycResult?.quota || 0}
                        </span>{' '}
                        USD
                    </div>
                </div>
                <div className="mx-[17px] w-[33%] border-l border-r border-[#cfcfcf] px-[17px] lg:mx-[25px] lg:px-[25px] xl:mx-[42px] xl:w-auto xl:px-[43px]">
                    <div className="mb-[22px] lg:mb-[43px]">Amount traded</div>
                    <div>
                        <span className="text-[16px] text-[#000] lg:text-[25px]">
                            {kycResult?.used || 0}
                        </span>{' '}
                        USD
                    </div>
                </div>
                <div className="w-[33%] xl:w-auto">
                    <div className="mb-[22px] lg:mb-[43px]">Progress</div>
                    <div>
                        <span className="text-[16px] text-[#000] lg:text-[25px]">
                            {kycResult
                                ? ((kycResult.used / kycResult.quota) * 100 || 0).toFixed(2)
                                : '0.00'}
                            %
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    //不同按钮 路由跳转
    const btnLink = useCallback(
        (text: string) => {
            if (text === 'Get started' || text === 'Continue') {
                navigate('/kyc/register');
            } else if (text === 'Apply') setApplyFlag();
        },
        [kycResult],
    );

    //卡片按钮判断展示
    const btnText: string = useMemo(() => {
        if (kycResult) {
            if (kycResult.level === 'Tier3') {
                return 'Apply';
            } else if (kycResult.status === 'pending') {
                if (kycResult.level !== 'NA') {
                    return 'Request pending';
                } else return 'Continue';
            } else if (kycResult.level === 'Tier2') {
                return 'Contact Us';
            } else return 'Get started';
        } else return 'Get started';
    }, [kycResult]);

    //用户当前kyc级别卡片
    const cardTier = () => {
        return (
            <div className="card-tier relative my-[30px] flex  h-[93px] flex-col items-center justify-around rounded-[5px] px-[35px] lg:h-[130px] lg:w-full lg:flex-row lg:justify-between">
                <div className=" font-inter-medium text-[12px] leading-[19px] lg:mr-[29px] lg:text-[16px] xl:max-w-[271px]">
                    {kycResult && kycResult.level === 'Tier3' ? (
                        'Request for an increase in trading limit.'
                    ) : (
                        <>
                            Unlock {guideKyc?.limit} USD of transaction cap by performing the{' '}
                            <span className="font-inter-bold text-[#7149ff]">{guideKyc?.tier}</span>{' '}
                            KYC
                        </>
                    )}
                </div>
                <div
                    onClick={() => btnLink(btnText)}
                    className=" h-[22px] w-[111px] cursor-pointer rounded-[8px] bg-[#000] text-center font-inter-bold text-[12px] leading-[21px] text-[#fff] lg:h-[50px] lg:w-[210px] lg:text-[18px] lg:leading-[49px]"
                >
                    {btnText}
                </div>
            </div>
        );
    };

    //处理link点击事件
    const linkFunctions = useCallback(() => {
        setHandleType('link');
        setHandleModal(true);
    }, []);

    //解除link点击事件
    const unLinkFunctions = useCallback(() => {
        setHandleType('unLink');
        setHandleModal(true);
    }, []);

    return (
        <div className="kyc-progress mx-[15px] rounded-[8px] px-[9px] pb-[1px] pt-[19px]  lg:mx-[40px] lg:rounded-[16px] lg:px-[60px] lg:pb-0 lg:pt-[33px]">
            <div className="mb-[25px] flex flex-col items-start whitespace-nowrap  font-inter-semibold text-[16px] leading-[29px] md:flex-row md:items-center lg:mb-[43px] lg:text-[24px]">
                <div className="mb-[15px] flex items-center md:mb-0">
                    Current tier :<span className="mx-[13px] text-[#7149ff]">{currentTier}</span>
                    <Popover
                        content={tipsRender}
                        trigger="hover"
                        overlayInnerStyle={{
                            padding: '0',
                            borderRadius: '6px',
                            width: !isMobile ? '464px' : '100%',
                        }}
                    >
                        <InfoCircleOutlined
                            style={{ fontSize: '16px', cursor: 'pointer', marginRight: '18px' }}
                        />
                    </Popover>
                </div>
                <div className="cursor-pointer rounded-[8px] bg-[#000] font-inter-semibold text-[12px] leading-normal text-[#fff] md:text-[14px]">
                    {/* 当前账号符合发出link邀请且未发出  */}
                    {userLink &&
                        userLink.kyc_links.length === 0 &&
                        userLink.request_kyc_link === null &&
                        kycResult &&
                        kycResult.level !== 'NA' && (
                            <span
                                className="inline-block px-[13px] py-[5px]"
                                onClick={() => {
                                    setManage(false);
                                    setLinkNewModal(true);
                                }}
                            >
                                Link a new account
                            </span>
                        )}

                    {/* 当前账号符合发出link邀请且已发出 */}
                    {userLink && userLink.kyc_links.length !== 0 && (
                        <span
                            className="inline-block px-[13px] py-[5px]"
                            onClick={() => {
                                setManage(true);
                                setLinkNewModal(true);
                            }}
                        >
                            Manage your accounts
                        </span>
                    )}
                </div>
                <div className="cursor-pointer rounded-[8px] bg-[#7A54FD] px-[13px] font-inter-semibold text-[14px] text-[#fff]">
                    {/* 当前账号为na 且已link展示 */}
                    {kycResult &&
                        kycResult.level !== 'NA' &&
                        userLink &&
                        userLink.request_kyc_link !== null &&
                        userLink.request_kyc_link.approveAt && (
                            <div onClick={unLinkFunctions}>Unlink account</div>
                        )}

                    {/* 当前账号为na 且收到link邀请未处理 */}
                    {kycResult &&
                        kycResult.level === 'NA' &&
                        userLink &&
                        userLink.request_kyc_link !== null &&
                        !userLink.request_kyc_link.approveAt && (
                            <span onClick={linkFunctions}>Link request</span>
                        )}
                </div>
                {linkNewModal && (
                    <LinkNewAccount
                        linkNewModal={linkNewModal}
                        setLinkNewModal={() => {
                            setLinkNewModal(false);
                            queryUserLink();
                        }}
                        manage={manage}
                        userLink={userLink}
                        setAddResultList={(result: AddLinkType) => setAddResultList(result)}
                        setResultModal={() => setResultModal(true)}
                    />
                )}
                <ResultModal
                    resultModal={resultModal}
                    addResultList={addResultList}
                    setResultModal={() => {
                        setResultModal(false);
                        queryUserLink();
                    }}
                />
                {handleType && handleModal && userLink && (
                    <HandleLink
                        handleModal={handleModal}
                        setHandleModal={() => {
                            queryUserLink();
                            setHandleModal(false);
                        }}
                        type={handleType}
                        userLink={userLink}
                    />
                )}
            </div>
            <div>
                <div className="flex items-center justify-between">
                    {quotaList.map((item) => {
                        return (
                            <div
                                key={item}
                                className="font-inter-medium text-[12px] text-[#666] lg:text-[14px]"
                            >
                                {item !== 'Custom' ? (
                                    <>
                                        <span className="text-[12px] text-[#000] lg:text-[16px]">
                                            {item}
                                        </span>{' '}
                                        USD
                                    </>
                                ) : (
                                    <span className=" text-[12px] text-[#000] lg:text-[16px]">
                                        {item}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="pro-box-show relative flex h-[12px] w-full items-center justify-between overflow-hidden rounded-[12px] pr-[24px] lg:h-[24px]">
                    {quotaList.map((_) => {
                        return (
                            <div
                                key={_}
                                className=" h-[8px] w-[8px] rounded-[50%] bg-[#ededed] lg:h-[14px] lg:w-[14px]"
                            ></div>
                        );
                    })}
                    <div className="absolute flex h-full w-full">
                        {CalculatedPercentage?.map((item, index) => {
                            return (
                                <div className="flex w-1/3" key={item + index}>
                                    <div
                                        className="h-full bg-[#7a54fd]"
                                        style={{ width: item }}
                                    ></div>
                                    {(item !== '100%' && item !== '0%') || index === 0 ? (
                                        <div
                                            style={{
                                                transform: `translateX(${
                                                    index === 0 && item === '0%' ? '0' : '-50%'
                                                })`,
                                            }}
                                            className="h-[12px] w-[12px] bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1687660384409_kyc-progress.svg')] bg-contain  lg:h-[24px]  lg:w-[24px]"
                                        ></div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="mt-[30px] items-center justify-between lg:mt-[41px] lg:flex lg:flex-col xl:flex-row">
                {quotaShow()}
                {cardTier()}
            </div>
        </div>
    );
};
export default ProgressBar;

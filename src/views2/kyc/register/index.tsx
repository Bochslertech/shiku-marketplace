import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { cdn } from '@/02_common/cdn';
import { useIdentityStore } from '@/07_stores/identity';
import Loading from '@/09_components/ui/loading';
import KycFaq from './components/Faq';
import Tier1 from './components/Tier1';
import Tier2 from './components/Tier2';
import style from './index.module.less';

function KycRegister() {
    const { kycResult, principal } = useIdentityStore(
        (s) => ({
            kycResult: s.kycResult,
            principal: s.connectedIdentity?.principal,
        }),
        shallow,
    );
    const [t2Flag, setT2Flag] = useState(false);
    const Congratulations = React.memo(() => {
        return (
            <div className="flex h-full w-full flex-col items-center">
                <img
                    src={cdn(
                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1689936004491_kyc-ok.svg',
                    )}
                    alt=""
                />
                <div className="my-[40px] font-inter-semibold text-[32px]">Congratulations!</div>
                <div className=" mt-[12px] font-inter-regular text-[16px] leading-[24px]">
                    Congratulations, you have successfully submitted your request for verification.
                    Verification status will be emailed to you within 1-2 business days.
                </div>
                <Link
                    to="/"
                    className="mt-[50px] flex h-[60px] w-[394px] cursor-pointer items-center justify-center rounded-[8px] bg-[#000] text-center font-inter-bold text-[20px] text-[#fff]"
                >
                    Go back to Yumi
                </Link>
            </div>
        );
    });
    return (
        <div
            id="kyc-register"
            className={`${style['kyc-register']} absolute  left-0 top-0 z-[100] flex h-screen w-full flex-col items-start gap-x-[98px] overflow-hidden overflow-y-auto border-border bg-white md:h-[100vh] md:flex-row md:justify-center md:px-[35px]`}
        >
            <div className=" flex flex-col   md:h-full  md:px-0">
                <div className="relative mb-[48px] flex items-center md:mb-[82px] md:mt-[50px]">
                    <Link
                        to="/kyc/introduction"
                        className="h-[33px] w-[33px] cursor-pointer rounded-[50%] bg-[#000] bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1676968816906_arrow-left.svg')] bg-center bg-no-repeat"
                    />
                    <div className=" ml-[36px] h-[32px] w-[120px] bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/launchpad/1679368476005_logo.png')] bg-contain bg-center bg-no-repeat"></div>
                </div>
                <div className="flex max-w-[519px] flex-1 flex-col md:ml-[96px] md:mr-[56px]  ">
                    {!t2Flag && (
                        <>
                            {' '}
                            <div className=" px-[15px] md:px-0">
                                <div className=" font-inter-bold text-[32px] leading-[39px]">
                                    Verification form
                                </div>
                                <div className="my-[20px] font-inter-medium text-[14px] leading-[24px] text-stress">
                                    Start verifying now! You are a few step away from having access
                                    to all the exciting sales on Yumi. After you fill in the form
                                    below, you will receive an email with the status of your
                                    verification within 1-2 business days.
                                </div>
                            </div>
                            <div className="flex-1 md:flex-auto">
                                {/* 如果为tier1 那么展示申请成为t2的表单页面 */}
                                {kycResult && kycResult.level === 'Tier1' && (
                                    <Tier2 setT2Flag={() => setT2Flag(true)} />
                                )}

                                {/* t0 则展示 onfido 表单页面 */}
                                {!kycResult && <Loading />}
                                {kycResult && kycResult.level === 'NA' && (
                                    <Tier1 principal={principal} />
                                )}
                            </div>
                        </>
                    )}
                    {t2Flag && <Congratulations />}
                </div>
            </div>
            <KycFaq />
        </div>
    );
}

export default KycRegister;

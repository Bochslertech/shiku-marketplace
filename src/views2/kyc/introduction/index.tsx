import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useIdentityStore } from '@/07_stores/identity';
import ApplyModal from './components/ApplyModal';
import Introduce from './components/introduce';
import ProgressBar from './components/progress-bar';
import style from './index.module.less';

function KycIntroduction() {
    const [applyFlag, setApplyFlag] = useState(false);

    const { principal } = useIdentityStore(
        (s) => ({
            principal: s.connectedIdentity?.principal,
        }),
        shallow,
    );
    return (
        <div className={style['kyc-introduction']}>
            <div className="mb-[44px] mt-[27px] flex items-center px-[15px] font-inter-bold text-[22px] leading-[48px] lg:my-[40px] lg:px-[40px] lg:text-[40px]">
                <span className="mr-[10px] inline-block h-[24px] w-[24px] bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1687333932433_kyc-ver.svg')] bg-contain lg:mr-[22px] lg:h-[40px] lg:w-[40px]"></span>
                Identity Verification
            </div>
            <ProgressBar setApplyFlag={() => setApplyFlag(true)} />
            <div className=" mb-[27px] mt-[42px] text-center font-inter-bold text-[18px] lg:mb-[84px] lg:mt-[129px] lg:text-[36px]">
                Tier information
            </div>
            <Introduce setApplyFlag={() => setApplyFlag(true)} />
            <ApplyModal
                visible={applyFlag}
                onClose={() => setApplyFlag(false)}
                principal={principal}
            />
        </div>
    );
}

export default KycIntroduction;

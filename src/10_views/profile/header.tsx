import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Link, useNavigate } from 'react-router-dom';
import { message, Skeleton } from 'antd';
import { KycResult } from '@/01_types/yumi';
import { cdn, url_cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { shrinkAccount, shrinkPrincipal } from '@/02_common/data/text';
import { queryKycResultByPrincipal } from '@/05_utils/apis/yumi/kyc';
import { useDeviceStore } from '@/07_stores/device';
import { useIdentityStore } from '@/07_stores/identity';
import { IconKyc } from '@/09_components/icons';
import YumiIcon from '@/09_components/ui/yumi-icon';
import Credit from '@/09_components/user/credit';
import Username from '@/09_components/user/username';
import { HeaderView } from './common';

function ProfileHeader({ profileLoading, view }: { profileLoading: boolean; view: HeaderView }) {
    // 记录信用积分
    // 记录kyc结果
    const navigate = useNavigate();
    const [kycLoading, setKycLoading] = useState(false);
    const [kyc, setKyc] = useState<KycResult | undefined>(undefined);

    const connectedIdentity = useIdentityStore((s) => s.connectedIdentity);
    const self = view.account === connectedIdentity?.account;
    const selfKycResult = useIdentityStore((s) => s.kycResult); // 当前用户
    const reloadKycResult = useIdentityStore((s) => s.reloadKycResult);

    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    useEffect(() => {
        if (view.principal) {
            // 判断要不要查询 kyc
            setKycLoading(true);
            Promise.all([
                (async (): Promise<KycResult> => {
                    if (self && selfKycResult !== undefined) return selfKycResult;
                    return await queryKycResultByPrincipal(view.principal ?? view.account);
                })(),
            ])
                .then(([kycResult]) => {
                    if (self && kycResult !== selfKycResult) reloadKycResult();
                    setKyc(kycResult);
                })
                .catch((e) => {
                    console.error(`fetch kyc info failed: ${e.message}`, e);
                    message.error(`KYC apis exception, contact Yumi please.`);
                })
                .finally(() => setKycLoading(false));
        }
    }, [view]);

    return (
        <div className="">
            <div className="relative">
                <div className="h-[150px] w-full md:h-[300px]">
                    {profileLoading ? (
                        <Skeleton.Image className="!h-full !w-full" active={true} />
                    ) : (
                        <div
                            className="h-full w-full bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `${url_cdn(view.banner)}` }}
                        ></div>
                    )}
                </div>
                <div
                    className={cn(
                        'absolute bottom-0 left-[17px] right-3 h-[41.52px] w-[41.52px] translate-y-1/2 rounded-[8px] border-[2.5px] border-[#F6F6F6]  bg-[#F6F6F6]  md:left-[38px] md:h-[103px] md:w-[103px] md:rounded-2xl md:border-[4.5px]',
                        !profileLoading && 'border-black',
                    )}
                >
                    {profileLoading ? (
                        <Skeleton.Image className="!h-full !w-full !min-w-0 !rounded-none !bg-transparent" />
                    ) : (
                        <img className="w-full" src={cdn(view.avatar)} />
                    )}
                    {self && !profileLoading && (
                        <div className="absolute bottom-0 right-0 flex h-[16px] w-[16px] translate-x-1/2 translate-y-[40%] cursor-pointer items-center justify-center rounded-full border border-white bg-black md:h-[40px] md:w-[40px] md:border-[2px] ">
                            <Link
                                to={'/profile/settings'}
                                className="flex h-[24px] w-[24px] items-center justify-center"
                            >
                                <YumiIcon
                                    name="action-edit-pencil"
                                    size={20}
                                    color="white"
                                    className="-translate-y-[1px] translate-x-[1px]"
                                />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex px-[15px] pt-[28px] md:px-[40px] md:pt-[80px]">
                <div className="flex w-full flex-wrap justify-between">
                    <div>
                        <div className="flex items-center">
                            <div className="max-w-md overflow-hidden overflow-ellipsis whitespace-nowrap font-inter text-[16px]  font-bold md:text-[26px]">
                                <Username
                                    principal_or_account={view.principal ?? view.account}
                                    className="text-[26px]"
                                />
                            </div>
                            {!kycLoading && kyc && (
                                <div
                                    className="-mb-1 ml-2 cursor-pointer rounded-md bg-cover bg-no-repeat text-xs font-bold text-white"
                                    onClick={() => navigate('/kyc/introduction')}
                                >
                                    {kyc?.level === 'NA' && kyc?.status === 'pending' ? (
                                        <div className="rounded-[6px] bg-black px-[6px] py-[4px]">
                                            Pending
                                        </div>
                                    ) : (
                                        <IconKyc
                                            level={(kyc?.level ?? 'na').toLowerCase()}
                                            className="h-[24px] w-[24px]"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex">
                            <div className="font-inter text-base font-normal leading-7 text-gray-600">
                                {view.principal
                                    ? shrinkPrincipal(view.principal)
                                    : shrinkAccount(view.account)}
                            </div>
                            <CopyToClipboard
                                text={view.principal ?? view.account}
                                onCopy={() => message.success('Copied')}
                            >
                                <img
                                    src={
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1671606741448_icon-copy-2.svg'
                                    }
                                    className="ml-2.5 cursor-pointer"
                                />
                            </CopyToClipboard>
                        </div>
                    </div>
                    {isMobile && (
                        <YumiIcon
                            name="action-refresh"
                            size={18}
                            color="#8D8D8D"
                            className="self-start"
                        />
                    )}
                    <Credit
                        account={view.account}
                        className="ml-auto hidden gap-y-2 font-[12px] md:mt-0 md:flex md:flex-col"
                    />
                </div>
            </div>
            {/* <div className="mt-3 break-words pl-[38px] font-inter text-base font-normal text-gray-600">
                {view.bio}
            </div> */}
        </div>
    );
}

export default ProfileHeader;

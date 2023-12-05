import React, { useCallback, useState } from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';

const KycFaq = React.memo(() => {
    const [solveVideo, setSolveVideo] = useState<boolean | undefined>(true);
    const [solveText, setSolveText] = useState<boolean | undefined>(true);
    const [solveComplete, setSolveComplete] = useState<boolean | undefined>(true);
    const [activeKey, setActiveKey] = useState<string[]>([]);
    const [childeKey, setChildeKey] = useState<string[]>([]);

    const changeConfirmation = useCallback((type: string, flag: boolean | undefined) => {
        if (type === 'video') setSolveVideo(flag);
        else if (type === 'text') setSolveText(flag);
        else setSolveComplete(flag);
    }, []);

    //选择是否了解当前介绍
    const ConfirmationPanel = React.memo(
        ({
            flag,
            callback,
        }: {
            flag: boolean | undefined;
            callback: (e: boolean | undefined) => void;
        }) => {
            return (
                <>
                    {flag !== undefined && (
                        <div
                            className={cn([
                                'flex items-center justify-between pt-[15px] leading-[1px]',
                                !flag && 'justify-center',
                            ])}
                        >
                            {flag && (
                                <>
                                    {' '}
                                    <div className=" font-inter-medium text-[16px] text-symbol">
                                        Is your problem resolved?
                                    </div>{' '}
                                    <div className="flex gap-x-[20px]">
                                        {' '}
                                        <div
                                            onClick={() => callback(false)}
                                            className="flex h-[28px] w-[66px] cursor-pointer items-center justify-center rounded-[14px] border border-[#666] font-inter-medium text-[16px] text-symbol hover:border-none hover:bg-[##3844EC] hover:bg-[#3844EC] hover:text-[#fff]"
                                        >
                                            No
                                        </div>
                                        <div
                                            onClick={() => callback(undefined)}
                                            className="flex h-[28px] w-[66px] cursor-pointer items-center justify-center rounded-[14px]  bg-[#3844EC] font-inter-medium  text-[16px] text-[#fff] hover:bg-opacity-[0.85]"
                                        >
                                            Yes
                                        </div>
                                    </div>
                                </>
                            )}
                            {!flag && (
                                <div
                                    onClick={() =>
                                        window.open(
                                            'https://discord.com/channels/958400315282034779/1098591888547774594',
                                        )
                                    }
                                    className=" mt-[16px] flex h-[32px] flex-1 cursor-pointer items-center justify-center rounded-[4px] bg-[#F5F5F5] font-inter-medium text-[16px] leading-[24px] text-[#3844EC]"
                                >
                                    Need more help?{' '}
                                    <DownOutlined
                                        style={{
                                            fontSize: '12px',
                                            color: '#3844EC',
                                            strokeWidth: '5px',
                                        }}
                                        rotate={-90}
                                    />{' '}
                                </div>
                            )}
                        </div>
                    )}
                </>
            );
        },
    );

    //子级渲染
    const itemsNest: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Video Guide',
            children: (
                <div className="mt-[20px]">
                    <video
                        src={
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/home/1694154960384_kyc-faq-video-definition.mp4'
                        }
                        autoPlay={false}
                        loop={true}
                        controls={true}
                        muted={true}
                        controlsList="nodownload"
                        className="h-full max-h-[249px] w-full"
                        poster={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/home/1694138820240_kyc-faq-poster.png',
                        )}
                        // onLoadedData={(e: any) => onVideoLoaded(e)}
                    ></video>
                    <ConfirmationPanel
                        flag={solveVideo}
                        callback={(e: boolean | undefined) => {
                            changeConfirmation('video', e);
                            if (e === undefined) {
                                setActiveKey(childeKey.filter((item: string) => item !== '1'));
                            }
                        }}
                    />
                </div>
            ),
        },
        {
            key: '2',
            label: 'Text Guide',
            children: (
                <div>
                    <div className=" mt-[20px] font-inter-medium text-[15px] leading-[24px]">
                        Welcome to the Yumi NFT Marketplace KYC Verification! Our seamless guide
                        powered by our trusted partner, Onfido, will walk you through the Tier 1 KYC
                        verification process in just three steps.
                        <div
                            className=" mt-[24px] cursor-pointer text-right text-[16px] text-symbol"
                            onClick={() =>
                                window.open(
                                    'https://yuminftmarketplace.gitbook.io/yumi-docs/getting-started/kyc-guide-step-by-step/completing-tier-1-kyc-verification-on-the-yumi-nft-marketplace-in-3-simple-steps',
                                )
                            }
                        >
                            Click to get started <DownOutlined className="ml-[6px]" rotate={-90} />
                        </div>
                    </div>
                    <ConfirmationPanel
                        flag={solveText}
                        callback={(e: boolean | undefined) => {
                            changeConfirmation('text', e);
                            if (e === undefined) {
                                setActiveKey(childeKey.filter((item: string) => item !== '2'));
                            }
                        }}
                    />
                </div>
            ),
        },
    ];

    //父级 点击事件
    const onChange = (key: string | string[]) => {
        setActiveKey(key as string[]);
    };
    //子级 点击事件
    const handlePanelClick = (key: string | string[]) => {
        setChildeKey(key as string[]);
    };

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'How to register ?',
            children: (
                <>
                    <Collapse
                        style={{
                            fontSize: '18px',
                            lineHeight: '64px',
                            fontFamily: 'inter-medium',
                        }}
                        onChange={handlePanelClick}
                        className="interior"
                        expandIcon={({ isActive }) => (
                            <img
                                src={cdn(
                                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1694080256967_kyc-faq-icon.svg',
                                )}
                                className={cn([
                                    'transition hover:opacity-[0.5]'!,
                                    !isActive && 'rotate-180',
                                ])}
                            />
                        )}
                        activeKey={childeKey}
                        expandIconPosition={'end'}
                        ghost
                        defaultActiveKey="1"
                        items={itemsNest}
                    />
                </>
            ),
        },
        {
            key: '2',
            label: 'What documents can I use to complete the identity verification?',
            children: (
                <div>
                    <div className=" mt-[20px]  font-inter-medium text-[15px] leading-[24px] text-[#000]">
                        <span className="font-inter-semibold  text-stress">Tier 1: </span>
                        Passport or any other ID document with MRZ
                    </div>
                    <div className=" font-inter-medium  text-[15px] leading-[24px] text-[#000]">
                        <span className="font-inter-semibold  text-stress">Tier 2: </span>bank
                        statements, utility bills (within the last three months), internet, cable,
                        or home phone bills, tax returns, council tax bills, and government-issued
                        proof of residence.
                    </div>
                    <ConfirmationPanel
                        flag={solveComplete}
                        callback={(e: boolean | undefined) => {
                            changeConfirmation('last', e);
                            if (e === undefined) {
                                setActiveKey(activeKey.filter((item: string) => item !== '2'));
                            }
                        }}
                    />
                </div>
            ),
        },
        {
            key: '3',
            label: 'Why should I complete the KYC?',
            children: (
                <div className="mt-[20px] font-inter-medium text-[15px] leading-[24px] text-stress">
                    To create a safe and fair environment for all users, it is important for Yumi to
                    implement KYC procedures. By doing so, Yumi can minimize users' risks and
                    safeguard the buying and selling environment. KYC is particularly important for
                    complying with regulatory laws, preventing fraud, detecting and preventing money
                    laundering and terrorist financing, and building trust with users.
                    <div
                        onClick={() =>
                            window.open(
                                'https://yuminftmarketplace.gitbook.io/yumi-docs/faq/about-kyc/preparation-for-kyc',
                            )
                        }
                        className=" mt-[23px] cursor-pointer text-symbol"
                    >
                        Read More <DownOutlined style={{ fontSize: '12px' }} rotate={-90} />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className=" max-w-[482px] px-[15px] md:px-0">
            <div className=" mb-[40px] mt-[50px] font-inter-bold text-[32px] md:mb-[7px] md:mt-[165px]">
                FAQ
            </div>
            <Collapse
                onChange={onChange}
                style={{
                    fontSize: '22px',
                    fontFamily: 'inter-medium',
                }}
                className="without"
                expandIcon={({ isActive }) => (
                    <img
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1694080256967_kyc-faq-icon.svg',
                        )}
                        className={cn([
                            ' h-[28px] min-w-[28px] transition hover:opacity-[0.5]'!,
                            !isActive && 'rotate-180',
                        ])}
                    />
                )}
                expandIconPosition={'end'}
                ghost
                items={items}
                activeKey={activeKey}
            />
        </div>
    );
});
export default KycFaq;

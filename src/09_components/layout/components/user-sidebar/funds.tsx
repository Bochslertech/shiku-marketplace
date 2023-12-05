import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { rampSDK } from '@alchemy-pay/ramp-sdk';
import { LoadingOutlined } from '@ant-design/icons';
import { shallow } from 'zustand/shallow';
import { cn } from '@/02_common/cn';
import { estimateIcpAmount, queryIcpPriceInUsd } from '@/05_utils/apis/yumi/alchemy';
import interpolate from '@/05_utils/interpolate';
import { useAppStore } from '@/07_stores/app';
import { useIdentityStore } from '@/07_stores/identity';
import { MIN_FIAT_AMOUNT } from '@/09_components/nft-card/components/buy';

// 密钥
const { ALCHEMY_APP_ID, ALCHEMY_SECRET_KEY, ALCHEMY_WEBHOOK_BUY, ALCHEMY_WEBHOOK_SELL } =
    import.meta.env;
// Definition Ramp SDK
export const ramp = new rampSDK({
    secret: ALCHEMY_SECRET_KEY, // (Required)
    appId: ALCHEMY_APP_ID, // (Required)
    environment: 'PROD', // 测试环境token遗忘
    containerNode: 'rampView', // (Required) Dom node id
    optionalParameter: {
        crypto: 'ICP', //指定币种为ICP
        fiat: 'USD',
    },
});

const amounts = [
    14.0015, 14.97, 15.93, 16.89, 17.85, 18.81, 19.77, 20.73, 21.69, 22.65, 23.61, 24.57, 25.53,
    26.49, 27.45, 28.41, 29.37, 30.33, 31.29, 32.25, 33.21, 34.17, 35.13, 36.09, 37.05, 38.01,
    38.97, 39.93, 40.89, 41.85, 42.81, 43.77, 44.73, 45.69, 46.65, 47.61, 48.57, 49.53, 50.49,
    51.45, 52.41, 53.37, 54.33, 55.29, 56.25, 57.21, 58.17, 59.13, 60.09, 61.05, 62.01, 62.97,
    63.93, 64.89, 65.85, 66.81, 67.77, 68.73, 69.69, 70.65, 71.61, 72.57, 73.53, 74.49, 75.45,
    76.41, 77.37, 78.33, 79.29, 80.25, 81.21, 82.17, 83.13, 84.09, 85.05, 86.01, 86.97, 87.93,
    88.89, 89.85, 90.81, 91.77, 92.73, 93.69, 94.65, 95.61,
];

const ramp_fees = [
    0.9985, 1.03, 1.07, 1.11, 1.15, 1.19, 1.23, 1.27, 1.31, 1.35, 1.39, 1.43, 1.47, 1.51, 1.55,
    1.59, 1.63, 1.67, 1.71, 1.75, 1.79, 1.83, 1.87, 1.91, 1.95, 1.99, 2.03, 2.07, 2.11, 2.15, 2.19,
    2.23, 2.27, 2.31, 2.35, 2.39, 2.43, 2.47, 2.51, 2.55, 2.59, 2.63, 2.67, 2.71, 2.75, 2.79, 2.83,
    2.87, 2.91, 2.95, 2.99, 3.03, 3.07, 3.11, 3.15, 3.19, 3.23, 3.27, 3.31, 3.35, 3.39, 3.43, 3.47,
    3.51, 3.55, 3.59, 3.63, 3.67, 3.71, 3.75, 3.79, 3.83, 3.87, 3.91, 3.95, 3.99, 4.03, 4.07, 4.11,
    4.15, 4.19, 4.23, 4.27, 4.31, 4.35, 4.39,
];

// 获取加上手续费的usd总量
export const get_usd_with_fee = (u: number): number => {
    return u + interpolate(u, amounts, ramp_fees);
};

export const getUsdAmount = async (origin: number): Promise<number> => {
    const icp_price = await queryIcpPriceInUsd();
    for (let i = origin; i < origin + 2; i = i + 0.03) {
        const usd_amount = get_usd_with_fee(i * Number(icp_price));
        const icp_amount = await estimateIcpAmount(usd_amount);
        if (icp_amount > origin) {
            return Number(usd_amount.toFixed(2));
        }
    }
    return 2000;
};

const payUrl = ramp.handleUrl();
export const FundsModal = () => {
    const [iframeLoading, setIframeLoading] = useState<boolean>(true);
    const [iframeKey, setIframeKey] = useState<number>(0);
    const { addFundsOpen, addFundsArgs, toggleAddFundsOpen } = useIdentityStore(
        (s) => ({
            addFundsOpen: s.addFundsOpen,
            toggleAddFundsOpen: s.toggleAddFundsOpen,
            addFundsArgs: s.addFundsArgs,
        }),
        shallow,
    );
    const type = addFundsArgs?.type ?? 'BUY';
    // const symbol = addFundsArgs?.symbol ?? 'ICP';

    const amount = addFundsArgs?.amount ?? '100';

    const icp_usd = useAppStore((s) => s.icp_usd);
    const [usdAmount, setUsdAmount] = useState<number>(100);

    useEffect(() => {
        // 每次打开时刷新页面
        setIframeLoading(true);
        setIframeKey((p) => p + 1);
    }, [addFundsOpen]);

    useEffect(() => {
        const usd_with_fee = get_usd_with_fee(Number(amount) * Number(icp_usd));
        // 大于2000则传2000
        setUsdAmount(Math.min(usd_with_fee, 2000));
    }, [amount, icp_usd]);
    return (
        <Modal
            open={addFundsOpen}
            footer={null}
            closeIcon={null}
            centered={true}
            onCancel={() => {
                toggleAddFundsOpen();
            }}
            zIndex={1001}
            maskClosable={true}
            className="add-funds-modal-wrap"
        >
            <div
                className={cn(
                    '!absolute bottom-0 left-0 right-0 top-0 z-10 flex h-full w-full bg-white',
                )}
            >
                {iframeLoading && (
                    <LoadingOutlined
                        className="!mx-auto text-[50px]"
                        style={{ color: '#7953ff' }}
                    />
                )}
            </div>

            <iframe
                key={iframeKey}
                src={
                    type === 'BUY'
                        ? payUrl +
                          `&callbackUrl=${encodeURIComponent(ALCHEMY_WEBHOOK_BUY)}` +
                          (usdAmount >= MIN_FIAT_AMOUNT ? `&fiatAmount=${usdAmount}` : '')
                        : payUrl.replace('buy', 'sell') +
                          `&callbackUrl=${encodeURIComponent(ALCHEMY_WEBHOOK_SELL)}`
                }
                className={cn('invisible h-[600px] w-full', !iframeLoading && 'visible z-10')}
                onLoad={() => setIframeLoading(false)}
            ></iframe>
        </Modal>
    );
};

import { NftMetadata } from '@/01_types/nft';
import { YumiPlatformFee } from '@/03_canisters/yumi/yumi_core';

// 计算 yumi 的平台费 OGY 相关
export const getServiceFee = (
    card: NftMetadata,
    yumiPlatformFee: YumiPlatformFee | undefined,
): number | undefined => {
    if (card.metadata.raw.standard === 'ogy') {
        if (card.data && yumiPlatformFee) {
            return (
                (100 * Number(card.data.info.standard.ogy!.fee)) /
                10 ** Number(yumiPlatformFee.precision)
            );
        }
        return undefined;
    }
    if (yumiPlatformFee) {
        return (100 * Number(yumiPlatformFee.fee)) / 10 ** Number(yumiPlatformFee.precision);
    }
    return undefined;
};

// 计算 yumi 的平台费
export const getYumiServiceFee = (
    yumiPlatformFee: YumiPlatformFee | undefined,
): number | undefined => {
    if (yumiPlatformFee) {
        return (100 * Number(yumiPlatformFee.fee)) / 10 ** Number(yumiPlatformFee.precision);
    }
    return undefined;
};

import { cdn } from '@/02_common/cdn';

export const IconDiscord = () => {
    return (
        <img
            className="!w-[20px]"
            src={cdn(
                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/platform/icon-discord.svg',
            )}
            alt=""
        />
    );
};

export const IconInstagram = () => {
    return (
        <img
            className="!w-[16px]"
            src={cdn(
                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/platform/icon-instagram.svg',
            )}
            alt=""
        />
    );
};

export const IconMedium = () => {
    return (
        <img
            className="!w-[16px]"
            src={cdn(
                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/platform/icon-medium.svg',
            )}
            alt=""
        />
    );
};

export const IconTelegram = () => {
    return (
        <img
            className="!w-[16px]"
            src={cdn(
                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/platform/icon-telegram.svg',
            )}
            alt=""
        />
    );
};

export const IconTwitter = () => {
    return (
        <img
            className="!w-[16px]"
            src={cdn(
                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/platform/icon-twitter.svg',
            )}
            alt=""
        />
    );
};

export const IconSite = () => {
    return (
        <img
            className="!w-[16px]"
            src={cdn(
                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/platform/icon-site.svg',
            )}
            alt=""
        />
    );
};

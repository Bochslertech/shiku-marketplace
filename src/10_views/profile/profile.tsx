import { useEffect, useState } from 'react';
import { parse_nft_identifier } from '@/02_common/nft/ext';
import { getRandomAvatar, getRandomBanner } from '@/02_common/yumi';
import { queryProfileByPrincipalOrAccountHex } from '@/05_utils/canisters/yumi/core';
import { ProfileTab, profileToView, UsedProfile } from './common';
import ProfileContent from './content';
import ProfileHeader from './header';

function Profile({
    principal,
    account,
    tab,
}: {
    principal: string | undefined;
    account: string;
    tab: ProfileTab;
}) {
    // console.log('Profile', principal, tab);

    const [profileLoading, setProfileLoading] = useState(true);
    const [usedProfile, setUsedProfile] = useState<UsedProfile>({
        principal: undefined,
        account: '',
        banner: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/banner/banner_1.png',
        avatar: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/setting/da1.png',
        username: '',
        bio: '',
        created: [],
        favorited: [],
    });

    useEffect(() => {
        // 查询后端罐子获取信息并设置数据
        setProfileLoading(true);
        queryProfileByPrincipalOrAccountHex(principal ?? account)
            .then(
                (d) => {
                    setUsedProfile({
                        principal: d.principal,
                        account: d.account,
                        banner: d.banner,
                        avatar: d.avatar,
                        username: d.username,
                        bio: d.bio,
                        created: d.created.map(parse_nft_identifier), // 暂时后端只支持 ext 类型的创建
                        favorited: d.favorited.map(parse_nft_identifier), // 暂时后端只支持 ext 类型的收藏
                    });
                },
                (e) => {
                    console.debug(`🚀 ~ file: profile.tsx:59 ~ useEffect ~ e:`, e);
                    // ! 没注册也可以访问, 随机 banner 和 logo
                    setUsedProfile({
                        principal: principal,
                        account: account,
                        banner: getRandomBanner(),
                        avatar: getRandomAvatar(),
                        username: principal ?? account,
                        bio: '',
                        created: [], // 暂时后端只支持 ext 类型的创建
                        favorited: [], // 暂时后端只支持 ext 类型的收藏
                    });
                },
            )
            .finally(() => setProfileLoading(false));
    }, [principal, account]);

    return (
        <>
            <ProfileHeader profileLoading={profileLoading} view={profileToView(usedProfile)} />
            <ProfileContent
                principal={usedProfile?.principal ?? principal}
                account={account}
                tab={tab}
                created={usedProfile.created}
                favorited={usedProfile.favorited}
            />
        </>
    );
}

export default Profile;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { NftIdentifier } from '@/01_types/nft';
import { cn } from '@/02_common/cn';
import { getOgyGoldCanisterId } from '@/05_utils/canisters/nft/special';
import {
    useArtistCollectionIdList,
    useCollectionDataList,
    useCoreCollectionIdList,
    useOrigynArtCollectionIdList,
} from '@/08_hooks/nft/collection';
import Credit from '@/09_components/user/credit';
import { ProfileTab } from './common';
import ProfileActivity from './tabs/activity';
import ProfileAuction from './tabs/auction';
import ProfileCollected from './tabs/collected';
import ProfileCreated from './tabs/created';
import ProfileFavorite from './tabs/favorite';

const ALL_TABS: { type: ProfileTab; show: string }[] = [
    { type: 'collected', show: 'Collected' },
    { type: 'created', show: 'Created' },
    { type: 'favorite', show: 'Favorites' },
    { type: 'activity', show: 'Activity' },
    { type: 'auction', show: 'Bid Records' },
];

function ProfileContent({
    principal,
    account,
    tab,
    created,
    favorited,
}: {
    principal: string | undefined;
    account: string;
    tab: ProfileTab;
    created: NftIdentifier[];
    favorited: NftIdentifier[];
}) {
    const navigate = useNavigate(); // 路由页面

    const coreCollectionIdList = useCoreCollectionIdList();
    const artistCollectionIdList = useArtistCollectionIdList();
    const origynArtCollectionIdList = useOrigynArtCollectionIdList();
    const collectionDataList = useCollectionDataList();

    let idList = [
        ...(coreCollectionIdList ?? []), // 核心罐子记录的二级市场的罐子
        ...(artistCollectionIdList ?? []), // artist router 记录的用户的罐子
        ...(origynArtCollectionIdList ?? []), // origyn art 记录的罐子
        ...getOgyGoldCanisterId(), // 额外的 ogy 黄金罐子
    ];
    idList = _.uniq(idList); // ! 存在重复可能

    const [currentTab, setCurrentTab] = useState<ProfileTab>(tab); // 记录当前标签状态
    useEffect(() => setCurrentTab(tab), [tab]); // 如果有变化就更新

    // 切换标签
    const onTab = (tab: ProfileTab) => {
        if (currentTab === tab) return; // 不理会同样的标签
        console.debug('change tab ->', tab);
        navigate(`/profile/${principal ?? account}/${tab}`, { replace: true });
        setCurrentTab(tab);
    };

    // self
    // const connectedIdentity = useIdentityStore((s) => s.connectedIdentity);
    // const self = !!connectedIdentity && principal === connectedIdentity.principal;

    // const toggleShowBatchSellSidebar = useIdentityStore((s) => s.toggleShowBatchSellSidebar);

    // 最初没有数据,宁愿不显示内容
    if ((coreCollectionIdList ?? []).length === 0) return <></>;
    if ((artistCollectionIdList ?? []).length === 0) return <></>;
    if ((collectionDataList ?? []).length === 0) return <></>;

    return (
        <div className="mt-[25px] px-[15px] md:mt-[30px] md:px-[40px]">
            <div className="mb-[25px] flex w-full items-center justify-between md:hidden">
                <Credit account={account} className="flex flex-col gap-y-2 md:hidden" />
            </div>
            <div className="relative box-border flex items-end justify-between overflow-hidden px-0">
                <div className="absolute left-0 right-0 h-1 border-b-[2px] border-gray-300"></div>
                <div className=" flex w-full justify-between gap-x-[34px] overflow-x-scroll md:w-auto md:gap-x-[92px] md:overflow-x-hidden">
                    {ALL_TABS.map((t) => {
                        return (
                            <div
                                className={cn([
                                    'relative cursor-pointer whitespace-nowrap pb-[10px] text-[12px] font-bold text-[#999] md:pb-[20px] md:text-[18px]',
                                    currentTab === t.type && 'text-black',
                                ])}
                                onClick={() => onTab(t.type)}
                                key={t.type}
                            >
                                <div
                                    className={cn([
                                        'absolute bottom-0 left-[10px] right-[10px] mx-auto hidden h-[2px] w-[3/4] bg-black',
                                        currentTab === t.type && 'block',
                                    ])}
                                ></div>
                                {t.show}
                            </div>
                        );
                    })}
                </div>
            </div>
            {idList.length && (
                <>
                    <ProfileCollected
                        showed={currentTab === 'collected'}
                        principal={principal}
                        account={account}
                        idList={idList}
                        collectionDataList={collectionDataList}
                    />
                    <ProfileCreated
                        showed={currentTab === 'created'}
                        collectionDataList={collectionDataList}
                        created={created}
                    />
                    <ProfileFavorite
                        showed={currentTab === 'favorite'}
                        account={account}
                        collectionDataList={collectionDataList}
                        favorited={favorited}
                    />
                    <ProfileActivity showed={currentTab === 'activity'} account={account} />
                    <ProfileAuction showed={currentTab === 'auction'} principal={principal} />
                </>
            )}
        </div>
    );
}

export default ProfileContent;

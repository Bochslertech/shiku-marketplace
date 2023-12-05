import { useEffect, useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { Dropdown, MenuProps, message, Skeleton } from 'antd';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { viewedNft } from '@/05_utils/canisters/yumi/core';
import { useIdentityStore } from '@/07_stores/identity';
import { ShikuNftState } from '@/08_hooks/views/shiku';
import ShowNumber from '@/09_components/data/number';

function ShikuDetailHeader({
    card,
    name,
    token_index,
    listing,
    state,
}: {
    card: NftMetadata | undefined;
    name: string | undefined;
    token_index: number | undefined;
    listing: NftListingData | undefined;
    state: ShikuNftState | undefined;
}) {
    const identity = useIdentityStore((s) => s.connectedIdentity);

    // 要增加观看次数
    useEffect(() => {
        if (card === undefined || identity === undefined) return;
        viewedNft(identity, card.owner.token_id.token_identifier);
    }, [card, identity]);

    // 复制链接
    const shareUrl = useMemo(() => {
        if (token_index === undefined) return `${location.origin}${location.pathname}`;
        return `${location.origin}/shiku/${token_index}`;
    }, [token_index]);

    // 推特分享链接
    const shareUrlByTwitter = useMemo(() => {
        if (shareUrl === undefined) return undefined;
        return `https://twitter.com/intent/tweet?text=Check out this item on Yumi&url=${encodeURI(
            shareUrl,
        )}`;
    }, [shareUrl]);

    const shareDropMenu: MenuProps['items'] = useMemo(
        () => [
            {
                key: 'Share on twitter',
                label: (
                    <a href={shareUrlByTwitter} target="_blank">
                        Share on twitter
                    </a>
                ),
            },
            {
                key: 'Cope Link',
                label: (
                    <CopyToClipboard text={shareUrl} onCopy={() => message.success('copied')}>
                        <div>Copy Link</div>
                    </CopyToClipboard>
                ),
            },
        ],
        [shareUrlByTwitter],
    );

    return (
        <>
            <div className="flex items-center justify-end">
                <Link
                    to={`https://shiku.com`}
                    target="_blank"
                    className={cn(
                        'mr-auto flex cursor-pointer font-inter-medium text-[18px] text-[#7355FF] md:ml-[6px]',
                    )}
                >
                    <div>shiku</div>
                    {/* 手机端 sell状态 */}
                    {['Coming soon', 'Auction ended', 'Sold out'].includes(state ?? '') && (
                        <div className="ml-[12px] mr-auto flex items-center justify-center rounded-full  bg-[#7953FF] px-[11px] py-[4px] font-inter-extrabold text-[13px] text-white md:hidden">
                            <img
                                className="mr-[4px] h-[15px] w-[15px]"
                                src={cdn(
                                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691834225902_clock_icon.svg',
                                )}
                                alt=""
                            />
                            <div>{state}</div>
                        </div>
                    )}
                </Link>

                <div className="fot-inter-medium mr-[32px] flex  items-center text-[12px] text-[#8D8D8D]">
                    <img
                        className="mr-[5px] h-[12px] w-[12px] cursor-pointer"
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691833517374_Frame.svg',
                        )}
                        alt=""
                    />
                    <ShowNumber
                        value={{
                            value: listing?.views,
                            thousand: {
                                symbol: ['M', 'K'],
                                comma: true,
                            },
                        }}
                    />
                </div>

                <Dropdown menu={{ items: shareDropMenu }} placement="bottomRight">
                    <div className=" relative flex cursor-pointer items-center font-inter-medium text-[12px] text-[#8D8D8D]">
                        <img
                            className="mr-[5px] h-[12px] w-[12px] cursor-pointer"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691833517386_Vector.svg',
                            )}
                            alt=""
                        />
                        Share
                    </div>
                </Dropdown>
            </div>
            {/* 看设计稿，sold out正常情况下不出现 */}
            <div className="mb-[20px] mt-[19px] flex flex-wrap items-center justify-between md:mb-[24px] md:mt-0">
                {/* 二选一 */}
                <div className="mt-[4px] flex items-center font-inter-semibold text-[26px] text-black md:ml-[6px]">
                    Planet Earth
                    <div className="mx-[15px] h-[19px] w-[1px] bg-[#999]"></div>
                    {name}
                </div>
                {/* pc端 sell状态 */}
                {['Coming soon', 'Auction ended', 'Sold out'].includes(state ?? '') && (
                    <div className="ml-auto hidden  items-center justify-center rounded-[100px]  bg-[#7953FF] px-[10px] py-[6px] font-inter-extrabold text-[13px] text-white md:flex">
                        <img
                            className="mr-[10px] h-[15px] w-[15px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691834225902_clock_icon.svg',
                            )}
                            alt=""
                        />
                        <div>{state}</div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ShikuDetailHeader;

export const ShikuDetailHeaderSkeleton = () => {
    return (
        <>
            <div className="flex items-center justify-end">
                <Skeleton.Input className="mr-auto !h-[24px] !w-[60px] !min-w-0 md:ml-[6px]" />
                <div className="mr-[32px] flex  items-center text-[12px] text-[#8D8D8D]">
                    <Skeleton.Input className="mr-[5px] !h-[12px] !w-[30px] !min-w-0 cursor-pointer" />
                </div>

                <div className="relative flex cursor-pointer items-center font-inter-medium text-[12px] text-[#8D8D8D]">
                    <Skeleton.Input className="!h-[12px] !w-[30px] !min-w-0 cursor-pointer" />
                </div>
            </div>
            {/* 看设计稿，sold out正常情况下不出现 */}
            <div className="mb-[20px] flex items-center justify-between md:mb-[24px]">
                <Skeleton.Input className="mt-[4px] flex items-center font-inter-semibold text-[26px] text-black md:ml-[6px]" />

                <Skeleton.Input className=" !h-[32px] !w-[100px] !min-w-0 " />
            </div>
        </>
    );
};

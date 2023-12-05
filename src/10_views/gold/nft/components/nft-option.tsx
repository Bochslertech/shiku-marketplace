import { useMemo, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { SHOW_YUMI_SELLERS } from '@/05_utils/canisters/yumi/special';
import { useUsername } from '@/08_hooks/user/username';
import { NftDetailFunction } from '@/09_components/nft/detail_function';
import TooltipCN from '@/09_components/ui/tooltip';
import UserAvatar from '@/09_components/user/avatar';
import Username from '@/09_components/user/username';

const NftOption = ({
    card,
    refreshCard,
    refreshListing,
}: {
    card: NftMetadata | undefined;
    refreshCard: () => void;
    refreshListing: () => void;
}) => {
    // 所有者信息
    const { principal: ownerPrincipal, username: ownerUsername } = useUsername(card?.owner.owner);

    const [copied, setCopied] = useState(false);

    const sellerOrOwner = useMemo(() => {
        if (card?.listing === undefined) return undefined;
        return card.listing.listing.type === 'holding' ? 'Owner' : 'Seller';
    }, [card]);

    return (
        <div className="w-full flex-1">
            <div className="top-[100px] flex flex-col justify-center pt-[17px] lg:sticky lg:min-h-[485px] lg:pl-[55px] lg:pt-0">
                <div className=" mb-[9px] flex justify-between lg:mb-[26px]">
                    <Link
                        to={'/gold'}
                        className=" cursor-pointer text-[18px] text-[#7355ff] hover:underline"
                    >
                        Gold
                    </Link>
                </div>
                <div className="flex text-[26px] font-semibold leading-[31px]">
                    {card?.metadata.metadata.name}
                </div>
                <div className="mt-[44px] flex">
                    {SHOW_YUMI_SELLERS.includes(card?.owner.owner ?? '') ? (
                        <div className="mr-[20px] flex flex-1">
                            <img
                                className="mr-[15px] h-[44px] w-[44px]"
                                src={cdn(
                                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/launchpad/1682592833191_sellergold.png',
                                )}
                                alt=""
                            />
                            <div className="flex cursor-pointer flex-col">
                                <span>{sellerOrOwner}</span>
                                <span className="item-center group relative left-0   truncate text-center font-inter-bold text-[12px] font-bold leading-[11px] text-black hover:bg-[#f2f2f2] md:rounded-[4px] md:text-[16px] md:leading-[32px]">
                                    Yumi
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className=" mr-[20px] flex flex-1 cursor-pointer">
                            <div className="relative mr-[7px] h-[44px] w-[44px] rounded-full lg:mr-[15px] lg:h-[44px] lg:w-[44px]">
                                <UserAvatar
                                    className="!min-w-0 !rounded-full"
                                    principal_or_account={card?.owner.owner}
                                />
                            </div>

                            <div className="flex flex-col">
                                <span>{sellerOrOwner}</span>
                                <CopyToClipboard
                                    text={ownerUsername ?? ownerPrincipal ?? ''}
                                    onCopy={() => setCopied(true)}
                                >
                                    <div
                                        className="relative flex  shrink-0 cursor-pointer items-center text-sm leading-4 "
                                        onMouseLeave={() => setCopied(false)}
                                    >
                                        <TooltipCN
                                            placement="top"
                                            title={copied ? 'Copied' : 'Copy'}
                                            overlayInnerStyle={{
                                                width: '80px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {' '}
                                            <div className="peer flex h-[32px] items-center  leading-normal">
                                                <Username
                                                    principal_or_account={
                                                        ownerPrincipal ?? card?.owner.owner
                                                    }
                                                    openLink={false}
                                                    className="item-center group relative left-0 cursor-pointer truncate  text-center font-inter-bold text-[12px] font-bold  leading-normal text-black hover:bg-[#f2f2f2] md:rounded-[4px] md:text-[16px] md:leading-[32px]"
                                                />
                                            </div>
                                        </TooltipCN>
                                    </div>
                                </CopyToClipboard>{' '}
                            </div>
                        </div>
                    )}
                </div>

                <NftDetailFunction
                    card={card}
                    refreshCard={refreshCard}
                    refreshListing={refreshListing}
                />
            </div>
        </div>
    );
};
export default NftOption;

import { NftIdentifier } from '@/01_types/nft';
import { ShoppingCartItem } from '@/01_types/yumi';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { shrinkText } from '@/02_common/data/text';
import {
    getCollectionNameByNftMetadata,
    getNameByNftMetadataForCart,
    getThumbnailByNftMetadata,
} from '@/05_utils/nft/metadata';
import YumiIcon from '@/09_components/ui/yumi-icon';
import TokenPrice from '../../../data/price';
import NftMedia from '../../../nft/media';

function CartItem({
    item,
    remove,
}: {
    item: ShoppingCartItem;
    remove: (token_id: NftIdentifier) => void;
}) {
    const isListing = item.listing?.type === 'listing';
    return (
        <div
            className={cn([
                'group m-auto flex h-[80px] w-full flex-shrink-0 cursor-pointer items-center px-[30px] py-[15px] hover:rounded-none hover:bg-[#F5F5F5]',
                !isListing && 'cursor-no-drop bg-[#f5f5f5]',
            ])}
        >
            <div className="relative mr-[15px] w-[57px] flex-shrink-0 rounded-[4px]">
                <NftMedia src={cdn(getThumbnailByNftMetadata(item.card!))} />
            </div>
            {/* <div>{item.token_id.token_identifier}</div> */}
            <div className="flex-1">
                <div
                    className={cn([
                        'mb-[13px] flex-1 truncate font-inter-bold text-[14px] leading-[18px] text-black',
                        !isListing && 'text-[#999]',
                    ])}
                >
                    {getNameByNftMetadataForCart(item.card!)}
                </div>

                <div className="font-inter-normal flex-1 truncate text-[14px] leading-[18px] text-[#999]">
                    {shrinkText(getCollectionNameByNftMetadata(item.card), 14, 0)}
                </div>
            </div>
            <div className="ml-[5px] mr-[8px] text-right">
                {item.listing?.type === 'listing' ? (
                    <>
                        <TokenPrice
                            className="text-[12px] group-hover:hidden"
                            value={{
                                value: item.listing.price,
                                token: item.listing.token,
                                scale: 2,
                                thousand: { symbol: 'K' },
                            }}
                        />
                        <div
                            onClick={() => remove(item.token_id)}
                            className="hidden h-[24px] w-[24px] cursor-pointer group-hover:block"
                        >
                            <YumiIcon name="action-delete" size={24} color="#666666" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="font-inter-semibold text-[12px] text-[#999] group-hover:hidden">
                            Defunct
                        </div>
                        <div
                            onClick={() => remove(item.token_id)}
                            className="hidden h-[24px] w-[24px] cursor-pointer group-hover:block"
                        >
                            <YumiIcon name="action-delete" size={24} color="#666666" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CartItem;

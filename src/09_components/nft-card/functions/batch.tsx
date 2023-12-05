import { ConnectedIdentity } from '@/01_types/identity';
import { NftListingData } from '@/01_types/listing';
import { NftIdentifier } from '@/01_types/nft';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { isSameNft } from '@/02_common/nft/identifier';
import { justPreventLink, preventLink } from '@/02_common/react/link';
import { getLedgerTokenIcp } from '@/05_utils/canisters/ledgers/special';
import { useIdentityStore } from '@/07_stores/identity';
import { useShowBatchListingButton } from '@/08_hooks/nft/functions/batch';

function BatchListingButton({
    card,
    listing,
    identity,
}: {
    card: NftMetadata;
    listing: NftListingData | undefined;
    identity?: ConnectedIdentity;
}) {
    const showBatchListingButton = useShowBatchListingButton(card, listing);

    // const showBatchSellSidebar = useIdentityStore((s) => s.showBatchSellSidebar);
    // const toggleShowBatchSellSidebar = useIdentityStore((s) => s.toggleShowBatchSellSidebar);
    const batchSales = useIdentityStore((s) => s.batchSales);
    const addBatchNftSale = useIdentityStore((s) => s.addBatchNftSale);
    const removeBatchNftSale = useIdentityStore((s) => s.removeBatchNftSale);

    const token_id: NftIdentifier = card.metadata.token_id;

    const item = batchSales.find((l) => isSameNft(l.token_id, token_id));
    // const isGold = getOgyGoldCanisterId().includes(card.metadata.token_id.collection);
    // 取消售卖自己的 NFT
    const onChange = () => {
        // 没有打开的话，加入就打开
        if (item === undefined) {
            addBatchNftSale({
                token_id,
                card,
                owner: card.owner,
                token: getLedgerTokenIcp(), // 默认 ICP // ! Gold 可以更改
                last:
                    card.listing?.listing.type === 'listing'
                        ? card.listing?.listing.price // 尽量取出当前挂单价格,理论上已经上架的不会加入到批量售出列表的
                        : undefined,
                price: '',
            });
        } else {
            removeBatchNftSale(token_id);
        }
    };

    if (!identity || !showBatchListingButton) return <></>; // 没登录不显示
    return (
        <div
            onClick={justPreventLink}
            className="absolute right-[6px] top-[7px] z-40  h-[18px] w-[18px] rounded-[18px] bg-black/25 backdrop-blur-sm group-hover:block"
        >
            <span onClick={preventLink(onChange)}>
                <img
                    className="ml-[4px] mt-[4px] block h-[10px] w-[10px]"
                    src={cdn(
                        item === undefined
                            ? 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691309196073_Vector.svg'
                            : 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1675497922176_add-card-remove.svg',
                    )}
                    alt=""
                />
            </span>
        </div>
    );
}

export default BatchListingButton;

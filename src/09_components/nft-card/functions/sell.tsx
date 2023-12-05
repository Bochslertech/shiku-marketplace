import { useEffect, useState } from 'react';
import { HoldingAction } from '@/01_types/exchange/single-hold';
import { SellNftExecutor } from '@/01_types/exchange/single-sell';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { preventLink } from '@/02_common/react/link';
import { getOgyGoldCanisterId } from '@/05_utils/canisters/nft/special';
import { useTransactionStore } from '@/07_stores/transaction';
import { useShowChangePriceButton, useShowSellButton } from '@/08_hooks/nft/functions/sell';
import SellModal from '../components/sell';
import SellGoldModal from '../components/sell/gold';

function SellButton({
    card,
    listing,
    holdingAction,
    lastPrice,
    identity,
    sell,
    executing,
    refreshListing,
    className,
}: {
    card: NftMetadata;
    listing: NftListingData | undefined;
    holdingAction: HoldingAction;
    lastPrice?: string; // 当前出价
    identity?: ConnectedIdentity;
    sell: SellNftExecutor;
    executing: boolean;
    refreshListing: () => void;
    className?: string;
}) {
    const showSellButton =
        lastPrice === undefined
            ? useShowSellButton(card, listing)
            : useShowChangePriceButton(card, listing, holdingAction);
    // 出售信息
    const [sellNft, setSellNft] = useState<NftMetadata | undefined>(undefined);
    const onCleanSellNft = () => setSellNft(undefined);
    // 出售自己的 NFT
    const onSell = () => setSellNft(card);
    // 异步交易成功后刷新列表
    const refreshSingleSellFlags = useTransactionStore((s) => s.refreshFlags['single-sell']);
    useEffect(() => {
        refreshSingleSellFlags && refreshListing();
    }, [refreshSingleSellFlags]);
    if (!showSellButton || !identity) return <></>;
    return (
        <>
            <button className={className} onClick={preventLink(onSell)}>
                {lastPrice ? <span>Change price</span> : <span>Sell</span>}
            </button>
            {sellNft && (
                <>
                    {
                        // ! Gold 要使用 gold 的专门弹窗
                        getOgyGoldCanisterId().includes(card.owner.token_id.collection) ? (
                            <SellGoldModal
                                identity={identity}
                                card={sellNft}
                                lastPrice={lastPrice}
                                sell={sell}
                                executing={executing}
                                refreshListing={refreshListing}
                                onClose={onCleanSellNft}
                            />
                        ) : (
                            <SellModal
                                identity={identity}
                                card={sellNft}
                                lastPrice={lastPrice}
                                sell={sell}
                                executing={executing}
                                refreshListing={refreshListing}
                                onClose={onCleanSellNft}
                            />
                        )
                    }
                </>
            )}
        </>
    );
}

export default SellButton;

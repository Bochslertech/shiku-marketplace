import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyingAction, BuyNftExecutor } from '@/01_types/exchange/single-buy';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { preventLink } from '@/02_common/react/link';
import { useIdentityStore } from '@/07_stores/identity';
import { useShowBuyButton } from '@/08_hooks/nft/functions/buy';
import BuyModal from '../components/buy';

function BuyButton({
    card,
    listing,
    buy,
    action,
    refreshListing,
    className,
}: {
    card: NftMetadata;
    listing: NftListingData | undefined;
    buy: BuyNftExecutor;
    action: BuyingAction;
    refreshListing: () => void;
    className?: string;
}) {
    const navigate = useNavigate();
    const identity = useIdentityStore((s) => s.connectedIdentity);

    const showBuyButton = useShowBuyButton(card, listing);

    // 出售信息
    const [buyNft, setBuyNft] = useState<
        { card: NftMetadata; listing: NftListingData } | undefined
    >(undefined);
    const onCleanBuyNft = () => setBuyNft(undefined);

    // 购买 NFT
    const onBuy = () => {
        if (!identity) return navigate('/connect');
        setBuyNft({
            card,
            listing: listing!,
        });
    };

    if (!showBuyButton || !listing) return <></>;

    return (
        <>
            <button className={className} onClick={preventLink(onBuy)}>
                Buy now
            </button>
            {buyNft && (
                <BuyModal
                    card={buyNft.card}
                    listing={buyNft.listing}
                    buy={buy}
                    action={action}
                    refreshListing={refreshListing}
                    onClose={onCleanBuyNft}
                />
            )}
        </>
    );
}

export default BuyButton;

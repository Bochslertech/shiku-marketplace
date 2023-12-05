import { useState } from 'react';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { preventLink } from '@/02_common/react/link';
import { useShowBlindBoxButton } from '@/08_hooks/nft/functions/blind';
import BlindBoxModal from '../components/blind';

function BlindBoxButton({
    card,
    listing,
    identity,
    refreshList,
    className,
}: {
    card: NftMetadata;
    listing: NftListingData | undefined;
    identity?: ConnectedIdentity;
    refreshList: () => void;
    className?: string;
}) {
    const showOpenBlindButton = useShowBlindBoxButton(card, listing);

    // 出售信息
    const [openingNft, setOpeningNft] = useState<NftMetadata | undefined>(undefined);
    const onCleanTransferNft = () => setOpeningNft(undefined);

    // 出售自己的 NFT
    const onOpen = () => setOpeningNft(card);

    if (!showOpenBlindButton || !identity) return <></>;
    return (
        <>
            <button className={className} onClick={preventLink(onOpen)}>
                Open
            </button>
            {openingNft && (
                <BlindBoxModal
                    identity={identity}
                    card={openingNft}
                    refreshList={refreshList}
                    onClose={onCleanTransferNft}
                />
            )}
        </>
    );
}

export default BlindBoxButton;

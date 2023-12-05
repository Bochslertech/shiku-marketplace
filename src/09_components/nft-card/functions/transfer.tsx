import { useState } from 'react';
import { TransferNftExecutor, TransferringAction } from '@/01_types/exchange/single-transfer';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { preventLink } from '@/02_common/react/link';
import { useShowTransferButton } from '@/08_hooks/nft/functions/transfer';
import TransferModal from '../components/transfer';

function TransferButton({
    card,
    listing,
    identity,
    transfer,
    action,
    refreshList,
    className,
}: {
    card: NftMetadata;
    listing: NftListingData | undefined;
    identity?: ConnectedIdentity;
    transfer: TransferNftExecutor;
    action: TransferringAction;
    refreshList: () => void;
    className?: string;
}) {
    const showTransferButton = useShowTransferButton(card, listing);

    // 出售信息
    const [transferNft, setTransferNft] = useState<NftMetadata | undefined>(undefined);
    const onCleanTransferNft = () => setTransferNft(undefined);

    // 出售自己的 NFT
    const onTransfer = () => setTransferNft(card);

    if (!showTransferButton || !identity) return <></>;
    return (
        <>
            <button className={className} onClick={preventLink(onTransfer)}>
                Transfer
            </button>
            {transferNft && (
                <TransferModal
                    identity={identity}
                    card={transferNft}
                    transfer={transfer}
                    action={action}
                    refreshList={refreshList}
                    onClose={onCleanTransferNft}
                />
            )}
        </>
    );
}

export default TransferButton;

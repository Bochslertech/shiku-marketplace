import { useState } from 'react';
import { message, Modal } from 'antd';
import { HoldingAction, HoldingNftExecutor } from '@/01_types/exchange/single-hold';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { alreadyMessaged } from '@/02_common/data/promise';
import { preventLink } from '@/02_common/react/link';
import { useShowHoldButton } from '@/08_hooks/nft/functions/hold';
import Loading from '../../ui/loading';

const CancelModal = () => {
    const [open, setOpen] = useState(true);
    const onModalClose = () => setOpen(false);
    return (
        <Modal open={open} centered={true} footer={null} onCancel={onModalClose}>
            <div className="flex h-[400px] flex-col">
                <div className='text-black" mb-[20px] font-inter-bold text-[20px]'>
                    {'Cancelling your listing'}
                </div>
                <div className="flex flex-1">
                    <Loading className="my-auto" />
                </div>
            </div>
        </Modal>
    );
};

function HoldButton({
    card,
    listing,
    identity,
    hold,
    action,
    refreshListing,
    className,
}: {
    card: NftMetadata;
    listing: NftListingData | undefined;
    identity?: ConnectedIdentity;
    hold: HoldingNftExecutor;
    action: HoldingAction;
    refreshListing: () => void;
    className?: string;
}) {
    const showHoldButton = useShowHoldButton(card, listing);

    // 取消售卖自己的 NFT
    const onHolding = async () => {
        if (action !== undefined) return; // 注意防止重复点击
        hold(identity!, card.owner)
            .then((d) => {
                message.destroy();
                return alreadyMessaged(d);
            })
            .then(() => {
                message.success('Cancel listing successful.');
                refreshListing(); // 刷新界面
            });
    };

    if (!showHoldButton || !identity) return <></>;
    return (
        <>
            {/* // {action === undefined && <span>取消</span>}
                // {action === 'DOING' && <span>取消中</span>}
                // {action === 'CANCELLING' && <span>下架中</span>}
                // {action === 'HOLDING' && <span>下架中</span>} */}
            <button className={className} onClick={preventLink(onHolding)}>
                Cancel
            </button>
            {action && action !== 'HOLDING' && <CancelModal />}
        </>
    );
}

export default HoldButton;

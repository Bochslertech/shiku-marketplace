import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { cdn } from '@/02_common/cdn';
import { readKycPrompted, writeKycPrompted } from '@/05_utils/app/storage';
import { useIdentityStore } from '@/07_stores/identity';
import { Dialog, DialogContent, DialogHeader } from '../../ui/dialog';

const KycPromptModal = () => {
    const {
        connectedIdentity: identity,
        kycResult,
        buyingNft,
        setBuyingNft,
    } = useIdentityStore((s) => s);
    const [prompted, setPrompted] = useState<boolean>(true);
    useEffect(() => {
        if (identity) setPrompted(readKycPrompted(identity.principal));
    }, [identity]);

    const [lastPrincipal, setLastPrincipal] = useState<string | undefined>(undefined);
    useEffect(() => {
        if (identity) setLastPrincipal(identity.principal);
        else if (lastPrincipal) writeKycPrompted(lastPrincipal, false);
    }, [identity, lastPrincipal]);

    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (kycResult && kycResult.level === 'NA') {
            if (!prompted) {
                writeKycPrompted(kycResult.principal, true);
                setPrompted(true);
                setOpen(true);
            } else if (buyingNft) setOpen(true);
        }
    }, [kycResult, prompted, buyingNft]);

    const onClose = () => {
        setOpen(false);
        setBuyingNft(false);
    };

    return (
        <Dialog modal={true} key={'kycModal'} open={open}>
            <DialogContent className="z-[1010] w-[335px] rounded-[16px]">
                <DialogHeader className="flex h-0 flex-row items-center justify-between md:h-auto">
                    <div></div>
                    <X
                        className="cursor-pointer text-gray-300 hover:text-black"
                        onClick={onClose}
                    />
                </DialogHeader>
                <div className=" flex flex-col items-center justify-center">
                    <img
                        className="h-[44px] w-[44px]"
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/launchpad/1682416486036_validate.png',
                        )}
                        alt=""
                    />
                    <div className=" mb-[34px] mt-[27px] text-center font-inter-medium text-[14px] leading-[24px]">
                        {buyingNft
                            ? 'Please complete KYC verification to trade NFTs, receive more OGY tokens, and get a free surprise NFT'
                            : 'Please complete identity verification to trade NFTs and get a free surprise NFT !'}
                    </div>
                    <Link
                        to={'/kyc/introduction'}
                        onClick={onClose}
                        className="flex h-[40px] w-[150px] cursor-pointer items-center justify-center rounded-[8px] bg-[#000] font-inter-bold text-[16px] text-[#fff]"
                    >
                        Get verified
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default KycPromptModal;

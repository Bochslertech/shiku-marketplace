import { useCallback, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { ProposalOption } from '@/03_canisters/yumi/yumi_origyn_art_proposal';
import { voteProposal } from '@/05_utils/canisters/yumi/origyn-art-proposal';
import { useIdentityStore } from '@/07_stores/identity';
import YumiIcon from '@/09_components/ui/yumi-icon';

const VoteModal = ({
    open,
    onClose,
    modalTitle,
    myVotes,
    value,
}: {
    open: boolean;
    onClose: () => void;
    modalTitle: string | undefined;
    myVotes: number;
    value: ProposalOption | undefined;
}) => {
    const [loading, setLoading] = useState<boolean>(false);

    const vote = useCallback(async () => {
        if (value) {
            setLoading(true);
            try {
                const identity = useIdentityStore((s) => s.connectedIdentity);
                if (identity) {
                    const userVote = await voteProposal(identity, {
                        proposal_id: value.proposal_id,
                        option_id: value.id,
                        vote: 'yes',
                    });
                    if ('failed' === userVote) {
                        message.error('vote failed');
                    }
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.debug('🚀 ~ file: vote-modal.tsx:34 ~ vote ~ error:', error);
            }
        }
    }, [value]);

    return (
        <div id="confirm-modal">
            <Modal
                open={open}
                closeIcon={<YumiIcon name="action-close" color="#CBCBCB" />}
                // onOk={handleOk}
                onCancel={() => onClose()}
                getContainer={() => document.getElementById('confirm-modal') as HTMLElement}
                footer={null}
                centered={true}
            >
                <div className=" font-inter-bold text-[20px] leading-[20px] ">
                    Confirm your vote
                </div>
                <div className=" mb-[30px] mt-[45px] font-inter-medium text-[14px] text-symbol">
                    {modalTitle}
                </div>
                <div className="font-inter-semibold text-[18px] leading-[24px] text-[#151515]">
                    {myVotes} {myVotes <= 1 ? 'vote' : 'votes'}
                </div>
                <div className="tips-boxShadow mb-[50px] mt-[14px] flex items-center justify-center rounded-[8px] py-[19px]">
                    <div className=" ml-[22px] mr-[37px] inline-block h-[24px] w-[24px] bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1692088366395_check_ic.svg')] bg-center bg-no-repeat"></div>
                    <div>
                        <div className="mb-[4px] font-inter-bold text-[12px] text-[#000] text-opacity-[0.8]">
                            Note
                        </div>
                        <div className=" max-w-[400px] font-inter-regular text-[12px] leading-[16px]">
                            Selling or buying an NFT does not affect your voting power once your
                            votes have been cast, and please note that votes cannot be changed once
                            cast.
                        </div>
                    </div>
                </div>
                <Button
                    className=" mx-auto block h-[44px] w-[160px] cursor-pointer rounded-[8px] bg-[#060606] text-center font-inter-bold text-[16px] text-[#fff]"
                    onClick={() => vote()}
                    loading={loading}
                >
                    Confirm
                </Button>
            </Modal>
        </div>
    );
};
export default VoteModal;

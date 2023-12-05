import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { BatchBuyingTransaction } from '@/01_types/exchange/batch-buy';
import { BatchBuyingGoldTransaction } from '@/01_types/exchange/batch-buy-gold';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { parse_nft_identifier } from '@/02_common/nft/ext';
import { uniqueKey } from '@/02_common/nft/identifier';
import { useIdentityStore } from '@/07_stores/identity';
import { TransactionRecord } from '@/07_stores/transaction';
import NftName from '@/09_components/nft/name';
import NftThumbnail from '@/09_components/nft/thumbnail';
import { IconLaunchpadFailed } from '../../../icons';
import { Button } from '../../../ui/button';
import './index.less';

// 这是购物车结果页的弹窗
const BatchBuyingResultModal = ({
    record,
    transaction,
    onClose,
}: {
    record: TransactionRecord;
    transaction: BatchBuyingTransaction | BatchBuyingGoldTransaction;
    onClose: () => void;
}) => {
    const toggleShowShoppingCart = useIdentityStore((s) => s.toggleShowShoppingCart);

    const sale_list = transaction.args.token_list;

    let success_token_list;

    switch (transaction.type) {
        case 'batch-buy-gold':
            success_token_list = transaction.actions
                .find((i) => i.action === 'BID_NFTS_ALL_SUCCESS')
                ?.data.collections.flatMap((c) => c.list.map((i) => i.owner.token_id));
            console.debug('🚀 ~ file: cart-modal.tsx:37 ~ success_token_list:', success_token_list);
            break;
        case 'batch-buy':
            success_token_list = transaction.actions
                .find((i) => i.action === 'SUBMITTING_HEIGHT')
                ?.data.map(parse_nft_identifier);
            break;
        default:
            success_token_list = [];
            break;
    }

    const cancelModal = () => {
        onClose();
    };
    const success = record.status === 'successful';

    return (
        <Modal open={success} footer={null} onCancel={cancelModal} centered={true} className="">
            <div className="flex min-h-[400px] flex-col items-center justify-center">
                <div className={cn('flex h-full flex-col justify-between')}>
                    {(!success_token_list ||
                        (success_token_list && success_token_list.length === 0)) && (
                        <div className="flex min-h-[400px] flex-col justify-between">
                            <span className="mb-[20px] font-inter-bold text-[20px] text-black">
                                Purchase Failed
                            </span>
                            <div className="flex flex-col items-center">
                                <IconLaunchpadFailed className="h-[142.3px] w-[179px]" />
                                <p className="mt-[30px] font-inter text-[14px] leading-[20px] ">
                                    Sorry, your purchase has failed. The paid funds have been
                                    returned to your account, please check and try the purchase
                                    again!
                                </p>

                                <div className="mt-[15px] flex justify-center">
                                    <Link to={'/profile'}>
                                        <Button className="!hover:text-white h-[48px] w-[160px] cursor-pointer rounded-[8px] bg-[#060606] text-center text-[16px] leading-[48px] text-[#fff]">
                                            View NFT
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                    {success_token_list && success_token_list.length !== 0 && (
                        <>
                            <div className="">
                                <div className="m-auto mb-[8px] flex h-[65px] w-[65px] items-center justify-center rounded-[50%] border border-solid border-black bg-white">
                                    <img
                                        className="h-[44px] w-[44px]"
                                        src={cdn(
                                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1692432873065_Frame.svg',
                                        )}
                                        alt=""
                                    />
                                </div>
                                <div className="mb-[19px] text-center font-inter-bold text-[14px] text-black md:mb-[25px]">
                                    Purchase successfully!
                                </div>
                            </div>
                            <div className="grid w-full grid-cols-3 flex-wrap items-center gap-x-[24px]  gap-y-[20px] md:grid-cols-5">
                                {success_token_list.map((i) => (
                                    <div
                                        key={uniqueKey(i)}
                                        className="flex h-full w-full cursor-pointer flex-col justify-between"
                                    >
                                        <NftThumbnail token_id={i} />

                                        <NftName
                                            token_id={i}
                                            className="mt-[9px] h-[14px] text-center text-[12px] leading-[14px]"
                                            shrink_text={{ prefix: 3, suffix: 6 }}
                                        ></NftName>
                                    </div>
                                ))}
                            </div>
                            <div className="font-inter-normal mt-[30px] w-full text-left  text-[14px] text-black">
                                You claimed {sale_list.length} NFTS and the result is:
                                <span className="text-[#7355FF]">
                                    {success_token_list?.length} successes,{' '}
                                    {sale_list.length - success_token_list.length} failures
                                </span>
                            </div>
                            <div className="font-inter-normal m-auto hidden  text-left text-[14px] text-black">
                                In the failed claim, the paid funds have been returned to your
                                account, please check and try the purchase again!
                            </div>
                            <div className="font-inter-normal m-auto  text-left text-[14px] text-black">
                                Sorry for the inconvenience, you will get your refund in your
                                account for failed order, please check and try to purchase again!
                            </div>
                            <div className="mt-[30px]">
                                <div className="font-inter-normal mb-[19px] text-center text-[12px] text-black md:mb-[15px]">
                                    Check your NFT in the profile page
                                </div>
                                <Link
                                    to="/profile"
                                    onClick={() => {
                                        onClose();
                                        toggleShowShoppingCart();
                                    }}
                                >
                                    <Button className="m-auto block !h-[40px] !w-[134px] rounded-[8px] bg-[#060606] text-center font-inter-bold text-[16px] text-white md:!h-[48px] md:!w-[160px]">
                                        View
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};
export default BatchBuyingResultModal;

import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { message, Modal, Skeleton } from 'antd';
import { NftTicketOwnedData } from '@/01_types/yumi-standard/ticket';
import { cdn_by_assets } from '@/02_common/cdn';
import { justPreventLink, preventLink } from '@/02_common/react/link';
import { IconCloseModal, IconCopy } from '../../../icons';
import './index.less';

const TicketLotteryModal = ({
    open,
    setOpen,
    success,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    success?: string;
}) => {
    return (
        <Modal
            open={open}
            onCancel={() => setOpen(false)}
            closeIcon={<></>}
            footer={null}
            centered={true}
            className="ticket-modal relative  !w-fit  !bg-transparent !px-0"
        >
            {success === undefined && <Skeleton.Image />}
            {success !== undefined && (
                <img
                    onClick={(e) => justPreventLink(e)}
                    className="md:w-[407px]"
                    src={cdn_by_assets(`/images/ticket/lottery/${success ? 'win' : 'lose'}.png`)}
                    alt=""
                />
            )}
            <IconCloseModal
                onClick={preventLink(() => setOpen(false))}
                className="absolute right-[5%] top-[18%] cursor-pointer opacity-30 hover:opacity-100 "
            />
        </Modal>
    );
};

const TicketCodeModal = ({
    open,
    setOpen,
    code,
    children,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    code: string;
    children?: any;
}) => {
    return (
        <Modal
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            centered={true}
            className="relative  !bg-transparent !px-0"
            width={600}
        >
            <div onClick={justPreventLink}>
                <div className="font-inter-bold text-[24px] ">Congratulations!</div>
                <div className="mt-[32px] flex flex-col items-center justify-start gap-y-[26px]">
                    <div className="font-inter-medium text-[14px] text-symbol">
                        You can use this Item code
                    </div>
                    <div className="flex items-center gap-x-[10px]">
                        {!code && <Skeleton.Input />}
                        {code && (
                            <div className="rounded-[8px] bg-[#F0F5F5] px-[17px] py-[11px] font-inter-semibold text-[20px]">
                                {code}
                            </div>
                        )}

                        <CopyToClipboard text={code}>
                            <IconCopy
                                className="cursor-pointer"
                                onClick={() => message.success('Copied!')}
                            />
                        </CopyToClipboard>
                    </div>
                    {children}
                    <div className="text-[12px] text-[#999]">
                        Please keep your item code safe and do not disclose it to others.
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const TicketModal = ({ data, onClose }: { data: NftTicketOwnedData; onClose: () => void }) => {
    message.destroy(); // 关闭 loading

    const [open, setOpen] = useState(true);
    const wrappedClose = (open: boolean) => {
        setOpen(open);
        if (!open) onClose();
    };

    if (data.type === 'lottery')
        return <TicketLotteryModal open={open} setOpen={wrappedClose} success={data.owned} />;

    if (data.type === 'code' && data.project === 'Hello! HashKey & ICP & Yumi Edition')
        return (
            <TicketCodeModal open={open} setOpen={wrappedClose} code={data?.owned ?? ''}>
                <div className="flex flex-col items-center text-[14px] md:flex-row">
                    <div className=" text-symbol">
                        To get extra 20HSK when you register to&nbsp;
                    </div>

                    <Link
                        to={'https://www.hashkey.com'}
                        target="_blank"
                        className="cursor-pointer text-stress underline "
                        onClick={() => window.open('https://www.hashkey.com', '_blank')}
                    >
                        {' '}
                        Hello! HashKey.
                    </Link>
                </div>
            </TicketCodeModal>
        );

    throw new Error(`Wrong ticket type: ${data.type} ${data.project}`);
};

export default TicketModal;

import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Modal } from 'antd';
import { QRCodeSVG } from 'qrcode.react';
import { SupportedLedgerTokenSymbol } from '@/01_types/canisters/ledgers';
import CloseIcon from '../../../ui/close-icon';
import Tooltip from '../../../ui/tooltip';

export const DepositModal = ({
    open,
    setOpen,
    principal,
    account,
    symbol,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    principal?: string;
    account?: string;
    symbol?: SupportedLedgerTokenSymbol;
}) => {
    const [copied, setCopied] = useState(false);
    return (
        <Modal
            open={open}
            footer={null}
            centered={true}
            //onOk={onConfirm}
            closeIcon={null}
            onCancel={() => {
                setOpen(false);
            }}
            styles={
                {
                    // mask: { backgroundColor: 'transparent' },
                }
            }
            maskClosable={true}
            className="deposit-modal-wrap"
        >
            <div className="flex h-full w-full flex-col gap-y-[30px]">
                <div className="flex justify-between">
                    <div className="font-inter-bold text-[20px]">
                        Deposit {symbol ?? 'ICP'.toLocaleUpperCase()}
                    </div>
                    <CloseIcon className="w-[14px]" onClick={() => setOpen(false)} />
                </div>
                <div className="flex">
                    {principal && (
                        <QRCodeSVG className="mx-auto h-[150px] w-[150px]" value={principal} />
                    )}
                </div>

                <div className="text-[12px]">
                    <div>
                        <div className="font-inter-medium  leading-tight text-symbol">
                            Principal ID:
                        </div>
                        <CopyToClipboard text={principal} onCopy={() => setCopied(true)}>
                            <Tooltip
                                title={copied ? 'Copied' : 'Copy'}
                                placement="top"
                                overlayInnerStyle={{ width: '80px', textAlign: 'center' }}
                            >
                                <div
                                    onMouseLeave={() => setCopied(false)}
                                    className="mt-[10px] cursor-pointer font-inter-semibold text-stress"
                                >
                                    {principal}
                                </div>
                            </Tooltip>
                        </CopyToClipboard>
                    </div>
                    <div className="mt-[20px]">
                        <div className="font-inter-medium leading-tight text-symbol">
                            Account ID:
                        </div>
                        <CopyToClipboard text={account} onCopy={() => setCopied(true)}>
                            <Tooltip
                                title={copied ? 'Copied' : 'Copy'}
                                placement="top"
                                overlayInnerStyle={{ width: '80px', textAlign: 'center' }}
                            >
                                {' '}
                                <div
                                    onMouseLeave={() => setCopied(false)}
                                    className="mt-[10px] cursor-pointer font-inter-semibold text-stress"
                                >
                                    {account}
                                </div>
                            </Tooltip>
                        </CopyToClipboard>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

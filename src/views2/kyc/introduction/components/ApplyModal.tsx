import React, { useCallback, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { kyc2EmailContactUs } from '@/05_utils/apis/yumi/kyc';

type PropsType = {
    visible: boolean;
    onClose: () => void;
    principal: string | undefined;
};

const ApplyModal = React.memo((props: PropsType) => {
    const { visible, onClose, principal } = props;
    const [btnLoading, setBtnLoading] = useState(false);

    const contactEmail = useCallback(() => {
        if (principal) {
            setBtnLoading(true);
            kyc2EmailContactUs(principal)
                .then((res) => {
                    setBtnLoading(false);
                    message.success(res);
                })
                .catch((err) => {
                    console.debug('🚀 ~ file: ApplyModal.tsx:25 ~ contactEmail ~ err:', err);
                    setBtnLoading(false);
                });
        }
    }, [principal]);

    return (
        <Modal
            title={false}
            open={visible}
            onCancel={onClose}
            footer={null}
            centered={true}
            className="!w-[600px] p-[30px]"
            getContainer={document.getElementById('kyc-feature') || false}
        >
            <div className=" font-inter-bold text-[20px]">Tier 3 application</div>
            <div className=" mb-[33px] mt-[30px] text-[14px] leading-[20px] text-symbol">
                You are going to apply for Tier 3 verification. Our team will contact you via email
                with the next steps.
            </div>
            <Button
                loading={btnLoading}
                type="text"
                className="mx-auto flex h-[50px] w-[190px] cursor-pointer items-center justify-center rounded-[8px] bg-[#000] font-inter-bold text-[18px] text-[#fff]"
                onClick={() => contactEmail()}
            >
                Apply
            </Button>
        </Modal>
    );
});

export default ApplyModal;

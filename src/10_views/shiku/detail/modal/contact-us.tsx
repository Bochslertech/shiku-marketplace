import { useEffect } from 'react';
import { message, Modal } from 'antd';
import { useForm } from '@formspree/react';
import { cn } from '@/02_common/cn';

function ShikuLandsNftContactUsModal({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (o: boolean) => void;
}) {
    const onClose = () => setOpen(false);

    const [form, onSubmit] = useForm('xbjeaogd');

    useEffect(() => {
        if (form.succeeded) {
            onClose();
            // setSubmitFlag(false);
            message.success({
                content: 'Thank you! We will get back to you shortly',
                duration: 3,
            });
        }
    }, [form]);

    return (
        <Modal footer={null} centered={true} open={open} width="672px" onCancel={onClose}>
            <form className="px-[20px]" onSubmit={onSubmit}>
                <div className="font-inter-medium text-[30px] text-[#151515]">Request interest</div>

                <div className="font-inter-normal mb-[36px] mt-[33px] text-[17px] text-[#151515]">
                    Fill the form to get in touch with Shiku and receive more information to buy
                    your parcel.
                </div>

                <div className="mb-[15px] text-left font-inter-medium text-[17px] text-[#151515]">
                    Full Name
                </div>
                <input
                    className="h-[57px] w-full rounded-[10px] border border-solid border-[#D9D9D9] px-[15px] text-[20px]"
                    id="Name"
                    type="Name"
                    name="Name"
                    required
                />

                <div className="mb-[15px] mt-[21px] text-left font-inter-medium text-[17px] text-[#151515]">
                    Email
                </div>
                <input
                    className="h-[57px] w-full rounded-[10px] border border-solid border-[#D9D9D9] px-[15px] text-[20px]"
                    id="Email"
                    type="Email"
                    name="Email"
                    required
                />
                <div className="mb-[15px] mt-[21px] text-left font-inter-medium text-[17px] text-[#151515]">
                    Your message
                </div>
                <textarea
                    className="h-[157px] w-full resize-none rounded-[10px] border border-solid border-[#D9D9D9] text-[20px]"
                    id="Message"
                    name="Message"
                    required
                />
                <div className="btn-group">
                    <button
                        className={cn([
                            'ml-auto flex !h-[32px] !w-[98px] !cursor-pointer items-center justify-center rounded-[8px] bg-black font-inter-semibold leading-[32px] text-white md:m-0 md:mt-[20px] md:!h-[48px] md:!w-[147px] md:leading-[48px]',
                            `btn-send ${form.submitting ? 'disabled' : ''}`,
                        ])}
                        type="submit"
                        disabled={form.submitting}
                    >
                        Send
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default ShikuLandsNftContactUsModal;

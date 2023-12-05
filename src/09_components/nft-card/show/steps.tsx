// import { useState } from 'react';
// import { Modal, StepProps, Steps } from 'antd';
// import { LoadingOutlined } from '@ant-design/icons';
// import { MarkAction } from '@/08_hooks/exchange/steps';

// function ActionStepsModal<T>({
//     title,
//     actions,
//     action,
//     success,
//     failed,
//     onClose,
// }: {
//     title: string;
//     actions: MarkAction<T>[];
//     action: T;
//     success: boolean;
//     failed: boolean;
//     onClose?: () => void;
// }) {
//     const [open, setOpen] = useState(true);
//     const onModalClose = () => {
//         setOpen(false);
//         onClose && onClose();
//     };

//     const current = actions.findIndex((a) => a.actions.includes(action));
//     const items: StepProps[] = actions.map((a, i) => ({
//         title: a.title,
//         description: a.description,
//         status:
//             success || i < current ? 'finish' : current < i ? 'wait' : failed ? 'error' : 'process',
//         icon: i === current && !failed ? <LoadingOutlined /> : undefined,
//     }));
//     console.debug('🚀 ~ file: steps.tsx:35 ~ const items:StepProps[]=actions.map ~ items:', items);

//     return (
//         <Modal open={open} footer={null} closeIcon={null} onCancel={onModalClose}>
//             {title && (
//                 <div className="mb-[20px] font-inter-bold text-[20px] text-black">{title}</div>
//             )}

//             <Steps direction="vertical" items={items} className="sell-steps !h-[100px] md:!h-fit" />

//             <div className="flex cursor-pointer justify-between md:mt-[20px]">
//                 <div
//                     onClick={onModalClose}
//                     className="h-[48px] w-[150px] flex-shrink-0 rounded-[8px] border border-solid border-black/60 bg-white text-center font-inter-bold text-[16px] leading-[48px] text-black"
//                 >
//                     Cancel
//                 </div>
//             </div>
//         </Modal>
//     );
// }

// export default ActionStepsModal;

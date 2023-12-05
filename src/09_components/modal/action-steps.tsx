import { Modal } from 'antd';
import { cn } from '@/02_common/cn';
import { TransactionRecord } from '@/07_stores/transaction';
import { MarkAction } from '@/08_hooks/exchange/steps';

type ActionStepsProps<T> = {
    title: string;
    actions: MarkAction<T>[];
    action: T;
    onClose?: () => void;
    record?: TransactionRecord; // !目前record存在则代表是可恢复的交易
};

export function ActionStepsModal<T>({ record, actions, action, onClose }: ActionStepsProps<T>) {
    const curStepIndex = actions.findIndex((i) => i.actions.find((o) => o === action));
    // !先写两份
    return record ? (
        <Modal
            open={record.status !== 'successful'}
            footer={null}
            closeIcon={null}
            centered={true}
            onCancel={onClose}
            maskClosable={true}
            width={600}
        >
            {
                <>
                    <div className="overflow-hidden">
                        {actions.map((item, index) => (
                            <div key={index} className="flex items-start justify-between">
                                <div className="flex flex-col items-center">
                                    {' '}
                                    <div
                                        className={cn(
                                            'h-[24px] w-[24px] rounded-full bg-[#D9D9D9] text-center font-inter-bold text-[12px] leading-[24px] text-white',
                                            curStepIndex > index && 'bg-yumi',
                                        )}
                                    >
                                        {index + 1}
                                    </div>
                                    <div
                                        className={cn(
                                            'h-[34px] w-[2px] bg-[#D9D9D9]',
                                            index === actions.length - 1 && 'hidden',
                                            curStepIndex > index && 'bg-yumi',
                                        )}
                                    ></div>
                                </div>
                                <div className="ml-[11px] mr-auto flex">
                                    {' '}
                                    <div className="flex h-[24px] w-[24px]">
                                        {curStepIndex == index ? (
                                            <img
                                                className="w-full"
                                                src="/img/market/infinity-loading.svg"
                                                alt=""
                                            />
                                        ) : (
                                            <div
                                                className={cn(
                                                    'm-auto  h-[6px] w-[6px] rounded-full bg-[#D9D9D9]',
                                                    curStepIndex > index && 'bg-black',
                                                )}
                                            ></div>
                                        )}
                                    </div>
                                    <span className="ml-[10px] font-inter-semibold text-[12px] leading-[24px] text-title">
                                        {item.title}
                                    </span>
                                </div>
                                {curStepIndex > index && (
                                    <img src="/img/recorder/success.svg" alt="" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div
                        className={cn(
                            '-mt-[20px] flex w-full justify-end gap-x-[10px] overflow-hidden text-center text-red-500',
                            record.message && 'mt-[10px]',
                        )}
                    >
                        <div
                            className={cn(
                                'mx-auto hidden items-center gap-x-[10px]',
                                record.message && 'flex justify-center',
                            )}
                        >
                            <img src="/img/profile/warning.svg" alt="" />
                            <div className="w-full overflow-hidden font-inter-medium text-[12px] md:whitespace-nowrap md:text-[14px]">
                                {record.message}_{record.id}
                            </div>
                        </div>
                        <img
                            className="bottom-[20px] right-[20px] h-[20px]  w-[20px] cursor-pointer"
                            src="/img/recorder/show.svg"
                            onClick={onClose}
                            alt=""
                        />
                    </div>
                </>
            }
        </Modal>
    ) : (
        <Modal
            open={true}
            zIndex={1000}
            footer={null}
            onCancel={onClose}
            closeIcon={null}
            width={600}
            centered={true}
        >
            <div className="overflow-hidden">
                {actions.map((item, index) => (
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col items-center">
                            {' '}
                            <div
                                className={cn(
                                    'h-[24px] w-[24px] rounded-full bg-[#D9D9D9] text-center font-inter-bold text-[12px] leading-[24px] text-white',
                                    curStepIndex > index && 'bg-yumi',
                                )}
                            >
                                {index + 1}
                            </div>
                            <div
                                className={cn(
                                    'h-[34px] w-[2px] bg-[#D9D9D9]',
                                    index === actions.length - 1 && 'hidden',
                                    curStepIndex > index && 'bg-yumi',
                                )}
                            ></div>
                        </div>
                        <div className="ml-[11px] mr-auto flex">
                            {' '}
                            <div className="flex h-[24px] w-[24px]">
                                {curStepIndex == index ? (
                                    <img
                                        className="w-full"
                                        src="/img/market/infinity-loading.svg"
                                        alt=""
                                    />
                                ) : (
                                    <div
                                        className={cn(
                                            'm-auto  h-[6px] w-[6px] rounded-full bg-[#D9D9D9]',
                                            curStepIndex > index && 'bg-black',
                                        )}
                                    ></div>
                                )}
                            </div>
                            <span className="ml-[10px] font-inter-semibold text-[12px] leading-[24px] text-title">
                                {item.title}
                            </span>
                        </div>
                        {curStepIndex > index && <img src="/img/recorder/success.svg" alt="" />}
                    </div>
                ))}
            </div>
        </Modal>
    );
}

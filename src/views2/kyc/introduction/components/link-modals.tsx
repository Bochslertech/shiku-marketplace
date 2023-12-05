import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popconfirm, Popover } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { X } from 'lucide-react';
import { shallow } from 'zustand/shallow';
import { cn } from '@/02_common/cn';
import { isPrincipalText } from '@/02_common/ic/principals';
import { AddLinkType, KycLinkType } from '@/04_apis/yumi/kyc';
import {
    acceptLink,
    createAccountLink,
    rejectLink,
    removeAccountLink,
} from '@/05_utils/apis/yumi/kyc';
import { useIdentityStore } from '@/07_stores/identity';
import message from '@/09_components/message';
import { Dialog, DialogContent, DialogHeader } from '@/09_components/ui/dialog';

type LinkList = {
    key: string;
    value: string;
    rules?: boolean;
    approveAt?: string | undefined | boolean;
    disabled?: boolean;
};

type FilterItemType = {
    _id: string;
    principal_id: string;
    disabled?: boolean;
    approveAt?: boolean | undefined | string;
};

//kyc添加link账号弹窗
export const LinkNewAccount = ({
    linkNewModal,
    setLinkNewModal,
    manage,
    userLink,
    setAddResultList,
    setResultModal,
}: {
    linkNewModal: boolean;
    setLinkNewModal: () => void;
    setResultModal: () => void;
    manage: boolean;
    userLink: undefined | KycLinkType;
    setAddResultList: (e: AddLinkType) => void;
}) => {
    const navigate = useNavigate();
    const [listList, setLinkList] = useState<LinkList[]>([{ key: '0', value: '' }]);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { principal, jwt_token } = useIdentityStore(
        (s) => ({
            principal: s.connectedIdentity?.principal,
            jwt_token: s.jwt_token,
        }),
        shallow,
    );

    useEffect(() => {
        if (manage && userLink) {
            const _newList: LinkList[] = userLink.kyc_links.map(
                (item: FilterItemType, index: number) => {
                    return {
                        key: index + '',
                        value: item.principal_id,
                        approveAt: item.approveAt || undefined,
                        disabled: true, //禁止修改
                    };
                },
            );
            const maxKey = Math.max(..._newList.map((obj) => Number(obj.key)));
            if (_newList.length < 5)
                _newList.push({ key: `${maxKey + 1}`, value: '', approveAt: false });
            setLinkList(_newList);
        }
    }, [manage, userLink]);

    //添加link账号
    const addLink = useCallback(() => {
        if (listList.length >= 5) return;
        const maxKey = Math.max(...listList.map((obj) => Number(obj.key)));
        let _newList = JSON.parse(JSON.stringify(listList));
        _newList = _newList.filter((item: LinkList, index: number, self: LinkList[]) => {
            const key = item.value;
            return key === '' || index === self.findIndex((t) => t.value === key);
        });
        _newList.push({ key: `${maxKey + 1}`, value: '', approveAt: false });
        setLinkList(_newList);
    }, [listList]);

    //删除link账号
    const removeLink = useCallback(
        (index: number) => {
            const _newList = JSON.parse(JSON.stringify(listList));
            _newList.splice(index, 1);
            setLinkList(_newList);
        },
        [listList],
    );

    const changeInput = (value: string, index: number) => {
        const _newList = JSON.parse(JSON.stringify(listList));
        _newList[index].value = value;
        setLinkList(_newList);
    };

    const onSubmit = useCallback(() => {
        setConfirmLoading(true);
        const _newList = JSON.parse(JSON.stringify(listList)).filter(
            (item: LinkList, index: number, self: LinkList[]) => {
                const key = item.value;
                return key === '' || index === self.findIndex((t) => t.value === key);
            },
        );
        _newList.map((item: LinkList) => {
            if (!isPrincipalText(item.value) && item.value !== '') item.rules = true;
            else item.rules = false;
            return item;
        });
        setLinkList(_newList);
        if (
            _newList.findIndex((item: LinkList) => item.value !== '' && item.rules === true) === -1
        ) {
            if (!principal || !jwt_token) {
                setConfirmLoading(false);
                return navigate('/connect');
            }
            const filterList = _newList
                .filter((item: LinkList) => item.value !== '' && item.value && !item.disabled)
                .map((item: LinkList) => item.value);
            if (filterList.length === 0) {
                setConfirmLoading(false);
                return setLinkNewModal();
            }
            createAccountLink({
                principal,
                children_principal_ids: filterList,
                jwt_token,
            }).then((res) => {
                message.success('Successfully added');
                setLinkNewModal();
                setAddResultList(res);
                setResultModal();
                setConfirmLoading(false);
            });
        } else {
            setConfirmLoading(false);
        }
    }, [listList, jwt_token]);
    const confirm = (remove_principal_id: string) => {
        if (!principal || !jwt_token) return navigate('/connect');
        removeAccountLink({ principal, remove_principal_id, jwt_token }).then((_) => {
            message.success('Unlinked');
        });
    };

    return (
        <Dialog modal={true} key={'kycLinkModal'} open={linkNewModal}>
            <DialogContent className="w-[95%] rounded-[8px] md:w-full md:rounded-[16px]">
                <DialogHeader className="flex h-0 flex-row items-center justify-between md:h-auto">
                    <div className=" font-inter-bold text-[16px] leading-[20px] md:text-[20px]">
                        {manage && 'Manage your accounts'}
                        {!manage && 'Link your new account'}
                    </div>
                    <X
                        className="cursor-pointer text-gray-300 hover:text-black"
                        onClick={setLinkNewModal}
                    />
                </DialogHeader>
                <div>
                    <div className=" font-inter-medium text-[12px] leading-[18px] text-[#666] md:text-[14px]">
                        You can link up to 5 of your accounts; you need to log in to your new
                        account to accept the requests.
                    </div>

                    {/* 添加pid 列表 */}
                    <div>
                        {listList.map((item, index) => {
                            return (
                                <>
                                    <div
                                        className="mt-[20px] flex"
                                        id={`kycLinkModal_${item.key}`}
                                        key={item.key}
                                    >
                                        <input
                                            disabled={item.disabled}
                                            type="text"
                                            placeholder="Principal ID"
                                            value={item.value}
                                            onChange={(e) => changeInput(e.target.value, index)}
                                            className=" mr-[19px] h-[42px] flex-1 rounded-[8px] border border-[#dcdcdc] pl-[17px] font-inter-medium text-[13px] text-[#333] placeholder:font-inter-medium placeholder:text-[14px] placeholder:text-[#dcdcdc]"
                                        />
                                        <div className="h-[42px] w-[42px] cursor-pointer rounded-[8px] border border-[#dcdcdc]">
                                            {(listList.length === 1 ||
                                                listList.length - 1 === index) &&
                                                listList.length !== 5 && (
                                                    <div
                                                        className="flex h-full w-full items-center justify-center"
                                                        onClick={addLink}
                                                    >
                                                        <PlusOutlined
                                                            style={{
                                                                fontSize: '24px',
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            {((listList.length - 1 !== index &&
                                                listList.length !== 1) ||
                                                listList.length === 5) && (
                                                <Popconfirm
                                                    overlayClassName="custom-pop-confirm"
                                                    title={'Delete the Principal ID'}
                                                    description={
                                                        manage && item.approveAt
                                                            ? "Are you certain about proceeding with the deletion? Once completed, this account's KYC level will revert to Tier 0."
                                                            : 'Would you like to proceed with the deletion? Your linked accounts will be revoked afterward.'
                                                    }
                                                    onConfirm={() => {
                                                        confirm(item.value);
                                                        removeLink(index);
                                                    }}
                                                    disabled={!item.disabled}
                                                    okText="Yes"
                                                    cancelText="No"
                                                    getPopupContainer={() =>
                                                        document.getElementById(
                                                            `kycLinkModal_${item.key}`,
                                                        ) as HTMLElement
                                                    }
                                                >
                                                    <div
                                                        className="flex h-full w-full items-center justify-center"
                                                        onClick={() => {
                                                            !item.disabled && removeLink(index);
                                                        }}
                                                    >
                                                        <MinusOutlined
                                                            style={{ fontSize: '24px' }}
                                                        />
                                                    </div>
                                                </Popconfirm>
                                            )}
                                        </div>
                                        {manage && item.approveAt && (
                                            <Popover
                                                content={'Accepted'}
                                                className="cursor-pointer"
                                                title={false}
                                            >
                                                <img
                                                    src="https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1694761303719_accepted.svg"
                                                    alt=""
                                                    className="ml-[15px]"
                                                />
                                            </Popover>
                                        )}
                                        {manage && item.approveAt === undefined && (
                                            <Popover
                                                content={'Awaiting accept'}
                                                className="cursor-pointer"
                                                title={false}
                                            >
                                                <img
                                                    className="ml-[15px]"
                                                    src="https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1694761303729_awaiting.svg"
                                                    alt=""
                                                />
                                            </Popover>
                                        )}
                                        {manage && item.approveAt === false && (
                                            <div className="ml-[15px] w-[18px]"></div>
                                        )}
                                    </div>
                                    {item.rules && (
                                        <div className=" text-[red]">
                                            Please enter the correct Principal ID
                                        </div>
                                    )}
                                </>
                            );
                        })}
                    </div>

                    <div className="mt-[40px] flex justify-between font-inter-bold text-[12px] md:text-[18px]">
                        <button
                            onClick={setLinkNewModal}
                            className="h-[36px] w-[95px] cursor-pointer rounded-[8px] border border-[#00000099] bg-white text-center leading-[36px] hover:bg-[#f0f0f0] md:h-[48px] md:w-[190px] md:leading-[48px]"
                        >
                            Cancel
                        </button>
                        <div
                            onClick={onSubmit}
                            className="h-[36px] w-[95px] cursor-pointer rounded-[8px] bg-[#000] text-center leading-[36px] text-[#fff] hover:bg-[#00000080] md:h-[48px] md:w-[190px] md:leading-[48px]"
                        >
                            {confirmLoading && <LoadingOutlined className="mr-3" />}
                            Confirm
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

//添加账号返回弹窗
export const ResultModal = ({
    resultModal,
    setResultModal,
    addResultList,
}: {
    resultModal: boolean;
    setResultModal: () => void;
    addResultList: AddLinkType | undefined;
}) => {
    const AccountIdPanel = React.memo(({ item }: { item: string }) => {
        return (
            <div className="mt-[20px] h-[42px] overflow-x-scroll rounded-[8px] border border-[#dcdcdc] pl-[10px] font-inter-medium text-[13px] leading-[42px]">
                {item}
            </div>
        );
    });

    return (
        <Dialog modal={true} key={'kycResultModal'} open={resultModal}>
            <DialogContent className="w-[95%] rounded-[8px] md:w-full md:rounded-[16px]">
                <DialogHeader className="flex h-0 flex-row items-center justify-between md:h-auto">
                    <div className="font-inter-bold text-[16px] leading-[20px] md:text-[20px]">
                        Account invitation successful!
                    </div>
                    <X
                        className="cursor-pointer text-gray-300 hover:text-black"
                        onClick={setResultModal}
                    />
                </DialogHeader>
                <div className=" font-inter-medium text-[12px] leading-[18px] text-[#666] md:text-[14px]">
                    Please log in to your linked account and accept the invitation; to complete the
                    account linking process.
                </div>
                <div className="font-inter-semibold">
                    {/* 添加成功 展示文案 */}
                    {addResultList && addResultList.succ_ids.length !== 0 && (
                        <div className=" text-[15px] md:text-[18px]">Success:</div>
                    )}

                    {/* 展示添加成功的列表 */}
                    {addResultList &&
                        addResultList.succ_ids.map((item: string) => {
                            return <AccountIdPanel item={item} />;
                        })}

                    {/* 如果有添加失败的 则展示 */}
                    {addResultList && addResultList.fail_ids.length !== 0 && (
                        <>
                            <div className=" mt-[17px] text-[15px] md:mt-[30px] md:text-[18px]">
                                Fail:
                            </div>
                            <div className="font-inter-medium text-[12px] leading-[18px] text-[#666] md:text-[14px]">
                                Your account has either been linked to another account, or your KYC
                                level is not at <span className="text-[#7A54FD]">Tier 0</span>.
                                Please verify.
                            </div>
                        </>
                    )}

                    {/* 添加失败展示失败列表 */}
                    {addResultList &&
                        addResultList.fail_ids.map((item: string) => {
                            return <AccountIdPanel item={item} />;
                        })}
                </div>
                <div
                    onClick={setResultModal}
                    className="mx-auto h-[36px] w-[95px] cursor-pointer rounded-[8px] bg-[#000] text-center font-inter-bold leading-[36px] text-[#fff] hover:bg-[#00000080] md:h-[48px] md:w-[190px] md:leading-[48px]"
                >
                    OK
                </div>
            </DialogContent>
        </Dialog>
    );
};

//处理link邀请弹窗

export const HandleLink = ({
    type,
    handleModal,
    setHandleModal,
    userLink,
}: {
    type: 'link' | 'unLink';
    handleModal: boolean;
    setHandleModal: () => void;
    userLink: KycLinkType;
}) => {
    const navigate = useNavigate();
    const { principal, jwt_token } = useIdentityStore(
        (s) => ({
            principal: s.connectedIdentity?.principal,
            jwt_token: s.jwt_token,
        }),
        shallow,
    );
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);
    const reloadKycResult = useIdentityStore((s) => s.reloadKycResult);

    //拒绝 解除 可用同一个接口
    const reject = () => {
        if (!principal || !jwt_token) return navigate('/connect');
        rejectLink({
            principal,
            approve_principal_id: userLink.request_kyc_link.main_principal_id,
            jwt_token,
        })
            .then((_) => {
                reloadKycResult();
                message.success('Rejected');
                setRejectLoading(false);
                setHandleModal();
                setAcceptLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setRejectLoading(false);
                setAcceptLoading(false);
            });
    };

    const rejectFunction = useCallback(() => {
        setRejectLoading(true);
        if (type === 'unLink') setHandleModal();
        else reject();
    }, [type]);
    const acceptFunction = useCallback(() => {
        setAcceptLoading(true);
        if (type === 'unLink') reject();
        else {
            if (!principal || !jwt_token) return navigate('/connect');
            acceptLink({
                principal,
                approve_principal_id: userLink.request_kyc_link.main_principal_id,
                jwt_token,
            })
                .then((_) => {
                    reloadKycResult();
                    message.success('Accepted');
                    setAcceptLoading(false);
                    setHandleModal();
                })
                .catch((err) => {
                    console.log(err, 'Err');
                    setAcceptLoading(false);
                });
        }
    }, [type, jwt_token]);
    return (
        <Dialog modal={true} key={'kycResultModal'} open={handleModal}>
            <DialogContent className="w-[95%] rounded-[8px] md:w-full md:rounded-[16px]">
                <DialogHeader className="flex h-0 flex-row items-center justify-between md:h-auto">
                    <div className="font-inter-bold text-[16px] leading-[20px] md:text-[20px]">
                        {type === 'link' && 'Account link request'}
                        {type === 'unLink' && 'Unlink account'}
                    </div>
                    <X
                        className="cursor-pointer text-gray-300 hover:text-black"
                        onClick={setHandleModal}
                    />
                </DialogHeader>

                <div>
                    {type === 'link' && (
                        <div className="font-inter-medium text-[12px] leading-[18px] text-[#666] md:text-[16px] md:leading-[26px]">
                            You have received an account linking request from{' '}
                            <span className="font-inter-semibold text-[#333]">
                                {userLink.request_kyc_link.main_principal_id}
                            </span>
                            . Please confirm that this account belongs to you.
                        </div>
                    )}
                    {type === 'unLink' && (
                        <div className="font-inter-medium text-[16px] leading-[26px] text-[#666]">
                            You are currently linked to the identifier
                            <span className="font-inter-semibold text-[#333]">
                                {userLink.request_kyc_link.main_principal_id}
                            </span>
                            . Unlinking this identifier will reset your KYC level to{' '}
                            <span className="font-inter-semibold text-[#7A54FD]">Tier 0</span>, so
                            please proceed with caution.
                        </div>
                    )}
                </div>
                <div className=" mt-[30px] flex justify-between font-inter-bold text-[12px] md:mt-[40px] md:text-[18px]">
                    <div
                        onClick={rejectFunction}
                        className={cn([
                            'flex h-[36px] w-[95px] cursor-pointer items-center justify-center rounded-[8px] border border-opacity-[0.6] md:h-[48px] md:w-[190px]',
                            rejectLoading && 'pointer-events-none',
                        ])}
                    >
                        {rejectLoading && <LoadingOutlined className="ml-3" />}
                        {type === 'link' ? 'Reject' : 'Cancel'}
                    </div>
                    <div
                        onClick={acceptFunction}
                        className={cn([
                            ' flex h-[36px] w-[95px] cursor-pointer items-center justify-center rounded-[8px] bg-[#000] text-[#fff] md:h-[48px] md:w-[190px]',
                            acceptLoading && 'pointer-events-none',
                        ])}
                    >
                        {acceptLoading && <LoadingOutlined className="ml-3" />}
                        {type === 'link' ? 'Accept' : 'Confirm'}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

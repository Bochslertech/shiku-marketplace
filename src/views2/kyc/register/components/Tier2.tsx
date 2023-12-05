import React, { useMemo, useState } from 'react';
import { Button, Input, message, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { shallow } from 'zustand/shallow';
import { KycFileType } from '@/04_apis/yumi/kyc';
import { kyc1UploadFiles } from '@/05_utils/apis/yumi/kyc';
import { useIdentityStore } from '@/07_stores/identity';

//转换图片size格式
const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const Tier2 = ({ setT2Flag }: { setT2Flag: () => void }) => {
    const { principal } = useIdentityStore(
        (s) => ({
            principal: s.connectedIdentity?.principal,
        }),
        shallow,
    );
    const [file1, setFile1] = useState<File | undefined>(undefined);
    const [file2, setFile2] = useState<File | undefined>(undefined);
    const [file3, setFile3] = useState<File | undefined>(undefined);
    const [type1, setType1] = useState<KycFileType | undefined>(undefined);
    const [type2, setType2] = useState<KycFileType | undefined>(undefined);
    const [tokenText, setTokenText] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const { Dragger } = Upload;
    const { TextArea } = Input;

    const selectOptions = useMemo(() => {
        if (page === 1) {
            return [
                {
                    label: 'Proof of residence',
                    value: 'Your proof of address should show the same address in your personal details.',
                    options: [
                        {
                            value: 'Bank statement',
                            label: 'Bank statement',
                        },
                        {
                            value: 'Income tax return form',
                            label: 'Income tax return form',
                        },
                        {
                            value: 'Residence ID or permit',
                            label: 'Residence ID or permit',
                        },
                        {
                            value: 'Notarized lease agreement',
                            label: 'Notarized lease agreement',
                        },
                        {
                            value: 'Electricity bill',
                            label: 'Electricity bill',
                        },
                        {
                            value: 'Other',
                            label: 'Other ',
                        },
                    ],
                },
                {
                    label: 'Proof of income',
                    value: 'Your proof of income should show where does the money come from.',
                    options: [
                        {
                            value: 'Income tax return form',
                            label: 'Income tax return form',
                        },
                        {
                            value: 'Salary sheet',
                            label: 'Salary sheet',
                        },
                        {
                            value: 'Bank statements',
                            label: 'Bank statements',
                        },
                        {
                            value: 'Pension distribution statement',
                            label: 'Pension distribution statement',
                        },
                        {
                            value: 'Other',
                            label: 'Other',
                        },
                    ],
                },
            ];
        } else {
            return [
                { token: '1' },
                { token: '2' },
                {
                    label: 'Explanation of ICP acquisition',
                    value: 'Please provide a declarative explanation of you got your ICP token ',
                    token: true,
                },
                {
                    value: 'Please upload document(s) that prove your declarative above',
                },
            ];
        }
    }, [page]);

    const formBtn = (page: number) => {
        if (page === 1) {
            setPage(2);
        } else {
            if (file1 && file2 && type1 && type2 && tokenText && principal) {
                setLoading(true);
                const args = {
                    principal: principal,
                    file1: { file: file1, type: type1 },
                    file2: { file: file2, type: type2 },
                    file3: file3 && { file: file3 },
                    explanation_icp: tokenText,
                };
                kyc1UploadFiles(args)
                    .then((res) => {
                        console.log(res, 'res');
                        setLoading(false);
                        setT2Flag();
                    })
                    .catch((err) => {
                        console.debug('🚀 ~ file: Tier2.tsx:130 ~ kyc1UploadFiles ~ err:', err);
                        setLoading(false);
                    });
            } else {
                message.error('Please fill in all the information');
            }
        }
    };

    //无文件上传时展示文案
    const UploadText = React.memo(() => {
        return (
            <>
                <div className=" mb-[15px] font-inter-semibold text-[15px] leading-[14px]">
                    Drag and drop
                </div>
                <div className="mb-[24px] font-inter-light text-[14px] leading-[14px]">
                    Accepted format: jpg, png, gif, tiff, bmp,.pdf{' '}
                    <div className="mt-[15px] text-left">Maximum: file size: 10MB</div>
                </div>
            </>
        );
    });

    //已上传文件展示
    const ShowFile = React.memo(({ file }: { file: File }) => {
        return (
            <div className="flex flex-col text-left leading-[14px]">
                <div className="mb-[22px] font-inter-semibold text-[16px]">{file.name}</div>
                <div className="mb-[28px] font-inter-light text-[14px]">
                    File size: {formatBytes(file.size)}
                </div>
            </div>
        );
    });

    return (
        <div>
            {selectOptions.map((item, index) => {
                return (
                    <div key={index} className="text-[14px] leading-[14px]">
                        {item.label && (
                            <div className=" mb-[12px] flex font-inter-semibold  ">
                                {item.label}
                                <div className=" ml-[2px] h-[13px] w-[13px] bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1689847903206_rules.svg')] bg-contain bg-center bg-no-repeat"></div>
                            </div>
                        )}
                        <div className=" mb-[17px] font-inter-light ">{item.value}</div>
                        {item.options && (
                            <Select
                                defaultValue="Document Type"
                                style={{
                                    width: '100%',
                                    height: 43,
                                }}
                                popupClassName="document-dor"
                                className="document"
                                getPopupContainer={() =>
                                    document.getElementById('kyc-register') as HTMLElement
                                }
                                onChange={(e) => {
                                    if (item.label === 'Proof of residence')
                                        setType1(e as KycFileType);
                                    else setType2(e as KycFileType);
                                }}
                                options={item.options}
                            />
                        )}
                        {!item.token && (
                            <Dragger
                                beforeUpload={(file) => {
                                    const isLt10M = file.size / 1024 / 1024 < 10;
                                    if (!isLt10M) {
                                        message.error(
                                            'The size of the uploaded file cannot exceed 10MB!',
                                        );
                                        return isLt10M;
                                    }
                                    if (item.label === 'Proof of residence') {
                                        setFile1(file);
                                    } else if (item.label === 'Proof of income') {
                                        setFile2(file);
                                    } else setFile3(file);
                                    return false;
                                }}
                                showUploadList={false}
                                multiple={false}
                                accept=".jpg,.png,.gif,.tiff,.bmp,.pdf"
                            >
                                <div className="flex h-[176px] w-full flex-col items-center justify-center rounded-[8px]">
                                    {/* 判断有无上传文件 并展示 */}
                                    {file1 !== undefined && index === 0 && (
                                        <ShowFile file={file1} />
                                    )}
                                    {file1 === undefined && index === 0 && <UploadText />}
                                    {file2 !== undefined && index === 1 && (
                                        <ShowFile file={file2} />
                                    )}
                                    {file2 === undefined && index === 1 && <UploadText />}

                                    {file3 !== undefined && index === 3 && (
                                        <ShowFile file={file3} />
                                    )}
                                    {file3 === undefined && index === 3 && <UploadText />}

                                    <Button
                                        icon={<UploadOutlined />}
                                        className=" flex items-center rounded-[8px] bg-[#000] font-inter-bold text-[16px] text-[#fff]"
                                    >
                                        {file1 !== undefined &&
                                            index === 0 &&
                                            'Change uploaded file'}
                                        {file1 === undefined && index === 0 && 'Upload file'}

                                        {file2 !== undefined &&
                                            index === 1 &&
                                            'Change uploaded file'}
                                        {file2 === undefined && index === 1 && 'Upload file'}

                                        {file3 !== undefined &&
                                            index === 3 &&
                                            'Change uploaded file'}
                                        {file3 === undefined && index === 3 && 'Upload file'}
                                    </Button>
                                </div>
                            </Dragger>
                        )}

                        {item.token && item.label && (
                            <TextArea
                                rows={4}
                                placeholder="(Max 2000 character)"
                                maxLength={2000}
                                value={tokenText}
                                onChange={(e) => {
                                    setTokenText(e.target.value);
                                }}
                            />
                        )}
                    </div>
                );
            })}

            <Button
                loading={loading}
                onClick={() => formBtn(page)}
                className="mt-[26px] flex h-[37px] w-[128px] items-center justify-center bg-[#000] font-inter-bold text-[16px] text-[#fff] "
            >
                {page === 1 ? 'Next' : 'Submit'}
            </Button>
        </div>
    );
};
export default Tier2;

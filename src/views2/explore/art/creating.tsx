import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Input, Modal, Radio, Select, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { CloseOutlined } from '@ant-design/icons';
import { shallow } from 'zustand/shallow';
import { CollectionLinks } from '@/01_types/yumi';
import { cdn } from '@/02_common/cdn';
import { Attribute, MintingNFT } from '@/03_canisters/yumi/yumi_artist_router';
import { queryMintingFee } from '@/05_utils/canisters/yumi/artist_router';
import { useArtistStore } from '@/07_stores/artist';
import { useUploadFileToICP } from '@/08_hooks/nft/upload';
import { useMintArtistNft } from '@/08_hooks/views/artist';
import TokenPrice from '@/09_components/data/price';
import message from '@/09_components/message';
import NftMedia from '@/09_components/nft/media';
import {
    IconDiscord,
    IconInstagram,
    IconMedium,
    IconSite,
    IconTelegram,
    IconTwitter,
} from './icon';
import './index.less';

type Properties = { trait_type: string; value: string };
const UploadButton = ({ loading }: { loading: boolean }) => (
    <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>{loading ? 'Uploading' : 'Upload'}</div>
    </div>
);
function CreateArtistModal({
    url,
    fee,
    name,
    open,
    originUrl,
    thumbUrl,
    values,
    setOpen,
    mimeTypeOrigin,
    propertiesList,
}: {
    url: string;
    fee: string;
    name: string;
    open: boolean;
    originUrl: string;
    thumbUrl: string;
    values: any;
    mimeTypeOrigin: string;
    propertiesList: Attribute[];
    setOpen: (open: boolean) => void;
}) {
    // 持久化当前输入的数据
    const { createNFTFormData, deleteCreateNFTFormData } = useArtistStore(
        (s) => ({
            createNFTFormData: s.createNFTFormData,
            deleteCreateNFTFormData: s.deleteCreateNFTFormData,
        }),
        shallow,
    );
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    // 使用mint方法
    const { mint } = useMintArtistNft();
    // 表单提交数据
    const onFinish = async (values: any) => {
        const res = { ...values };

        delete res.submit;
        // 防止重复点击
        if (submitLoading) {
            return;
        }
        setSubmitLoading(true);

        // 判断是否上传了图片
        if (
            !(
                (createNFTFormData.url !== '' && createNFTFormData.thumb !== '') ||
                (originUrl && thumbUrl)
            )
        ) {
            message.error('Please upload the picture');
            setSubmitLoading(false);
            return;
        }

        try {
            await mint({
                name: res.name,
                category: res.category,
                description: res.description,
                url: createNFTFormData.url || originUrl!,
                mimeType: createNFTFormData.mimeTypeOrigin || mimeTypeOrigin!,
                thumb: createNFTFormData.thumb || thumbUrl!,
                attributes: createNFTFormData.attributes || propertiesList,
                timestamp: Date.now(),
                linkList: [
                    { label: 'discord', value: res.discord },
                    { label: 'instagram', value: res.instagram },
                    { label: 'medium', value: res.medium },
                    { label: 'telegram', value: res.telegram },
                    { label: 'twitter', value: res.twitter },
                    { label: 'website', value: res.website },
                ],
            });
            message.success('Mint success');
            deleteCreateNFTFormData();
        } catch (error) {
            message.error(`Mint nft failed: ${error}`);
            console.debug(
                '🚀 ~ file: creating.tsx:123 ~ onFinish ~ `Mint nft failed: ${error}`:',
                `Mint nft failed: ${error}`,
            );
        } finally {
            setOpen(false);
            setSubmitLoading(false);
        }
    };
    return (
        <Modal
            open={open}
            footer={null}
            centered={true}
            onCancel={() => {
                setOpen(false);
            }}
            className="create-art-modal"
        >
            <div className="flex flex-col items-center justify-between gap-y-3">
                <div className="w-[200px]">
                    <NftMedia src={url} />
                </div>
                <div className="flex items-center">
                    <div className="font-inter-semibold">Mint need to pay:</div>
                    <TokenPrice
                        value={{
                            value: fee,
                            decimals: { type: 'exponent', value: 8 },
                            symbol: 'ICP',
                        }}
                    />
                </div>
                <div>{name}</div>
                <Button
                    className="flex h-[48px] w-[160px] items-center justify-center bg-[#000] text-[16px] font-bold text-[#fff] shadow-none hover:!bg-black"
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                        onFinish(values);
                    }}
                >
                    {'Pay'}
                    {submitLoading && <LoadingOutlined />}
                </Button>
            </div>
        </Modal>
    );
}
function ExploreArtCreating() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const { Option } = Select;

    const imageFileTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'video/mp4',
        'video/x-matroska',
        'model/gltf-binary',
        'model/gltf+json',
    ];
    const imageBeforeUpload = (file: RcFile) => {
        const isFileTypes = imageFileTypes.includes(file.type);
        if (!isFileTypes) {
            message.error('You can only upload JPG/PNG file!');
        }

        const isLt2M = file.size / 1024 / 1024 < 150;
        if (!isLt2M) {
            message.error('Image must smaller than 150MB!');
        }

        return isFileTypes && isLt2M;
    };

    const thumbnailFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    const thumbnailBeforeUpload = (file: RcFile) => {
        const isFileTypes = thumbnailFileTypes.includes(file.type);
        if (!isFileTypes) {
            message.error('You can only upload JPG/PNG file!');
        }

        const isLt2M = file.size / 1024 / 1024 < 150;
        if (!isLt2M) {
            message.error('Image must smaller than 150MB!');
        }

        return isFileTypes && isLt2M;
    };

    const [isAddPropertiesOpen, setIsAddPropertiesOpen] = useState(false);
    const [propertiesList, setPropertiesList] = useState<Properties[]>([]);

    const showAddPropertiesOpen = () => {
        setIsAddPropertiesOpen(true);
    };
    const handleOk = () => {
        const isValidArray = propertiesList.every(
            (item) => item.trait_type.trim() !== '' && item.value.trim() !== '',
        );

        if (isValidArray) {
            setIsAddPropertiesOpen(false);
        } else {
            message.error(t('explore.creating.propertiesError'));
            return;
        }
    };

    const handleCancel = () => {
        handleOk();
    };

    const propertiesChange = (mode: 'trait_type' | 'value', value: string, index: number) => {
        const updatedPropertiesList = propertiesList.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    [mode]: value,
                };
            }
            return item;
        });

        setPropertiesList(updatedPropertiesList);
    };

    const propertiesDel = (index: number) => {
        const updatedPropertiesList = [...propertiesList];
        updatedPropertiesList.splice(index, 1);
        setPropertiesList(updatedPropertiesList);
    };
    // 持久化当前输入的数据
    const { createNFTFormData, updateCreateNFTFormData } = useArtistStore(
        (s) => ({
            updateCreateNFTFormData: s.updateCreateNFTFormData,
            createNFTFormData: s.createNFTFormData,
            deleteCreateNFTFormData: s.deleteCreateNFTFormData,
        }),
        shallow,
    );

    // 手续费
    const [fee, setFee] = useState<string | undefined>();
    useEffect(() => {
        queryMintingFee()
            .then(setFee)
            .catch((e) => message.error(`art query mint fee failed: ${e} `));
    }, []);

    // 持久化当前输入的数据
    const onValuesChange = (values: any) => {
        // 排除url和thumb
        delete values.url;
        delete values.thumb;
        // 更新缓存
        updateCreateNFTFormData(values);
    };
    // Properties单独处理
    useEffect(() => {
        // 初始状态不更新
        propertiesList.length !== 0 && updateCreateNFTFormData({ attributes: propertiesList });
    }, [propertiesList]);

    const {
        uploadFile: uploadOriginFile,
        status: originFileLoading,
        mimeType: mimeTypeOrigin,
    } = useUploadFileToICP();
    const {
        uploadFile: uploadThumbFile,
        status: thumbFileLoading,
        mimeType: mimeTypeThumb,
    } = useUploadFileToICP();

    // 持久化mimeType
    useEffect(() => {
        updateCreateNFTFormData({ mimeTypeThumb, mimeTypeOrigin });
    }, [mimeTypeOrigin, mimeTypeThumb]);

    const [originUrl, setOriginUrl] = useState<string | undefined>();
    const [thumbUrl, setThumbUrl] = useState<string | undefined>();

    // 上传图片
    const customUploadOrigin: (file: RcFile) => Promise<void> = async (file) => {
        try {
            // 重置状态
            setOriginUrl(undefined);
            updateCreateNFTFormData({ url: '' });
            // 开始上传
            const url = await uploadOriginFile(file as File);
            setOriginUrl(url);
            updateCreateNFTFormData({ url });
        } catch (error) {
            message.error(`upload origin file failed: ${error}`);
        }
    };
    // 上传图片
    const customUploadThumb: (file: RcFile) => Promise<void> = async (file) => {
        try {
            // 重置状态
            setThumbUrl(undefined);
            updateCreateNFTFormData({ thumb: '' });
            // 开始上传
            const thumb = await uploadThumbFile(file as File);
            setThumbUrl(thumb);
            updateCreateNFTFormData({ thumb });
        } catch (error) {
            message.error(`upload thumb file failed: ${error}`);
        }
    };

    // 确认页面open
    const [open, setOpen] = useState<boolean>(false);
    const [values, setValues] = useState<any>();
    return (
        <div className="mx-auto flex w-full max-w-[900px] flex-col bg-white px-[20px] py-[20px] md:px-[30px] md:py-[40px]">
            <h2 className="mb-[30px] text-[30px] font-bold text-[#000]">Create New Item</h2>
            <Form
                form={form}
                layout="vertical"
                name="control-hooks"
                onFinish={(values: any) => {
                    setOpen(true);
                    setValues(values);
                }}
                onValuesChange={onValuesChange}
                initialValues={createNFTFormData}
            >
                <Form.Item<MintingNFT>
                    name="name"
                    label={t('explore.creating.formTitle1')}
                    rules={[{ required: true, message: t('explore.creating.formItemMessage1') }]}
                >
                    <Input
                        className="mt-[10px] md:mt-[20px]"
                        placeholder={t('explore.creating.formItemPlaceholder1')}
                    />
                </Form.Item>
                <Form.Item<MintingNFT>
                    name="category"
                    label={t('explore.creating.formTitle2')}
                    rules={[
                        {
                            required: true,
                            message: t('explore.creating.formItemMessage2'),
                        },
                    ]}
                >
                    <Radio.Group className="grid w-full grid-cols-2 pt-[20px] md:w-[60%] lg:w-[50%]">
                        <Radio className="mb-3" value="Art">
                            {t('explore.creating.formItem2Checkbox1')}
                        </Radio>
                        <Radio className="mb-3" value="3D/Animation">
                            {t('explore.creating.formItem2Checkbox2')}
                        </Radio>
                        <Radio className="mb-3" value="Collectibles">
                            {t('explore.creating.formItem2Checkbox3')}
                        </Radio>
                        <Radio className="mb-3" value="Sports">
                            {t('explore.creating.formItem2Checkbox4')}
                        </Radio>
                        <Radio className="mb-3" value="Music">
                            {t('explore.creating.formItem2Checkbox5')}
                        </Radio>
                        <Radio className="mb-3" value="Utility">
                            {t('explore.creating.formItem2Checkbox6')}
                        </Radio>
                        <Radio className="mb-3" value="Trading Cards">
                            {t('explore.creating.formItem2Checkbox7')}
                        </Radio>
                        <Radio className="mb-3" value="Virtual Worlds">
                            {t('explore.creating.formItem2Checkbox8')}
                        </Radio>
                        <Radio className="mb-3" value="Domain Names">
                            {t('explore.creating.formItem2Checkbox9')}
                        </Radio>
                        <Radio className="mb-3" value="Other">
                            {t('explore.creating.formItem2Checkbox10')}
                        </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item<MintingNFT>
                    name="url"
                    label={t('explore.creating.formTitle3')}
                    rules={[
                        {
                            required: true,
                            message: t('explore.creating.formItemMessage3'),
                        },
                    ]}
                >
                    <div>
                        <p className="mt-1 text-[12px] text-[#000]/50">
                            {t('explore.creating.formItemTip3')}
                        </p>

                        <Upload
                            directory={false}
                            accept={imageFileTypes.toString()}
                            maxCount={1}
                            showUploadList={false}
                            className="mt-[10px] md:mt-[20px]"
                            action={customUploadOrigin as any}
                            listType="picture-card"
                            beforeUpload={imageBeforeUpload}
                        >
                            {createNFTFormData.url || originUrl ? (
                                <img
                                    src={createNFTFormData.url || originUrl}
                                    className="w-full rounded-[8px]"
                                />
                            ) : (
                                <UploadButton loading={originFileLoading} />
                            )}
                        </Upload>
                    </div>
                </Form.Item>
                <Form.Item<MintingNFT>
                    name="thumb"
                    label={t('explore.creating.formTitle4')}
                    rules={[
                        {
                            required: true,
                            message: t('explore.creating.formItemMessage4'),
                        },
                    ]}
                >
                    <div>
                        <p className="mt-1 text-[12px] text-[#000]/50">
                            {t('explore.creating.formItemTip3')}
                        </p>
                        <Upload
                            directory={false}
                            accept={imageFileTypes.toString()}
                            maxCount={1}
                            showUploadList={false}
                            className="mt-[10px] md:mt-[20px]"
                            listType="picture-card"
                            action={customUploadThumb as any}
                            beforeUpload={thumbnailBeforeUpload}
                        >
                            {createNFTFormData.thumb || thumbUrl ? (
                                <img
                                    src={createNFTFormData.thumb || thumbUrl}
                                    className="w-full rounded-[8px]"
                                />
                            ) : (
                                <UploadButton loading={thumbFileLoading} />
                            )}
                        </Upload>
                    </div>
                </Form.Item>
                <Form.Item<MintingNFT> name="description" label={t('explore.creating.formTitle5')}>
                    <TextArea
                        showCount
                        maxLength={300}
                        className="mt-[10px] md:mt-[20px]"
                        placeholder={t('explore.creating.formItemPlaceholder5')}
                        autoSize={{ minRows: 6, maxRows: 10 }}
                    />
                </Form.Item>
                <div className="mt-[10px] md:mt-[20px]">
                    <h2 className="ant-form-item-label">{t('explore.creating.formTitle6')}</h2>
                    <p className="mt-1 text-[12px] text-[#000]/50">
                        {t('explore.creating.formItemTip6')}
                    </p>
                </div>
                <Form.Item<CollectionLinks> name="discord" className="mb-[10px] ">
                    <Input
                        addonBefore={<IconDiscord />}
                        className="mt-[10px] md:mt-[20px]"
                        placeholder={t('explore.creating.formItemPlaceholder6')}
                    />
                </Form.Item>
                <Form.Item<CollectionLinks> name="instagram" className="mb-[10px]">
                    <Input
                        addonBefore={<IconInstagram />}
                        placeholder={t('explore.creating.formItemPlaceholder6')}
                    />
                </Form.Item>
                <Form.Item<CollectionLinks> name="medium" className="mb-[10px]">
                    <Input
                        addonBefore={<IconMedium />}
                        placeholder={t('explore.creating.formItemPlaceholder6')}
                    />
                </Form.Item>
                <Form.Item<CollectionLinks> name="telegram" className="mb-[10px]">
                    <Input
                        addonBefore={<IconTelegram />}
                        placeholder={t('explore.creating.formItemPlaceholder6')}
                    />
                </Form.Item>
                <Form.Item<CollectionLinks> name="twitter" className="mb-[10px]">
                    <Input
                        addonBefore={<IconTwitter />}
                        placeholder={t('explore.creating.formItemPlaceholder6')}
                    />
                </Form.Item>
                <Form.Item<CollectionLinks> name="website">
                    <Input
                        addonBefore={<IconSite />}
                        placeholder={t('explore.creating.formItemPlaceholder6')}
                    />
                </Form.Item>
                <div className="mb-[40px] flex w-full flex-col">
                    <p className="text-[16px] text-[#000]">{t('explore.creating.submitTitle')}</p>
                    <p className="mt-[20px] text-[14px] text-[#000]/60">
                        {t('explore.creating.submitTip')}
                    </p>
                    <div className="mt-[20px] grid grid-cols-2 gap-x-[15px] gap-y-[15px] md:grid-cols-4">
                        {(createNFTFormData.attributes || propertiesList).map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col rounded-[4px] border border-[#7355ff] bg-[#7355ff]/20 px-[10px] py-[10px]"
                            >
                                <p className="truncate text-[14px] text-[#000]">
                                    {item.trait_type}
                                </p>
                                <p className="truncate text-[14px] text-[#000]/50">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    <p
                        onClick={showAddPropertiesOpen}
                        className="mt-[20px] flex h-[48px] w-[160px] cursor-pointer items-center justify-center bg-[#000] text-[16px] font-bold text-[#fff] shadow-none"
                    >
                        {t('explore.creating.submit')}
                    </p>
                </div>
                <Form.Item
                    name="blockchain"
                    label={t('explore.creating.blockchain')}
                    initialValue="Dfinity"
                >
                    <Select disabled className="mt-[10px] md:mt-[20px]" allowClear>
                        <Option value="Dfinity">
                            <div className="flex flex-row items-center">
                                <img
                                    className="mr-2 flex h-[20px] w-[20px]"
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon_icp.png',
                                    )}
                                    alt=""
                                />
                                <span>Dfinity</span>
                            </div>
                        </Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="submit"
                    className="mt-[20px] flex w-full items-center justify-center"
                >
                    <Button
                        className="flex h-[48px] w-[160px] items-center justify-center bg-[#000] text-[16px] font-bold text-[#fff] shadow-none hover:!bg-black"
                        type="primary"
                        htmlType="submit"
                    >
                        {t('explore.apply.create')}
                    </Button>
                </Form.Item>
            </Form>
            <Modal
                title={t('explore.creating.submit')}
                open={isAddPropertiesOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                centered={true}
            >
                <h2 className="mb-[20px] text-[14px] text-[#000]/60">
                    {t('explore.creating.propertiesTitle')}
                </h2>
                {propertiesList.map((item, index) => (
                    <div key={index} className="mb-[10px] flex w-full flex-shrink-0">
                        <div className="flex flex-1 flex-shrink-0">
                            <input
                                className="h-[32px] w-0 flex-1 rounded-[4px] border px-[10px] outline-none"
                                value={item.trait_type}
                                onChange={(e) =>
                                    propertiesChange('trait_type', e.target.value, index)
                                }
                                type="text"
                            />
                            <input
                                className="ml-[15px] h-[32px] w-0 flex-1 rounded-[4px] border pl-[10px] outline-none"
                                value={item.value}
                                onChange={(e) => propertiesChange('value', e.target.value, index)}
                                type="text"
                            />
                        </div>
                        <CloseOutlined
                            onClick={() => propertiesDel(index)}
                            className="ml-[10px] flex flex-shrink-0 cursor-pointer items-center md:ml-[20px]"
                        />
                    </div>
                ))}
                <div className="flex justify-between">
                    <div
                        onClick={() =>
                            setPropertiesList([...propertiesList, { trait_type: '', value: '' }])
                        }
                        className="mt-[20px] flex h-[30px] w-[100px] cursor-pointer items-center justify-center bg-[#000] text-[14px] text-[#fff] shadow-none md:text-[16px]"
                    >
                        {t('explore.creating.addMore')}
                    </div>
                    <div
                        onClick={handleOk}
                        className="mt-[20px] flex h-[30px] w-[100px] cursor-pointer items-center justify-center bg-[#000] text-[14px] text-[#fff] shadow-none md:text-[16px]"
                    >
                        {t('explore.creating.save')}
                    </div>
                </div>
            </Modal>

            <CreateArtistModal
                url={createNFTFormData.url || originUrl!}
                fee={fee!}
                name={createNFTFormData.name}
                open={open}
                setOpen={setOpen}
                values={values}
                originUrl={originUrl!}
                thumbUrl={thumbUrl!}
                mimeTypeOrigin={mimeTypeOrigin!}
                propertiesList={propertiesList}
            />
        </div>
    );
}

export default ExploreArtCreating;

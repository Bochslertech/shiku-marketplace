import { useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { message, Modal, Upload } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { ConnectedIdentity } from '@/01_types/identity';
import { cdn, cdn_by_assets } from '@/02_common/cdn';
import { uploadFileToBucket } from '@/05_utils/canisters/yumi/bucket';
import './index.less';

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

type CroppedImg = {
    blob: Blob;
    url: string;
};

interface NewBlob extends Blob {
    uid?: string;
}

// 头像上传显示
const AvatarCrop = ({
    avatar,
    identity,
    onFileChange,
}: {
    avatar: string;
    identity: ConnectedIdentity | undefined;
    onFileChange: (avatar) => void;
}) => {
    const ImageRef = useRef<HTMLImageElement | null>(null);
    const [uploading, setUploading] = useState(false);
    const [crop, setCrop] = useState<Crop>({} as Crop);
    const [cropModalVisible, setCropModalVisible] = useState(false);
    const [cropImg, setCropImg] = useState('');
    // croppedImg
    const [, setCroppedImg] = useState('');
    const [oriFile, setOriFile] = useState<RcFile>();

    const loadFile = (file: RcFile) => {
        setOriFile(file);
        setCropModalVisible(true);
        setCropImg(window.URL.createObjectURL(file));
        return false;
    };

    // 加载被裁切图片
    const cropAfterLoad = () => {
        if (ImageRef.current) {
            const scale = ImageRef.current.naturalHeight / ImageRef.current.naturalWidth;
            let width = ImageRef.current.width;
            let height = ImageRef.current.height;
            if (scale > 1) {
                height = height / scale;
            } else {
                width = width * scale;
            }
            setCrop({ unit: 'px', x: 0, y: 0, width, height });
        }
    };

    // 裁切图片
    const getCroppedImg = async () => {
        const canvas = document.createElement('canvas');
        const img = ImageRef.current;

        if (img) {
            const scaleX = img.naturalWidth / img.width;
            const scaleY = img.naturalHeight / img.height;
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            ctx.drawImage(
                img,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height,
            );
            const res = await new Promise((resolve) => {
                canvas.toBlob((blob: NewBlob | null) => {
                    if (!blob) {
                        console.error('Canvas is empty');
                        resolve({});
                    }

                    if (blob) {
                        blob.uid = oriFile?.uid;
                    }

                    console.debug('blob', blob);
                    // blob.uid = oriFile?.uid;

                    const url = blob && window.URL.createObjectURL(blob);

                    resolve({ url, blob } as CroppedImg);
                }, 'image/jpeg');
            });
            return res;
        }
    };

    // 完成点击
    const handleFinish = async () => {
        const croppedImgData = await getCroppedImg();
        const { url, blob } = croppedImgData as CroppedImg;
        if (!(url && blob)) {
            message.error('Invalid Image');
            return;
        }

        setCropModalVisible(false);
        setCroppedImg(url);

        // 上传
        onFinalChange(blob);
    };

    // 上传图片，回调发送avatar 给父组件设置 data 数据
    const onFinalChange = (e: any) => {
        uploadFile(e).then((avatar) => {
            console.log('avatar', avatar);
            // 设置data 给父组件
            onFileChange(avatar);
        });
    };

    // 上传裁切后的图片
    const uploadFile = async (file: File): Promise<string> => {
        setUploading(true);
        // const spend = Spend.start(`upload file`, true);
        try {
            const avatar = await uploadFileToBucket(identity!, { file, max_size: 150 });
            // spend.mark(`got avatar: ${avatar}`);
            return avatar;
        } finally {
            // spend.mark('over');
            setUploading(false);
        }
    };

    return (
        <>
            <Upload
                accept={imageFileTypes.toString()}
                name="avatar"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={loadFile}
                iconRender={() => <></>}
                className="uploadAvatar"
                style={{ border: 'none' }}
                // rootClassName="border-none"
            >
                {avatar && (
                    <div>
                        <img
                            src={cdn(avatar)}
                            alt=""
                            className="h-[45px] w-[45px] flex-shrink-0 rounded-[8px] border-4 border-solid border-black md:h-[102px] md:w-[102px] md:rounded-[20px]"
                        />

                        {!uploading && (
                            //
                            <div className="absolute left-0 top-0 hidden h-full w-[45px] flex-shrink-0 cursor-pointer rounded-[8px] bg-black/50 group-hover:block md:w-[103px] md:rounded-[20px]">
                                <img
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691050121618_upload.svg',
                                    )}
                                    alt=""
                                    className="pointer-events-auto ml-[16px] mt-[16px] h-[12px] w-[12px] flex-shrink-0 cursor-pointer rounded-[20px] md:ml-[35px] md:mt-[35px] md:h-[31px] md:w-[31px]"
                                />
                            </div>
                        )}
                        {uploading && (
                            <img
                                className="absolute left-0 top-0"
                                src={cdn_by_assets('/images/common/loading.gif')}
                                alt="loading image"
                            />
                        )}
                    </div>
                )}
                {!avatar && <></>}
            </Upload>
            <Modal
                maskClosable={false}
                open={cropModalVisible}
                // onOk={handleFinish}
                onCancel={() => setCropModalVisible(false)}
                closable={false}
                className="crop-modal"
                width={600}
                footer={null}
            >
                <div>
                    <div className="mx-auto flex w-full justify-center">
                        <ReactCrop
                            aspect={1}
                            crop={crop}
                            circularCrop={true}
                            onChange={(c) => setCrop(c)}
                            className="max-h-[200px] max-w-[287px] sm:max-w-[287px] md:max-w-[287px]"
                        >
                            <img
                                className="max-h-[200px] max-w-[287px] sm:max-w-[287px] md:max-w-[287px]"
                                ref={ImageRef}
                                src={cropImg}
                                onLoad={cropAfterLoad}
                            />
                        </ReactCrop>
                    </div>

                    <div className="mx-auto mt-[20px] flex w-[320px] cursor-pointer justify-between">
                        <div
                            onClick={() => setCropModalVisible(false)}
                            className="h-[48px] w-[150px] flex-shrink-0 rounded-[8px] border border-solid border-black/60 bg-white text-center font-inter-bold text-[16px] leading-[48px] text-black"
                        >
                            Cancel
                        </div>
                        <div
                            onClick={handleFinish}
                            className="h-[48px] w-[150px] flex-shrink-0 rounded-[8px] bg-black text-center font-inter-bold text-[16px] leading-[48px] text-white"
                        >
                            OK
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AvatarCrop;

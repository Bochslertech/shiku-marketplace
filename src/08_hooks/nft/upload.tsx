import { useCallback, useState } from 'react';
import { message } from 'antd';
import { Spend } from '@/02_common/react/spend';
import { uploadFileToBucket } from '@/05_utils/canisters/yumi/bucket';
import { MimeType } from '@/07_stores/artist';
import { useCheckIdentity } from '../common/identity';

// 上传 file 到链上
export const useUploadFileToICP = (): {
    uploadFile: (file: File) => Promise<string>;
    status: boolean;
    mimeType?: string;
} => {
    const checkIdentity = useCheckIdentity();

    const [uploading, setUploading] = useState(false);
    const [mimeType, setMimeType] = useState<MimeType>();

    const uploadFile = useCallback(
        async (file: File): Promise<string> => {
            const identity = checkIdentity();

            setUploading(true);
            let mimeType: MimeType | undefined = undefined;
            if (file.type.slice(0, 5) === 'video') {
                mimeType = 'video';
            } else if (file.type.slice(0, 5) === 'image') {
                mimeType = 'image';
            } else if (file.name.slice(-4) === '.glb' || file.name.slice(-5) === '.gltf') {
                mimeType = '3dmodel';
            } else {
                message.error('Invalid image');
            }
            setMimeType(mimeType);
            const spend = Spend.start(`upload file`, true);
            try {
                const avatar = await uploadFileToBucket(identity, { file, max_size: 150 });
                return avatar;
            } finally {
                spend.mark('over');
                setUploading(false);
            }
        },
        [checkIdentity],
    );

    return {
        uploadFile,
        status: uploading,
        mimeType,
    };
};

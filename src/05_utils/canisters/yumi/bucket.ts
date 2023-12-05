import _ from 'lodash';
import { nanoid } from 'nanoid';
import pLimit from 'p-limit';
import * as bucket from '@/03_canisters/yumi/yumi_bucket';
import { ConnectedIdentity } from '@/01_types/identity';
import { Spend } from '@/02_common/react/spend';
import { queryBucketId } from './application';

// ===================== 上传文件 =====================

export const uploadFileToBucket = async (
    identity: ConnectedIdentity,
    args: {
        file: File;
        max_size: number; // MB
    },
): Promise<string> => {
    const { file, max_size } = args;
    if (file.size / 1024 / 1024 > max_size) {
        throw new Error(`File is to too large. The max size of support file is ${max_size}MB`);
    }
    const spend = Spend.start(`uploadFileToBucket: ${file.name}`);
    // 1. 获取文件 id
    const chunk_size = 1024 * 1024 * 1.8; // 最大支持 1.8 MB
    const data = await file.arrayBuffer();
    spend.mark(`got data: ${data.byteLength}`);
    const chunks = _.chunk(Array.prototype.slice.call(new Uint8Array(data)), chunk_size);
    const backend_canister_id = await queryBucketId();
    spend.mark(`got bucket id: ${backend_canister_id}`);
    const file_id = await bucket.createBucketFile(identity, backend_canister_id, {
        name: nanoid(), // ? 随机个新名字
        mime_type: file.type,
        file_size: file.size,
        chunk_size: chunks.length,
    });
    spend.mark(`got file id: ${file_id}`);
    if (file_id === undefined) {
        throw new Error(`Upload file failed: create file failed`);
    }

    spend.mark(`start batch upload: ${chunks.length}`);
    // 2. 分批上传
    const limit = pLimit(20); // 最大 20 个上传并发
    await Promise.all(
        chunks.map((chunk, index) =>
            limit(async () => {
                await bucket.putFileChunk(identity, backend_canister_id, {
                    file_id,
                    index: index + 1, // 序号需要加 1
                    chunk,
                });
                spend.mark(`upload chunk ${index + 1}: ${file_id}`);
            }),
        ),
    );

    spend.mark(`upload over: ${file_id}`);
    // 3. 返回 url;
    return `https://${backend_canister_id}.raw.icp0.io/?index=${file_id}`;
};

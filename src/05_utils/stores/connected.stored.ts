import { ConnectedRecord } from '@/01_types/identity';
import { CombinedStore } from '../stored';

// =============== connect record 数据缓存 ===============
// ! 状态工具会异步加载,不能体现出异步读取,因此,独立处理吧
const connected_record_store = new CombinedStore<ConnectedRecord[]>(
    1000 * 3600 * 24 * 365 * 100, // * 100年时间,就是不删除
    false, // 不需要随机
    {
        key_name: `__yumi_collected_record_keys__`,
        indexed_key: () => `__yumi_collected_record__`,
    },
);
export const connectedRecordsStored = {
    getItem: (): Promise<ConnectedRecord[]> =>
        new Promise((resolve) => {
            connected_record_store
                .getItem('')
                .then((d) => resolve(d ?? []))
                .catch(() => resolve([]));
        }),
    setItem: (records: ConnectedRecord[]): Promise<void> =>
        connected_record_store.setItem('', records),
};

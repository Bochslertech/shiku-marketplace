import { ConnectedRecord, ConnectType } from '@/01_types/identity';

// 查找最近的登录方式
export const getLatestConnectType = (records: ConnectedRecord[]): ConnectType | undefined => {
    if (records.length === 0) return undefined;
    if (records.length === 1) return records[0].connectType;
    const latestRecord = records.reduce((p, c) => (p.timestamp <= c.timestamp ? c : p));
    return latestRecord?.connectType;
};

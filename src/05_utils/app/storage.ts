import { ConnectType } from '@/01_types/identity';

// 读取存储的值
export const readStorage = (key: string): string | undefined => {
    const r = localStorage.getItem(key);
    if (r == null) return undefined;
    return r;
};

// 写入值
export const writeStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
};

// ================= 后端类型的常量值 =================

export const BACKEND_TYPE = '__yumi_backend__';

// ================= 上次登录的类型 =================

const LAST_CONNECT_TYPE = '__yumi_last_connect_type__';
export const readLastConnectType = () => readStorage(LAST_CONNECT_TYPE) ?? '';
export const writeLastConnectType = (connectType: ConnectType | '') =>
    writeStorage(LAST_CONNECT_TYPE, connectType);

// ================= 记录是否提示过 KYC =================
const YUMI_KYC_PROMPTED = '__yumi_kyc_prompted__';
export const readKycPrompted = (principal: string): boolean => {
    const value = readStorage(YUMI_KYC_PROMPTED);
    if (!value) return false;
    return JSON.parse(value)[principal];
};
export const writeKycPrompted = (principal: string, prompted: boolean): void => {
    const value = readStorage(YUMI_KYC_PROMPTED);
    if (!value) {
        if (prompted) writeStorage(YUMI_KYC_PROMPTED, JSON.stringify({ [principal]: true }));
        return;
    }
    const json = JSON.parse(value);
    if (prompted) json[principal] = true;
    else delete json[principal];
    return writeStorage(YUMI_KYC_PROMPTED, JSON.stringify(json));
};

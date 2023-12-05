import { Principal } from '@dfinity/principal';

// 判断字符串是不是 Principal
export const isPrincipalText = (text: string | undefined): boolean => {
    if (!text) return false;
    try {
        Principal.fromText(text);
        return true;
    } catch (e) {
        return false;
    }
};

// 判断字符串是不是 Canister Id
export const isCanisterIdText = (text: string | undefined): boolean => {
    if (!text) return false;
    if (text.length !== 27) return false;
    return isPrincipalText(text);
};

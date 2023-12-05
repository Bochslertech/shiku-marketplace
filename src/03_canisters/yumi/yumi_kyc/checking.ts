import { canister_module_hash_and_time } from '@/02_common/ic/status';

// 检查每一个罐子的 module 有没有改变,如果变化了就要通知
export const checkYumiKycCanisterModule = async () => {
    for (const canister_id of [
        'ucs6g-wiaaa-aaaah-abwpa-cai',
        'ucs6g-wiaaa-aaaah-abwpa-cai', // 预发布和正式的一样
        'uftys-3qaaa-aaaah-abwpq-cai',
    ]) {
        const r = await canister_module_hash_and_time(canister_id, import.meta.env.CONNECT_HOST);
        console.error('yumi kyc canister module is changed', canister_id, r.module_hash);
    }
};

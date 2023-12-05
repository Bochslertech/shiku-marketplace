import * as alchemy from '@/04_apis/yumi/alchemy';
import { getYumiAlchemyHost } from './special';

// ================================= 查询 icp 的 价格 =================================

export const queryIcpPriceInUsd = async (): Promise<string> => {
    const backend_host = getYumiAlchemyHost();
    return alchemy.queryIcpPriceInUsd(backend_host);
};

// ================================= 查询 alchemy icp 的 rampFee =================================

export const estimateIcpAmount = async (usd_amount: number): Promise<number> => {
    const backend_host = getYumiAlchemyHost();
    return alchemy.estimateIcpAmount(backend_host, usd_amount);
};

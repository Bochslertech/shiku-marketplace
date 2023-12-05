import * as jwt from '@/03_canisters/yumi/yumi_jwt_token';
import { ConnectedIdentity } from '@/01_types/identity';
import { getYumiJwtTokenCanisterId } from './special';

// ===================== 生成新的 jwtToken =====================

export const generateJwtToken = async (identity: ConnectedIdentity): Promise<string> => {
    const backend_canister_id = getYumiJwtTokenCanisterId();
    return jwt.generateJwtToken(identity, backend_canister_id);
};

// ===================== 查询 jwtToken =====================

export const queryJwtToken = async (identity: ConnectedIdentity): Promise<string> => {
    const backend_canister_id = getYumiJwtTokenCanisterId();
    return jwt.queryJwtToken(identity, backend_canister_id);
};

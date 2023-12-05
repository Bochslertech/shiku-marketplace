import * as user_record from '@/03_canisters/yumi/yumi_user_record';
import { UserActivity } from '@/03_canisters/yumi/yumi_user_record';
import { anonymous } from '../../connect/anonymous';
import { getYumiUserRecordCanisterId } from './special';

export const queryAllUserActivityList = async (account: string): Promise<UserActivity[]> => {
    const backend_canister_id = getYumiUserRecordCanisterId();
    return user_record.queryAllUserActivityList(anonymous, backend_canister_id, account);
};

import * as application from '@/03_canisters/yumi/yumi_application';
import { ConnectedIdentity } from '@/01_types/identity';
import { AppAnnouncement, Apply2ArtistFormData } from '@/03_canisters/yumi/yumi_application';
import { anonymous } from '../../connect/anonymous';
import { getYumiApplicationCanisterId } from './special';

// ===================== 查询当前存储罐 =====================

export const queryBucketId = async (): Promise<string> => {
    const backend_canister_id = getYumiApplicationCanisterId();
    return application.queryBucketId(anonymous, backend_canister_id);
};

// ===================== 提交申请成为 Artist 的表单 =====================

export const apply2Artist = async (
    identity: ConnectedIdentity,
    args: Apply2ArtistFormData,
): Promise<boolean> => {
    const backend_canister_id = getYumiApplicationCanisterId();
    return application.apply2Artist(identity, backend_canister_id, args);
};

// ===================== 查询公告 =====================

export const queryAnnouncementList = async (): Promise<AppAnnouncement[]> => {
    const backend_canister_id = getYumiApplicationCanisterId();
    return application.queryAnnouncementList(anonymous, backend_canister_id);
};

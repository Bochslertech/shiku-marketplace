import { ConnectedIdentity } from '@/01_types/identity';
import { string2array } from '@/02_common/data/arrays';
import { bigint2string } from '@/02_common/types/bigint';
import { principal2string } from '@/02_common/types/principal';
import idlFactory from './application.did';
import _SERVICE from './application.did.d';

// ===================== 查询当前存储罐 =====================

export const queryBucketId = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getBucket();
    return principal2string(r);
};

// ===================== 提交申请成为 Artist 的表单 =====================

export type Apply2ArtistFormData = {
    contact: string; // 1 // to contact artist
    name: string; // 2123
    representing: string; // 3 // company or single
    interested: string; // 4 // the areas artist want to publish/collaborate with Yumi
    platform?: string; // 5 // artist have published
    other?: string; // 6 // other info
};

// 真正的key
const BORING_KEYS: Record<keyof Apply2ArtistFormData, string> = {
    contact: "1. What's the best way to contact you? *",
    name: "2. What's your name? *",
    representing: '3. Who are you representing? *',
    interested:
        '4. What area are you interested to publish/collaborate with Yumi? (You can select multiple) *',
    platform: '5. Have you published on other marketplace? If so please provide the link.',
    other: '6. Anything else you want to share with us?',
};

export const apply2Artist = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: Apply2ArtistFormData,
): Promise<boolean> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const data: Record<string, string> = {};
    Object.keys(BORING_KEYS).forEach((key) => {
        data[key] = args[key];
        data[BORING_KEYS[key]] = args[key];
    });
    return actor.apply(string2array(JSON.stringify(data)));
};

// ===================== 查询公告 =====================

export type AppAnnouncement = {
    id: string; // ? bigint -> string
    title: string;
    content: string;
    operator: string; // ? principal -> string
    createTime: string; // ? bigint -> string
    endTime: string; // ? bigint -> string
    releaseTime: string; // ? bigint -> string
};

export const queryAnnouncementList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<AppAnnouncement[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getAnnouncements();
    return r.map((d) => ({
        id: bigint2string(d.id),
        title: d.title,
        content: d.content,
        operator: principal2string(d.operator),
        createTime: bigint2string(d.createTime),
        endTime: bigint2string(d.endTime),
        releaseTime: bigint2string(d.releaseTime),
    }));
};

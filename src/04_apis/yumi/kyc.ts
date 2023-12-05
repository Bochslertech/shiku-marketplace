import { SupportedBackend } from '@/01_types/app';
import { KycResult } from '@/01_types/yumi';

// ================================= KYC =================================

export const queryKycResultByPrincipal = async (
    backend_host: string,
    principal: string,
): Promise<KycResult> => {
    const r = await fetch(`${backend_host}/getUserKycInfo?principal=${principal}`);
    const json = await r.json();
    // console.warn(`🚀 ~ file: kyc.ts:13 ~ queryKycResultByPrincipal ~ json:`, json);
    if (json.code === 200 && json.msg === 'Success') {
        return {
            principal: json.data.principal_id,
            level: json.data.kyc_level,
            status: json.data.kyc_process_status === 'pending' ? 'pending' : undefined,
            quota: json.data.kyc_level_quota,
            used: Number(json.data.kyc_trade_amount),
        };
    } else {
        console.debug(
            '🚀 ~ file: kyc.ts:33 ~ queryKycResultByPrincipal ~ queryKycResultByPrincipal:',
        );
        throw new Error(`wrong data`);
    }
};

// ================================= KYC 本地的jwt token是否正确 =================================

export const verifyJwtTokenState = async (
    backend_host: string,
    jwt_token: string,
): Promise<boolean> => {
    const r = await fetch(`${backend_host}/userAccountLinkApprove`, {
        method: 'POST',
        headers: [
            ['Content-Type', 'application/json'],
            ['authorization', `Bearer ${jwt_token}`],
        ],
    });
    const json = await r.json();
    if (json.code !== 410) {
        return true;
    }
    return false;
};

// ================================= KYC 0 申请 =================================

export type KycWorkFlowRunResult = {
    applicant_id: string;
    workflow_run_id: string;
    workflow_id: string;
    generateSdkToken: string;
};

export const kyc0CreateWorkFlowRun = async (
    backend_host: string,
    backendType: SupportedBackend,
    principal: string,
): Promise<KycWorkFlowRunResult> => {
    const r = await fetch(`${backend_host}/createWorkFlowRun`, {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify({
            principal_id: principal,
            env: ['production', 'staging'].includes(backendType) ? 'prod' : 'dev',
        }),
    });
    const json = await r.json();
    if (json.code === 200 && json.msg === 'Success') {
        return json.data;
    } else {
        console.debug('🚀 ~ file: kyc.ts:65 ~ kyc0CreateWorkFlowRun:');
        throw new Error(`can not CreateWorkFlowRun`);
    }
};

// ================================= KYC 1 上传文件 =================================

export type KycFileType =
    | 'Bank statement'
    | 'Income tax return form'
    | 'Residence ID or permit'
    | 'Notarized lease agreement'
    | 'Electricity bill'
    | 'Other'
    | 'Salary sheet'
    | 'Pension distribution statement';
export type KycFileItem = { file: File; type: KycFileType };

export const kyc1UploadFiles = async (
    backend_host: string,
    args: {
        principal: string;
        file1: KycFileItem;
        file2: KycFileItem;
        file3?: { file: File };
        explanation_icp: string; // ICP 来源说明
    },
): Promise<string> => {
    // 参数
    const formData = new FormData();
    formData.append('principal', args.principal);
    formData.append('files', args.file1.file);
    formData.append('files', args.file2.file);
    if (args.file3) {
        formData.append('files', args.file3.file);
        formData.append('doc_names', args.file3.file.name);
    }
    formData.append('doc_names', args.file1.file.name);
    formData.append('doc_names', args.file2.file.name);
    formData.append('doc_types', args.file1.type);
    formData.append('doc_types', args.file2.type);
    formData.append('explanation_icp', args.explanation_icp);

    const r = await fetch(`${backend_host}/uploadKycDocument`, {
        method: 'POST',
        body: formData,
    });
    const json = await r.json();
    if (json.code === 200) {
        return json;
    } else {
        console.debug('🚀 ~ file: kyc.ts:106 ~kyc1UploadFiles json:', json);
        throw new Error(json.msg);
    }
};

// ================================= KYC 2 邮件通知 =================================

export const kyc2EmailContactUs = async (
    backend_host: string,
    principal: string,
): Promise<string> => {
    const r = await fetch(`${backend_host}/emailContactUs`, {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify({ principal_id: principal }),
    });
    const json = await r.json();
    if (json.code === 200 && json.msg === 'Success') {
        return json.msg;
    } else {
        console.debug('🚀 ~ file: kyc.ts:125 ~ kyc2EmailContactUs ~ json:', json.msg);
        throw new Error(json.msg);
    }
};

export type KycLinkType = {
    kyc_links: { _id: string; principal_id: string; approveAt: string }[] | [];
    request_kyc_link: {
        principal_id: string;
        main_principal_id: string;
        approveAt: string;
        createAt: string;
    };
};

// ================================= 用户link列表 =================================

export const queryKycLinkList = async (
    backend_host: string,
    principal: string,
): Promise<KycLinkType> => {
    const r = await fetch(`${backend_host}/userAccountLinkList?principal_id=${principal}`);
    const json = await r.json();
    if (json.code === 200 && json.msg === 'success') {
        return json.data;
    } else {
        console.debug('🚀 ~ file: kyc.ts:154 ~ queryKycLinkList ~ success:', json);
        throw new Error(json.success);
    }
};

export type AddLinkType = {
    main: string;
    fail_ids: string[];
    succ_ids: string[];
};

// ================================= 用户创建account link =================================

export const createAccountLink = async (
    backend_host: string,
    {
        jwt_token,
        principal,
        children_principal_ids,
    }: { jwt_token: string; principal: string; children_principal_ids: string[] },
): Promise<AddLinkType> => {
    if (jwt_token === undefined) throw new Error('🚀 ~ file: kyc.ts:185 ~ jwt_token:');
    const r = await fetch(`${backend_host}/userAccountLinkRequest`, {
        method: 'POST',
        headers: [
            ['Content-Type', 'application/json'],
            ['authorization', `Bearer ${jwt_token}`],
        ],
        body: JSON.stringify({
            principal_id: principal,
            children_principal_ids,
        }),
    });
    const json = await r.json();
    if (json.code === 200 && json.msg === 'success') {
        return json.data;
    } else {
        console.debug('🚀 ~ file: kyc.ts:189 ~ createAccountLink ~ msg:', json.msg);
        throw new Error(json.success);
    }
};

// ================================= 主账户移除 accountLink =================================

export const removeAccountLink = async (
    backend_host: string,
    {
        jwt_token,
        principal,
        remove_principal_id,
    }: { jwt_token: string; principal: string; remove_principal_id: string },
): Promise<AddLinkType> => {
    if (jwt_token === undefined) throw new Error('🚀 ~ file: kyc.ts:212 ~ jwt_token:');

    const r = await fetch(`${backend_host}/userAccountLinkRemove`, {
        method: 'POST',
        headers: [
            ['Content-Type', 'application/json'],
            ['authorization', `Bearer ${jwt_token}`],
        ],
        body: JSON.stringify({
            principal_id: principal,
            remove_principal_id,
        }),
    });
    const json = await r.json();
    if (json.code === 200 && json.msg === 'success') {
        return json.data;
    } else {
        console.debug('🚀 ~ file: kyc.ts:231 ~ removeAccountLink:', json.msg);
        throw new Error(json.success);
    }
};

type ControlsLinkType = {
    main: string;
    children: string;
};
//
// ================================= 子账户拒绝Link =================================

export const rejectLink = async (
    backend_host: string,
    {
        jwt_token,
        principal,
        approve_principal_id,
    }: { jwt_token: string; principal: string; approve_principal_id: string },
): Promise<ControlsLinkType> => {
    if (jwt_token === undefined) throw new Error('🚀 ~ file: kyc.ts:236 ~ rejectLink ~ jwt_token:');
    const r = await fetch(`${backend_host}/userAccountLinkReject`, {
        method: 'POST',
        headers: [
            ['Content-Type', 'application/json'],
            ['authorization', `Bearer ${jwt_token}`],
        ],
        body: JSON.stringify({
            principal_id: principal,
            approve_principal_id,
        }),
    });
    const json = await r.json();
    console.log(json, 'rejected');
    if (json.code === 200 && json.msg === 'success') {
        return json.data;
    } else {
        console.debug('🚀 ~ file: kyc.ts:254 ~ rejectLink ~ rejectLink:', json.msg);
        throw new Error(json.success);
    }
};

// ================================= 子账户接受Link =================================

export const acceptLink = async (
    backend_host: string,
    {
        jwt_token,
        principal,
        approve_principal_id,
    }: { jwt_token: string; principal: string; approve_principal_id: string },
): Promise<ControlsLinkType> => {
    if (jwt_token === undefined) throw new Error('🚀 ~ file: kyc.ts:262 ~ acceptLink ~ jwt_token:');
    const r = await fetch(`${backend_host}/userAccountLinkApprove`, {
        method: 'POST',
        headers: [
            ['Content-Type', 'application/json'],
            ['authorization', `Bearer ${jwt_token}`],
        ],
        body: JSON.stringify({
            principal_id: principal,
            approve_principal_id,
        }),
    });
    const json = await r.json();
    if (json.code === 200 && json.msg === 'success') {
        return json.data;
    } else {
        console.debug('🚀 ~ file: kyc.ts:254 ~ rejectLink ~ rejectLink:', json.msg);
        throw new Error(json.success);
    }
};

import * as kyc from '@/04_apis/yumi/kyc';
import { KycResult } from '@/01_types/yumi';
import { AddLinkType, KycFileItem, KycLinkType, KycWorkFlowRunResult } from '@/04_apis/yumi/kyc';
import { getBackendType } from '../../app/backend';
import { getYumiKycHost } from './special';

// ================================= KYC =================================

export const queryKycResultByPrincipal = async (principal: string): Promise<KycResult> => {
    const backend_host = getYumiKycHost();
    return kyc.queryKycResultByPrincipal(backend_host, principal);
};

// ================================= KYC 本地的jwt token是否正确 =================================

export const verifyJwtTokenState = async (jwt_token: string): Promise<boolean> => {
    const backend_host = getYumiKycHost();
    return kyc.verifyJwtTokenState(backend_host, jwt_token);
};

// ================================= KYC 0 申请 =================================

export const kyc0CreateWorkFlowRun = async (principal: string): Promise<KycWorkFlowRunResult> => {
    const backend_host = getYumiKycHost();
    return kyc.kyc0CreateWorkFlowRun(backend_host, getBackendType(), principal);
};

// ================================= KYC 1 上传文件 =================================

export const kyc1UploadFiles = async (args: {
    principal: string;
    file1: KycFileItem;
    file2: KycFileItem;
    file3?: { file: File };
    explanation_icp: string; // ICP 来源说明
}): Promise<string> => {
    const backend_host = getYumiKycHost();
    return kyc.kyc1UploadFiles(backend_host, args);
};

// ================================= KYC 2 邮件通知 =================================

export const kyc2EmailContactUs = async (principal: string): Promise<string> => {
    const backend_host = getYumiKycHost();
    return kyc.kyc2EmailContactUs(backend_host, principal);
};

// ================================= 用户link列表 =================================

export const queryKycLinkList = async (principal: string): Promise<KycLinkType> => {
    const backend_host = getYumiKycHost();
    return kyc.queryKycLinkList(backend_host, principal);
};

// ================================= 用户创建account link =================================

export const createAccountLink = async (args: {
    jwt_token: string;
    principal: string;
    children_principal_ids: string[];
}): Promise<AddLinkType> => {
    const backend_host = getYumiKycHost();
    return kyc.createAccountLink(backend_host, args);
};

// ================================= 主账户移除accountLink =================================

export const removeAccountLink = async (args: {
    jwt_token: string;
    principal: string;
    remove_principal_id: string;
}): Promise<AddLinkType> => {
    const backend_host = getYumiKycHost();
    return kyc.removeAccountLink(backend_host, args);
};

// ================================= 子账户拒绝Link =================================

export const rejectLink = async (args: {
    jwt_token: string;
    principal: string;
    approve_principal_id: string;
}) => {
    const backend_host = getYumiKycHost();
    return kyc.rejectLink(backend_host, args);
};

// ================================= 子账户接受Link =================================
export const acceptLink = async (args: {
    jwt_token: string;
    principal: string;
    approve_principal_id: string;
}) => {
    const backend_host = getYumiKycHost();
    return kyc.acceptLink(backend_host, args);
};

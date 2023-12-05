import { findSpecialHosts, SpecialHosts } from '@/04_apis/yumi/special';
import { getBackendType } from '../../app/backend';
import { getBuildMode } from '../../app/env';

const findHosts = (): SpecialHosts => findSpecialHosts(getBuildMode(), getBackendType());

export const getYumiApiHost = (): string => findHosts().yumi_api;
export const getYumiApi2Host = (): string => findHosts().yumi_api2;
export const getYumiKycHost = (): string => findHosts().yumi_kyc;
export const getYumiAwsHost = (): string => findHosts().yumi_aws;
export const getYumiAlchemyHost = (): string => findHosts().yumi_alchemy_host;

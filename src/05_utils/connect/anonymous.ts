import { ConnectedIdentity } from '@/01_types/identity';
import { createAnonymousIdentity } from '@/02_common/connect/creator';
import { getConnectHost } from '../app/env';

// 全局共享的匿名身份
export const anonymous: ConnectedIdentity = createAnonymousIdentity(getConnectHost(), false);

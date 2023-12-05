import { AllLaunchpadCollections } from '@/03_canisters/yumi/yumi_launchpad';
import { canisterQueryYumiLaunchpadCollectionsWithStatus } from '@/04_apis/canister-query/yumi/launchpad';
import { queryAllLaunchpadCollectionsWithStatus } from '../../canisters/yumi/launchpad';
import { getYumiLaunchpadCanisterId } from '../../canisters/yumi/special';

// 综合 canister-query 和 罐子的接口
export const combinedQueryLaunchpadCollectionsWithStatus =
    async (): Promise<AllLaunchpadCollections> =>
        new Promise((resolve, reject) => {
            const backend_canister_id = getYumiLaunchpadCanisterId();
            canisterQueryYumiLaunchpadCollectionsWithStatus(backend_canister_id)
                .then((d) => {
                    if (d) return d;
                    return queryAllLaunchpadCollectionsWithStatus();
                })
                .then(resolve)
                .catch(reject);
        });

import { AllLaunchpadCollections } from '@/03_canisters/yumi/yumi_launchpad';
import { CANISTER_QUERY_HOST } from '../host';
import { canister_query } from '../query';

export const canisterQueryYumiLaunchpadCollectionsWithStatus = async (
    backend_canister_id: string,
): Promise<AllLaunchpadCollections | undefined> =>
    canister_query(
        `${CANISTER_QUERY_HOST}/yumi/launchpad/${backend_canister_id}/collections/status`,
    );

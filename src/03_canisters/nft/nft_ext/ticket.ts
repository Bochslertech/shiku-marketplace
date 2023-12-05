import { ConnectedIdentity } from '@/01_types/identity';
import { NftIdentifier } from '@/01_types/nft';
import { NftTicketStatus } from '@/01_types/yumi-standard/ticket';
import * as ticket from './ext_ticket';

// ===================== 查询门票数据 =====================

export const queryNftTicketStatus = async (
    identity: ConnectedIdentity,
    collection: string,
    token_id: NftIdentifier,
): Promise<NftTicketStatus> => {
    return ticket.queryNftTicketStatus(identity, collection, token_id);
};

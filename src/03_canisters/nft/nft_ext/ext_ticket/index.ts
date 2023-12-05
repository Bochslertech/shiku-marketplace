import { ConnectedIdentity } from '@/01_types/identity';
import { NftIdentifier } from '@/01_types/nft';
import { NftTicketStatus } from '@/01_types/yumi-standard/ticket';
import { bigint2string } from '@/02_common/types/bigint';
import { unchanging, unwrapVariant5 } from '@/02_common/types/variant';
import idlFactory from './ext_ticket.did';
import _SERVICE, { NFTOwnable } from './ext_ticket.did.d';

// ===================== 查询门票数据 =====================

export const queryNftTicketStatus = async (
    identity: ConnectedIdentity,
    collection: string,
    token_id: NftIdentifier,
): Promise<NftTicketStatus> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.nft_ticket(token_id.token_identifier);
    return unwrapVariant5<
        bigint,
        string,
        null,
        null,
        bigint,
        string,
        [bigint, NFTOwnable],
        [string, NFTOwnable],
        [bigint, NFTOwnable],
        [string, NFTOwnable]
    >(
        r,
        ['NoBody', bigint2string],
        ['InvalidToken', unchanging],
        ['Forbidden', bigint2string],
        ['Owner', (s) => [bigint2string(s[0]), s[1]]],
        ['Anonymous', (s) => [bigint2string(s[0]), s[1]]],
    ) as NftTicketStatus;
};

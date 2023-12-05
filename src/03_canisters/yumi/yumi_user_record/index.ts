import { ConnectedIdentity } from '@/01_types/identity';
import { NftIdentifier } from '@/01_types/nft';
import { bigint2string } from '@/02_common/types/bigint';
import { unwrapOption, unwrapOptionMap } from '@/02_common/types/options';
import { principal2string } from '@/02_common/types/principal';
import { unwrapVariantKey } from '@/02_common/types/variant';
import idlFactory from './user_record.did';
import _SERVICE from './user_record.did.d';

// =========================== 查询用户活动记录 ===========================
type Time = string; // ? bigint -> string
type AccountIdentifier = string;
type TokenIdentifier = string;
type RecordEventType =
    | 'auctionDeal'
    | 'dutchAuction'
    | 'offer'
    | 'list'
    | 'claim'
    | 'mint'
    | 'sold'
    | 'acceptOffer'
    | 'point'
    | 'auction'
    | 'transfer';
export type UserActivity = {
    token_id: NftIdentifier;

    index: string; // ? bigint -> string
    date: Time;
    eventType: RecordEventType;

    collection: string; // ? principal -> string
    token_identifier: TokenIdentifier;

    from?: string; // ? principal -> string
    fromAid?: AccountIdentifier;
    to?: string; // ? principal -> string
    toAid?: AccountIdentifier; // account hex
    memo: string; // ? bigint -> string
    tokenSymbol?: string;
    price?: string; // ? bigint -> string
};

export const queryAllUserActivityList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    account: string,
): Promise<UserActivity[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getUserEvents(account);
    const mapped: UserActivity[] | undefined = unwrapOptionMap(r, (events) =>
        events.map((event) => ({
            token_id: {
                collection: principal2string(event.collection),
                token_identifier: event.item,
            },
            index: bigint2string(event.index),
            date: bigint2string(event.date),
            eventType: unwrapVariantKey(event.eventType),
            collection: principal2string(event.collection),
            token_identifier: event.item,
            from: unwrapOptionMap(event.from, principal2string),
            fromAid: unwrapOption(event.fromAid),
            to: unwrapOptionMap(event.to, principal2string),
            toAid: unwrapOption(event.toAid),
            memo: bigint2string(event.memo),
            tokenSymbol: unwrapOption(event.tokenSymbol),
            price: unwrapOptionMap(event.price, bigint2string),
        })),
    );
    return mapped ?? [];
};

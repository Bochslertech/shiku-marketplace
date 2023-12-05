import { ConnectedIdentity } from '@/01_types/identity';
import { bigint2string, string2bigint } from '@/02_common/types/bigint';
import { unwrapOptionMap } from '@/02_common/types/options';
import { principal2string } from '@/02_common/types/principal';
import { unwrapMotokoResultMap } from '@/02_common/types/results';
import { throwsBy, unchanging, unwrapVariantKey } from '@/02_common/types/variant';
import idlFactory from './origyn_art_proposal.did';
import _SERVICE, {
    List as CandidList,
    List_1 as CandidList_1,
    Proposal as CandidProposal,
    ProposalOption as CandidProposalOption,
} from './origyn_art_proposal.did.d';

// =========================== 查询下个提案 id ===========================

export const queryNextProposalId = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.get_next_proposal_id();
    return bigint2string(r);
};

// =========================== 查询指定提案的详细信息 ===========================

export type ProposalStatus =
    | 'open' // 可以投票 // 注意还有时间范围
    | 'rejected' // 提案被拒绝
    | 'accepted' // 提案已接受
    | 'executing' // 投票接受后是否要执行命令, 正在执行中
    | 'failed' // 执行失败
    | 'succeeded'; // 执行成功

export type ProposalNFT = {
    collection: string; // ? bigint -> string // canister_id
    standard: 'ogy';
};
export interface ProposalPayload {
    canister_id: string; // ? principal -> string
    method: string;
    args: Array<number>; // 方法的执行参数 // ? message
}
export type Proposal = {
    id: string; // ? bigint -> string

    proposer: string; // ? principal -> string
    title: string;
    introduction: Array<number>; // 详细信息 // details
    options: string[]; // ? bigint -> string
    vote_nft: ProposalNFT;
    start_timestamp: string; // ? bigint -> string
    end_timestamp: string; // ? bigint -> string
    vote_rate: string; // 一个 NFT 对应几票// ? bigint -> string

    status: ProposalStatus; // state
    payload?: ProposalPayload;
};

export interface ProposalOption {
    proposal_id: string; // ? bigint -> string
    id: string; // ? bigint -> string
    content: string;
    votes: string; // ? bigint -> string
    voters: string[]; // principal -> string
}

export type ProposalInfo = {
    proposal: Proposal;
    options: ProposalOption[];
};

const unwrapProposal = (p: CandidProposal): Proposal => {
    return {
        id: bigint2string(p.id),

        proposer: principal2string(p.proposer),
        title: p.title,
        introduction: p.details, // details
        options: p.options.map(bigint2string),
        vote_nft: {
            collection: principal2string(p.vote_nft.canister_id),
            standard: unwrapVariantKey(p.vote_nft.standard),
        },
        start_timestamp: bigint2string(p.start_timestamp),
        end_timestamp: bigint2string(p.end_timestamp),
        vote_rate: bigint2string(p.vote_rate),

        status: unwrapVariantKey(p.state) as ProposalStatus, // state
        payload: unwrapOptionMap(p.payload, (d) => ({
            canister_id: principal2string(d.canister_id),
            method: d.method,
            args: d.message, //message
        })),
    };
};

const unwrapProposalOption = (o: CandidProposalOption): ProposalOption => {
    return {
        proposal_id: bigint2string(o.proposal_id),
        id: bigint2string(o.id),
        content: o.content,
        votes: bigint2string(o.votes),
        voters: (() => {
            const voters: string[] = [];
            const readList = (list: CandidList_1) => {
                if (list.length === 0) return;
                const [r, next] = list[0];
                voters.push(principal2string(r));
                readList(next);
            };
            readList(o.voters);
            return voters;
        })(),
    };
};

export const queryProposalInfo = async (
    identity: ConnectedIdentity,
    collection: string,
    proposal_id: string,
): Promise<ProposalInfo | undefined> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.get_opt_proposal_detail(string2bigint(proposal_id));
    return unwrapOptionMap(r, (d) => ({
        proposal: unwrapProposal(d.proposal),
        options: d.options.map(unwrapProposalOption),
    }));
};

// =========================== 查询指定提案的快照 ===========================

export type ProposalSnapshotAccount = {
    owner: string; // ? principal -> string
    amount: string; // ? bigint -> string
};

export type ProposalSnapshot = {
    proposal_id: string; // ? bigint -> string
    snapshot_at: string; // ? bigint -> string
    accounts: ProposalSnapshotAccount[];
};

export const queryProposalSnapshot = async (
    identity: ConnectedIdentity,
    collection: string,
    proposal_id: string,
): Promise<ProposalSnapshot | undefined> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.get_snapshot(string2bigint(proposal_id));
    return unwrapOptionMap(r, (d) => ({
        proposal_id: bigint2string(d.proposal_id),
        snapshot_at: bigint2string(d.snapshot_at),
        accounts: d.accounts.map((a) => ({
            owner: principal2string(a.owner),
            amount: bigint2string(a.amount),
        })),
    }));
};

// =========================== 查询指定提案的投票记录 ===========================

export type ProposalVoteRecord = {
    proposal_id: string; // ? bigint -> string
    option_id: string; // ? bigint -> string
    vote_at: string; // ? bigint -> string
    voter: string; // ? principal -> string
    count: string; // ? bigint -> string
};

export const queryProposalVoteRecords = async (
    identity: ConnectedIdentity,
    collection: string,
    proposal_id: string,
): Promise<ProposalVoteRecord[] | undefined> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.get_vote_logger(string2bigint(proposal_id));
    return unwrapOptionMap(r, (d) => {
        const records: ProposalVoteRecord[] = [];
        const readList = (list: CandidList) => {
            if (list.length === 0) return;
            const [r, next] = list[0];
            records.push({
                proposal_id: bigint2string(r.proposal_id),
                option_id: bigint2string(r.option_id),
                vote_at: bigint2string(r.vote_at),
                voter: principal2string(r.voter),
                count: bigint2string(r.count),
            });
            readList(next);
        };
        readList(d);
        return records;
    });
};

// =========================== 进行投票 ===========================

export const voteProposal = async (
    identity: ConnectedIdentity,
    collection: string,
    args: {
        proposal_id: string; // ? bigint -> string
        option_id: string; // ? bigint -> string
        vote: 'yes' | 'no';
    },
): Promise<ProposalStatus> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.vote({
        proposal_id: string2bigint(args.proposal_id),
        proposal_opt_id: string2bigint(args.option_id),
        vote: (() => {
            switch (args.vote) {
                case 'yes':
                    return { yes: null };
                case 'no':
                    return { no: null };
            }
            throw new Error(`wrong vote:${args.vote}. must be yes or no`);
        })(),
    });
    return unwrapMotokoResultMap(
        r,
        (ok) => unwrapVariantKey(ok) as ProposalStatus,
        throwsBy<string>(unchanging),
    );
};

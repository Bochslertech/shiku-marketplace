import { ConnectedIdentity } from '../identity';
import { NftTokenOwner } from '../nft';

// 下架状态
export type HoldingAction =
    // ! Yumi 的取消操作
    | undefined // 未开始
    | 'DOING' // 开始
    | 'CANCELLING' // 1. 某些标准 NFT 需要额外做操作
    | 'HOLDING' // 2. Yumi 的记录需要取消
    // ! OGY 的取消操作
    | undefined // 未开始
    | 'DOING' // 开始
    | 'CANCELLING' // 1. 某些标准 NFT 需要额外做操作
    | 'CANCELLING_OGY'; // 1. OGY 这种带独立交易系统的进行下架即可

// 下架 NFT 接口
export type HoldingNftExecutor = (
    identity: ConnectedIdentity,
    owner: NftTokenOwner, // 需要的数据比较多
) => Promise<boolean>;

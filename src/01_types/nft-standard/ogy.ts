// OGY 标准的 Owner 原始数据
export type NftTokenOwnerMetadataOgy = {
    token_id: string; // collection_nft_origyn 结果的 token_ids
    account:
        | {
              account_id: string;
          }
        | { principal: string } // ? principal -> string
        | { extensible_json: string } // ? CandyShared -> json (bigint -> string)
        | {
              account: {
                  owner: string; // ? principal -> string
                  sub_account?: number[];
              };
          }; // bearer_batch_nft_origyn
};

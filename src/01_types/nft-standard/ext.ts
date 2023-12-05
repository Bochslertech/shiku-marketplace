// EXT 标准的 Owner 原始数据
export type NftTokenOwnerMetadataExt = {
    index: number;
    owner: string;
    proxy?: string; // ? account_hex yumi 的代持罐子的地址 // 是否代持, yumi 会替代用户持有
};

// EXT 的用户类型
export type ExtUser =
    | { principal: string; address?: undefined } // ? principal -> string
    | { principal?: undefined; address: string };

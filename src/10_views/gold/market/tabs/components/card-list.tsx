import { Link } from 'react-router-dom';
import { Checkbox, Tooltip } from 'antd';
import { NftMetadata } from '@/01_types/nft';
import { ShoppingCartItem } from '@/01_types/yumi';
import { cdn } from '@/02_common/cdn';
import { sinceNowByByNano } from '@/02_common/data/dates';
import { shrinkText } from '@/02_common/data/text';
import { uniqueKey } from '@/02_common/nft/identifier';
import { isSameNftByTokenId } from '@/02_common/nft/identifier';
import { useIdentityStore } from '@/07_stores/identity';
import { useShoppingCart } from '@/08_hooks/nft/cart';
import { useIsGoldByPath } from '@/08_hooks/views/gold';
import message from '@/09_components/message';
import style from './index.module.less';

// 取出黄金 NFT 的所有者
const getNftOwner = (item: NftMetadata): string => {
    const account = item.owner.raw.data.account;
    return account.principal;
};

function CardList({ list }: { list: NftMetadata[] }) {
    const isGold = useIsGoldByPath();
    const shoppingCartItems = useIdentityStore((s) => s.shoppingCartItems);
    const goldShoppingCartItems = useIdentityStore((s) => s.goldShoppingCartItems);
    const items: ShoppingCartItem[] = isGold ? goldShoppingCartItems : shoppingCartItems ?? [];
    const { add, remove, action } = useShoppingCart();
    // 变更购物车
    const onChange = async (card: NftMetadata) => {
        if (action !== undefined) return; // 注意防止重复点击
        const item = items.find((i) => isSameNftByTokenId(i, card.metadata));
        const added = !!item;
        if (added) remove(card.metadata.token_id).then(() => message.successRemoveCart());
        else add(card).then(() => message.successAddCart());
    };
    return (
        <div className={`${style['gold-card-list']} w-full overflow-auto`}>
            <table className=" w-full min-w-[1200px]">
                <thead className=" border-b-[1px] border-solid border-b-[#eee] text-left">
                    <th className=" py-[10px] text-[#999]">
                        <img
                            className="w-[22px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/launchpad/1679368795234_cart.png',
                            )}
                            alt=""
                        />
                    </th>
                    <th className=" py-[10px] text-[#999]">Items</th>
                    <th className=" py-[10px] text-[#999]">Price</th>
                    <th className=" py-[10px] text-[#999]">Price USD</th>
                    <th className=" py-[10px] text-[#999]">Owner</th>
                    <th className=" py-[10px] text-[#999]">Time Listed</th>
                </thead>
                <tbody className="text-[14px]">
                    {list.map((item) => {
                        return (
                            <tr
                                key={uniqueKey(item.owner.token_id)}
                                className=" border-b-[1px] border-solid border-b-[#eee]  text-left font-semibold  text-[#343434]"
                            >
                                <td className="py-[10px]">
                                    <Checkbox
                                        disabled={
                                            item.listing && item.listing.listing.type !== 'listing'
                                        }
                                        onChange={(_) => {
                                            onChange(item);
                                        }}
                                    />
                                </td>
                                <td className="py-[10px]">
                                    <Link
                                        to={`/gold/nft/${item.metadata.token_id.collection}/${item.metadata.token_id.token_identifier}`}
                                        className=" flex cursor-pointer items-center whitespace-nowrap"
                                    >
                                        <img
                                            className="h-[50px] w-[50px] object-contain"
                                            src={cdn(item.metadata.metadata.thumb)}
                                            alt=""
                                        />
                                        <span>{item.metadata.metadata.name}</span>
                                    </Link>
                                </td>
                                <td className="py-[10px]">
                                    {item.listing && item.listing.listing.type === 'listing'
                                        ? (Number(item.listing.listing.price) / 1e8).toFixed(2)
                                        : '--'}
                                    <span className="ml-[5px] text-[12px]">
                                        {item.listing && item.listing.listing.type === 'listing'
                                            ? item.listing.listing.token.symbol
                                            : 'ICP'}
                                    </span>
                                </td>
                                <td>
                                    {item.listing && item.listing.listing.type === 'listing'
                                        ? (() => {
                                              if (item.listing.listing.raw.type !== 'ogy')
                                                  return undefined;
                                              const raw = JSON.parse(item.listing.listing.raw.raw);
                                              return raw.usd_price.toFixed(2);
                                          })()
                                        : '--'}
                                    <span className="ml-[5px] text-[12px]">USD</span>
                                </td>
                                <td className="py-[10px]">
                                    <Link
                                        to={`/profile?principal=${item.owner}`}
                                        className=" w-[100px] overflow-hidden overflow-ellipsis whitespace-nowrap font-normal text-stress"
                                    >
                                        <Tooltip placement="topLeft" title={getNftOwner(item)}>
                                            {shrinkText(getNftOwner(item), 5, 4)}
                                        </Tooltip>
                                    </Link>
                                </td>
                                <td className="py-[10px] font-normal text-stress">
                                    {item.listing &&
                                    item.listing.listing.type === 'listing' &&
                                    item.listing.listing.raw.type == 'ogy' &&
                                    item.listing.listing.raw.sale_id !== ''
                                        ? sinceNowByByNano(item.listing.listing.time)
                                        : ''}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default CardList;

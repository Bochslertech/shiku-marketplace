import { useState } from 'react';
import { message, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { SellNftExecutor } from '@/01_types/exchange/single-sell';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftMetadata, TokenInfo } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { exponentNumber } from '@/02_common/data/numbers';
import { alreadyMessaged } from '@/02_common/data/promise';
import { justPreventLink } from '@/02_common/react/link';
import { bigint2string } from '@/02_common/types/bigint';
import { NFT_OGY_ART } from '@/03_canisters/nft/special';
import { getLedgerIcpDecimals, getLedgerTokenIcp } from '@/05_utils/canisters/ledgers/special';
import { getServiceFee } from '@/05_utils/nft/fee';
import {
    getCollectionNameByNftMetadata,
    getNameByNftMetadata,
    getThumbnailByNftMetadata,
} from '@/05_utils/nft/metadata';
import { useIdentityStore } from '@/07_stores/identity';
import { checkSellPrice } from '@/08_hooks/exchange/single/sell';
import { useYumiPlatformFee } from '@/08_hooks/interval/platform_fee';
import TokenPrice from '../../../data/price';
import Usd from '../../../data/usd';
import { IconLogoLedgerIcp } from '../../../icons';
import NftMedia from '../../../nft/media';
import { Button } from '../../../ui/button';
import CloseIcon from '../../../ui/close-icon';
import { Input } from '../../../ui/input';
import BalanceRefresh from '../../../user/balance/balance-refresh';
import './index.less';

export const isValidPrice = (value: string) => {
    // 使用正则表达式检查输入是否为数字或小数
    const isNumber = /^\d+(\.\d{0,2})?$/.test(value);
    // 最小输入为0.01
    return isNumber && Number(value) >= 0.01;
};
// 目前 只有黄金 支持选择代币
// 黄金的弹窗不会走这里，黄金有独立的弹窗
function SellModal({
    identity,
    card,
    lastPrice,
    sell,
    executing,
    refreshListing,
    onClose,
}: {
    identity: ConnectedIdentity;
    card: NftMetadata;
    lastPrice?: string;
    sell: SellNftExecutor;
    executing: boolean;
    refreshListing: () => void;
    onClose: () => void;
}) {
    const [open, setOpen] = useState(true);

    const removeBatchNftSale = useIdentityStore((s) => s.removeBatchNftSale);

    const yumiPlatformFee = useYumiPlatformFee();

    const [price, setPrice] = useState(
        lastPrice ? `${exponentNumber(lastPrice, -getLedgerIcpDecimals())}` : '',
    );
    const priceWithDecimals = exponentNumber(price, getLedgerIcpDecimals());

    const onPriceChange = ({ target: { value } }) => {
        if (!value) {
            setPrice('');
            return;
        }
        if (Number(value) === 0) {
            setPrice(value);
            return;
        }
        isValidPrice(value) && setPrice(value);
    };

    const onConfirm = async () => {
        if (executing) return; // 注意防止重复点击

        // 1. 检查 price 的有效性, 是否数字/小数点精度/范围等问题
        const checked = checkSellPrice(price, getLedgerIcpDecimals(), 0.01);
        if (checked) return message.error(checked);

        // ! 不支持代币切换，只有黄金还支持 OGY，但是黄金不用这个弹窗

        const token: TokenInfo = getLedgerTokenIcp();
        // ! ogy标准的nft的价格要带精度
        const finalPrice = card.owner.raw.standard === 'ogy' ? priceWithDecimals : price;

        setOpen(false);
        sell(identity, card.owner, lastPrice, token, finalPrice)
            .then(alreadyMessaged)
            .then(() => {
                removeBatchNftSale(card.metadata.token_id); // 尝试移除批量卖出
                refreshListing(); // 刷新界面
                onClose(); // 成功了
            })
            .catch();
    };

    const onModalClose = () => {
        setOpen(false);
        onClose();
    };
    // 判断是否为 origyn art
    const isOrigynArt = NFT_OGY_ART.find((item) => card.metadata.token_id.collection === item);

    return (
        <div onClick={justPreventLink}>
            {!isOrigynArt ? (
                <Modal
                    open={open}
                    footer={null}
                    onOk={onConfirm}
                    onCancel={onModalClose}
                    closeIcon={null}
                    centered={true}
                    width={600}
                    className="sell-modal"
                >
                    <div className="mb-[30px] flex w-full items-center justify-between p-[20px] pb-0 md:p-[30px]">
                        <div className="font-inter-bold text-[20px] leading-none text-title">
                            List item for sale
                        </div>
                        <CloseIcon className="w-[14px]" onClick={onModalClose} />
                    </div>
                    <div className="hidden w-full flex-col gap-x-[24px]  md:flex">
                        <div className="px-[30px]">
                            <div className="flex justify-between">
                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="mb-[10px] font-inter-medium text-[14px] text-name">
                                        {getCollectionNameByNftMetadata(card)}
                                    </div>
                                    <div className="mb-auto font-inter-bold  text-[18px] leading-none text-black">
                                        {getNameByNftMetadata(card)}
                                    </div>

                                    <div className="flex items-center leading-none">
                                        <IconLogoLedgerIcp className="mr-[7px] w-[18px]" />
                                        <TokenPrice
                                            className="mr-[5px] font-inter-semibold text-[20px] text-black md:text-[20px]"
                                            value={{
                                                value: priceWithDecimals,
                                                decimals: {
                                                    value: getLedgerIcpDecimals(),
                                                    type: 'exponent',
                                                },
                                                symbol: '', // 前面有图标了, 这里就要隐藏单位
                                                scale: 2,
                                                paddingEnd: 2,
                                            }}
                                        />
                                        <Usd
                                            className="font-inter-medium text-symbol"
                                            value={{
                                                value: price,
                                                scale: 2,
                                                symbol: 'ICP',
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-[90px]">
                                    <NftMedia
                                        className="block rounded-[8px]"
                                        src={cdn(getThumbnailByNftMetadata(card))}
                                        metadata={card.metadata}
                                    />
                                </div>
                            </div>
                            <div className="mt-10 font-inter-semibold leading-none text-name">
                                Price
                            </div>
                            <div className="mt-[10px] flex w-full flex-shrink-0 items-center rounded-[8px]">
                                <Input
                                    className="h-[40px] flex-1  rounded-[6px] rounded-r-none border border-[#999] bg-[#F2F2F2] px-[10px] font-inter-bold text-[14px] text-black"
                                    value={price}
                                    onChange={onPriceChange}
                                />
                                <div className="flex h-[40px] rounded-[6px] rounded-l-none border border-l-0 border-[#999] px-[15px] font-inter-semibold text-[14px] text-title ">
                                    <span className="my-auto">ICP</span>
                                </div>
                            </div>
                            <div className="mt-[40px]">
                                <span className=" font-inter-medium leading-none text-name">
                                    commission
                                </span>
                                <div className="mt-[10px] flex flex-col gap-y-[11px] rounded-[8px] border border-[#D0D0D0] bg-[#F2F2F2]  px-[10px] py-[16px] font-inter-medium text-[14px] text-stress">
                                    <div className="flex w-full items-center justify-between  ">
                                        <span className="font mr-[8px] leading-[16px] ">
                                            Service Fee
                                        </span>
                                        <span className="">
                                            {' '}
                                            {getServiceFee(card, yumiPlatformFee) ?? '--'}%
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between ">
                                        <span className=" mr-[8px] text-stress">
                                            Creator Royalty
                                        </span>
                                        <span className="">
                                            {card.data?.info.royalties ?? '--'}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-[30px] flex justify-between">
                                <span className=" font-inter-semibold text-[20px] text-title ">
                                    Total
                                </span>
                                <div className="flex items-center leading-none">
                                    <IconLogoLedgerIcp className="mr-[7px] w-[18px]" />

                                    <TokenPrice
                                        className="mr-[5px] font-inter-semibold text-[20px] text-black md:text-[20px]"
                                        value={{
                                            value: priceWithDecimals,
                                            decimals: {
                                                value: getLedgerIcpDecimals(),
                                                type: 'exponent',
                                            },
                                            symbol: '', // 前面有图标了, 这里就要隐藏单位
                                            scale: 2,
                                            paddingEnd: 2,
                                        }}
                                    />
                                    <Usd
                                        className="text-[14px] text-symbol"
                                        value={{
                                            value: price,
                                            symbol: 'ICP',
                                            scale: 2,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-[15px] flex cursor-pointer items-center justify-between border-t border-common p-[30px]">
                            <div className="flex h-fit flex-col gap-y-[5px]">
                                <BalanceRefresh symbol={'ICP'} />
                            </div>
                            <div className="flex items-center gap-x-[27px]">
                                {' '}
                                <Button
                                    onClick={onModalClose}
                                    variant={'outline'}
                                    className="h-[36px] w-[86px] flex-shrink-0 rounded-[8px] border border-solid border-black/60 bg-white text-center font-inter-bold text-[16px] leading-[36px]  text-black"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onConfirm}
                                    className="h-[36px] min-w-[86px] flex-shrink-0 rounded-[8px] bg-black text-center font-inter-bold text-[16px] leading-[36px] text-white"
                                    disabled={executing}
                                >
                                    Confirm {executing && <LoadingOutlined className="ml-1" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-x-[24px]  md:hidden">
                        <div className="px-[20px]">
                            <div className="flex justify-between">
                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="mb-[10px] font-inter-medium text-[14px] text-name">
                                        {getCollectionNameByNftMetadata(card)}
                                    </div>
                                    <div className="mb-auto font-inter-bold  text-[18px] leading-none text-black">
                                        {getNameByNftMetadata(card)}
                                    </div>

                                    <div className="flex items-center leading-none">
                                        {<IconLogoLedgerIcp className="mr-[7px] w-[18px]" />}
                                        <TokenPrice
                                            className="mr-[5px] font-inter-semibold text-[20px] text-black md:text-[20px]"
                                            value={{
                                                value: priceWithDecimals,
                                                decimals: {
                                                    value: getLedgerIcpDecimals(),
                                                    type: 'exponent',
                                                },
                                                symbol: '', // 前面有图标了, 这里就要隐藏单位
                                                scale: 2,
                                                paddingEnd: 2,
                                            }}
                                        />
                                        <Usd
                                            className="font-inter-medium text-symbol"
                                            value={{
                                                value: price,
                                                scale: 2,
                                                symbol: 'ICP',
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-[90px]">
                                    <NftMedia
                                        className="block rounded-[8px]"
                                        src={cdn(getThumbnailByNftMetadata(card))}
                                        metadata={card.metadata}
                                    />
                                </div>
                            </div>
                            <div className="mt-10 font-inter-semibold leading-none text-name">
                                Price
                            </div>
                            <div className="mt-[10px] flex w-full flex-shrink-0 items-center rounded-[8px]">
                                <Input
                                    className="h-[40px] flex-1  rounded-[6px] rounded-r-none border border-[#999] bg-[#F2F2F2] px-[10px] font-inter-bold text-[14px] text-black"
                                    value={price}
                                    onChange={onPriceChange}
                                />
                                <div className="flex h-[40px] rounded-[6px] rounded-l-none border border-l-0 border-[#999] px-[15px] font-inter-semibold text-[14px] text-title ">
                                    <span className="my-auto">ICP</span>
                                </div>
                            </div>
                            <div className="mt-[20px]">
                                <span className=" font-inter-medium leading-none text-name">
                                    commission
                                </span>
                                <div className="mt-[10px] flex flex-col gap-y-[11px] rounded-[8px] border border-[#D0D0D0] bg-[#F2F2F2]  px-[10px] py-[16px] font-inter-medium text-[14px] text-stress">
                                    <div className="flex w-full items-center justify-between  ">
                                        <span className="font mr-[8px] leading-[16px] ">
                                            Service Fee
                                        </span>
                                        <span className="">
                                            {' '}
                                            {getServiceFee(card, yumiPlatformFee) ?? '--'}%
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between ">
                                        <span className=" mr-[8px] text-stress">
                                            Creator Royalty
                                        </span>
                                        <span className="">
                                            {card.data?.info.royalties ?? '--'}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-[30px] flex justify-between">
                                <span className=" font-inter-semibold text-[20px] text-title ">
                                    Total
                                </span>
                                <div className="flex items-center leading-none">
                                    {<IconLogoLedgerIcp className="mr-[7px] w-[18px]" />}
                                    <TokenPrice
                                        className="mr-[5px] font-inter-semibold text-[20px] text-black md:text-[20px]"
                                        value={{
                                            value: priceWithDecimals,
                                            decimals: {
                                                value: getLedgerIcpDecimals(),
                                                type: 'exponent',
                                            },
                                            symbol: '', // 前面有图标了, 这里就要隐藏单位
                                            scale: 2,
                                            paddingEnd: 2,
                                        }}
                                    />
                                    <Usd
                                        className="text-[14px] text-symbol"
                                        value={{
                                            value: price,
                                            symbol: 'ICP',
                                            scale: 2,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-[15px] flex cursor-pointer flex-col items-center justify-between border-t border-common p-[20px]">
                            <div className="flex h-fit w-full flex-col justify-start gap-y-[5px]">
                                <BalanceRefresh symbol={'ICP'} />
                            </div>
                            <div className="mt-[10px] flex w-full items-center justify-between gap-x-[27px]">
                                {' '}
                                <Button
                                    onClick={onModalClose}
                                    variant={'outline'}
                                    className="h-[36px] w-[86px] flex-shrink-0 rounded-[8px] border border-solid border-black/60 bg-white text-center font-inter-bold text-[16px] leading-[36px]  text-black"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onConfirm}
                                    className="h-[36px] w-[86px] flex-shrink-0 rounded-[8px] bg-black text-center font-inter-bold text-[16px] leading-[36px] text-white"
                                    disabled={executing}
                                >
                                    Confirm {executing && <LoadingOutlined className="ml-1" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            ) : (
                <Modal
                    open={open}
                    footer={null}
                    centered={true}
                    onOk={onConfirm}
                    onCancel={onModalClose}
                    width={'80%'}
                    style={{ maxWidth: '1000px', padding: 0 }}
                    className="origyn-art-sell"
                >
                    <div className="flex flex-col md:flex-row">
                        <div
                            className="flex w-full items-center justify-center py-2  md:w-1/2 md:py-20 "
                            style={{
                                background:
                                    'linear-gradient(270deg,#c5b3581f -17.55%,#c4c4c400 22.81%)',
                            }}
                        >
                            <img
                                src="https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669630828531_land-page-banner.png"
                                className="mx-auto h-[200px] md:h-[50vh]"
                                alt=""
                            />
                        </div>
                        <div className="flex w-full flex-col justify-between gap-y-[20px] p-8 pt-0 md:w-1/2 md:p-12 ">
                            <div className="font-inter-medium text-[30px]">List piece for sale</div>
                            <div className="font-inter-medium text-[17px] italic ">
                                Suzanne Walking in Leather Skirt. 3, 2008 Julian Opie(b. 1958)
                            </div>
                            <div>
                                {' '}
                                <div className="font-inter-medium text-[17px]">Fraction ID</div>
                                <div>{card.metadata.metadata.name}</div>
                            </div>
                            <div>
                                <span className="font-inter-medium text-[17px]">Price</span>
                                <div className="relative">
                                    <IconLogoLedgerIcp className="absolute left-[16px] top-1/2 h-[18px] w-[18px]" />
                                    <input
                                        className="mt-[15px] w-[200px]  rounded-[14px] border border-common  px-[50px] py-[17px] font-inter-bold text-[16px] text-black focus:outline-none"
                                        value={price}
                                        onChange={onPriceChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <span className="font-inter-medium text-[17px]">Fees</span>
                                <div className="mt-[15px] flex w-full gap-x-[10px] gap-y-[5px] overflow-scroll text-[12px] md:flex-wrap">
                                    <div className="flex h-fit w-fit gap-x-[10px] rounded-[10px] bg-[#f5f5f5] px-[15px] py-[10px] text-center">
                                        <div className="whitespace-nowrap">Initial owner</div>
                                        <div className=" font-inter-semibold ">1%</div>
                                    </div>
                                    <div className="flex h-fit w-fit gap-x-[10px] rounded-[10px] bg-[#f5f5f5] px-[15px] py-[10px] text-center">
                                        <span className="whitespace-nowrap">Yumi</span>
                                        <span className=" font-inter-semibold ">3%</span>
                                    </div>
                                    <div className="flex h-fit w-fit gap-x-[10px] rounded-[10px] bg-[#f5f5f5] px-[15px] py-[10px] text-center">
                                        <span className="whitespace-nowrap">Minting node</span>
                                        <span className=" font-inter-semibold ">3.5%</span>
                                    </div>
                                    <div className="flex h-fit w-fit gap-x-[10px] rounded-[10px] bg-[#f5f5f5] px-[15px] py-[10px] text-center">
                                        <span className="whitespace-nowrap">ORIGYN</span>
                                        <span className=" font-inter-semibold ">0.5%</span>
                                    </div>

                                    <div className="flex h-fit w-fit gap-x-[10px] rounded-[10px] bg-[#f5f5f5] px-[15px] py-[10px] text-center">
                                        <span className="whitespace-nowrap">
                                            Copyright & Royalty owners
                                        </span>
                                        <span className=" font-inter-semibold ">4%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between border-t pt-[25px] md:flex-row">
                                <div className="text-[14px] italic leading-[17px] text-[#7b7777]">
                                    <span>Fees will be deducted from the price</span>

                                    <span className="flex">
                                        {' '}
                                        and you will receive &nbsp;
                                        <IconLogoLedgerIcp />{' '}
                                        <span className="font-inter-semibold">
                                            <TokenPrice
                                                value={{
                                                    value: bigint2string(
                                                        (BigInt(
                                                            exponentNumber(
                                                                price,
                                                                getLedgerIcpDecimals(),
                                                            ),
                                                        ) *
                                                            BigInt(88)) /
                                                            BigInt(100),
                                                    ),
                                                    decimals: {
                                                        type: 'exponent',
                                                        value: getLedgerIcpDecimals(),
                                                    },
                                                }}
                                                className="text-[14px]"
                                            />{' '}
                                            ICP
                                        </span>
                                    </span>
                                </div>
                                <Button
                                    onClick={onConfirm}
                                    className="mt-[5px] rounded-none text-[16px]"
                                >
                                    List for sale
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default SellModal;

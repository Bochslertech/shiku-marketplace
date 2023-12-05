import { useEffect, useState } from 'react';
import { Dropdown, Menu, message, Modal } from 'antd';
import { SupportedLedgerTokenSymbol } from '@/01_types/canisters/ledgers';
import { SellNftExecutor } from '@/01_types/exchange/single-sell';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftMetadata, TokenInfo } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { exponentNumber } from '@/02_common/data/numbers';
import { alreadyMessaged } from '@/02_common/data/promise';
import { GoldNftInfo } from '@/04_apis/yumi/gold-api';
import {
    getLedgerIcpDecimals,
    getLedgerOgyDecimals,
    getLedgerTokenIcp,
    getLedgerTokenOgy,
} from '@/05_utils/canisters/ledgers/special';
import { getOgyGoldCanisterId } from '@/05_utils/canisters/nft/special';
import { getGoldBuyBackAllowList } from '@/05_utils/canisters/yumi/special';
import { getNameByNftMetadata, getThumbnailByNftMetadata } from '@/05_utils/nft/metadata';
import { checkSellPrice, useSellingActionSteps } from '@/08_hooks/exchange/single/sell';
import { useGoldBuyBack } from '@/08_hooks/views/gold';
import TokenPrice from '../../../../data/price';
import Usd from '../../../../data/usd';
import Loading from '../../../../ui/loading';
import './index.less';

// 黄金有独立的弹窗, 支持用户选择 ICP OGY 或者 ICP 回购 这 3 种方式下单
const ConfirmingModal = ({
    lastPrice,
    open,
    setOpen,
}: {
    lastPrice: string;
    open: boolean;
    setOpen: (isOpen: boolean) => void;
}) => {
    const onModalClose = () => setOpen(false);
    return (
        <Modal open={open} footer={null} centered={true} onCancel={onModalClose}>
            <div className="flex h-[400px] flex-col">
                <div className='text-black" mb-[20px] font-inter-bold text-[20px]'>
                    {lastPrice ? 'Committing your changes' : 'Confirm your sell order'}
                </div>
                <div className="flex flex-1">
                    <Loading className="my-auto" />
                </div>
            </div>
        </Modal>
    );
};

function SellGoldModal({
    identity,
    card,
    lastPrice,
    sell,
    executing,
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

    // 展示进度条
    const { show, failed, fail } = useSellingActionSteps(
        undefined,
        card.owner.raw.standard,
        card.owner.token_id.collection,
        lastPrice,
    );

    const tokens = [
        {
            key: 'ICP',
            label: 'ICP',
            z_icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon_icp.png',
        },
        {
            key: 'OGY',
            label: 'OGY',
            z_icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1666605793222_Mask group.svg',
        },
    ];
    const [selectToken, setSelectToken] = useState(tokens[0]);
    // 用户选择哪种方式上架？
    const [type, setType] = useState<'listing' | 'buy-back'>('listing');
    // 用户在选择 listing 情况下选择哪种代币？
    const [symbol, setSymbol] = useState<SupportedLedgerTokenSymbol>('ICP');

    // result modal是否打开
    const [resultOpen, setResultOpen] = useState<boolean>(false);
    useEffect(() => {
        if (show && !failed) {
            setResultOpen(true);
            // 关闭确认页面
            setOpen(false);
        }
    }, [show, failed]);
    //判断改价 ogy|icp
    useEffect(() => {
        if (card.listing && card.listing.listing && card.listing.listing.type === 'listing') {
            if (card.listing.listing.token.symbol === 'OGY') {
                setSelectToken(tokens[1]);
                setSymbol('OGY');
            } else {
                setSelectToken(tokens[0]);
                setSymbol('ICP');
            }
        }
    }, []);

    // 用户在选择 listing 情况下输入的价格？
    const [price, setPrice] = useState(
        lastPrice ? `${exponentNumber(lastPrice, -getLedgerIcpDecimals())}` : '',
    );
    // 用户在选择 buy-back 的情况下需要自动计算价格，以 ICP 计算
    const { price: buyBackPrice, gold } = useGoldBuyBack(card);

    const onPriceChange = ({ target: { value } }) => {
        setPrice(value);
    };

    const onConfirm = async () => {
        if (executing) return; // 注意防止重复点击

        // 1. 检查 price 的有效性, 是否数字/小数点精度/范围等问题
        if (type === 'listing') {
            const checked = checkSellPrice(price, getLedgerIcpDecimals(), 0.01);
            if (checked) return message.error(checked);
        } else {
            if (buyBackPrice === undefined) return message.error(`get buy back price failed`);
        }

        // ! 代币切换
        const token: TokenInfo =
            type === 'listing' && symbol === 'OGY' ? getLedgerTokenOgy() : getLedgerTokenIcp();
        const realPrice =
            type === 'listing' ? exponentNumber(price, Number(token.decimals)) : buyBackPrice!;

        sell(
            identity,
            card.owner,
            lastPrice,
            token,
            realPrice,
            type === 'listing' ? undefined : getGoldBuyBackAllowList(),
        )
            .then(alreadyMessaged)
            .then(() => {
                // removeBatchNftSale(card.metadata.token_id); // 尝试移除批量卖出
                // hide();
                // onClose(); // 成功了
            })
            .catch(fail);
    };

    const onModalClose = () => {
        setOpen(false);
        onClose();
    };

    const combinedPrice = (() => {
        return type === 'listing'
            ? checkSellPrice(
                  price,
                  symbol === 'ICP' ? getLedgerIcpDecimals() : getLedgerOgyDecimals(),
                  0.01,
              )
                ? undefined
                : exponentNumber(
                      price,
                      symbol === 'ICP' ? getLedgerIcpDecimals() : getLedgerOgyDecimals(),
                  )
            : buyBackPrice;
    })();
    const combinedDecimals = (() => {
        return type === 'listing' && symbol === 'OGY'
            ? getLedgerOgyDecimals()
            : getLedgerIcpDecimals();
    })();
    const combinedSymbol = (() => {
        return type === 'listing' && symbol === 'OGY' ? 'OGY' : 'ICP';
    })();

    if (!getOgyGoldCanisterId().includes(card.owner.token_id.collection)) return <></>;
    return (
        <>
            <Modal
                open={open}
                footer={null}
                centered={true}
                onOk={onConfirm}
                onCancel={onModalClose}
                width={600}
            >
                <div className="md:flex">
                    <div className="flex">
                        <img
                            className="mr-[24px] block w-[130px] rounded-[8px] object-contain md:h-[300px] md:w-[200px]"
                            src={cdn(
                                gold
                                    ? (JSON.parse(gold.metadata.raw.data) as GoldNftInfo).primary
                                    : getThumbnailByNftMetadata(card),
                            )}
                        />
                        <div className="my-[20px] block font-inter-semibold text-[16px] leading-[16px] text-black md:hidden">
                            {getNameByNftMetadata(card)}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="mb-[20px] hidden font-inter-semibold text-[16px] leading-[16px] text-black md:block">
                            {getNameByNftMetadata(card)}
                        </div>
                        <div className=" mb-[6px] font-inter-medium text-[12px] leading-[12px]">
                            Select a price
                        </div>
                        <div className="  rounded-[8px] border border-opacity-[0.1] p-[10px]">
                            <div className="font-inter-medium text-[12px] leading-[12px]">
                                Your price
                            </div>
                            <div className="flex items-center">
                                <div className=" my-[6px] mr-[10px] flex h-[32px] flex-1">
                                    <Dropdown
                                        overlayClassName="filter-menu-wrapper"
                                        overlay={
                                            <Menu
                                                selectedKeys={[selectToken['key']]}
                                                items={tokens}
                                                onClick={(e) => {
                                                    const select = tokens.filter(
                                                        (pr) => pr.key === e.key,
                                                    );
                                                    setSymbol(
                                                        select[0].key as SupportedLedgerTokenSymbol,
                                                    );
                                                    setSelectToken(select[0]);
                                                }}
                                            />
                                        }
                                        trigger={['click']}
                                        placement="bottom"
                                    >
                                        <div className="relative flex h-full w-[200px] flex-1 cursor-pointer items-center justify-center rounded-[4px] border border-[#0000001a] border-opacity-[0.1] p-[4px] text-opacity-[0.8]">
                                            <img
                                                className="h-[24px] w-[24px] object-contain"
                                                src={cdn(selectToken.z_icon)}
                                                alt=""
                                            />
                                            <input
                                                className="h-full flex-1 border-none outline-none"
                                                value={price}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (
                                                        value.split('.').length >= 2 &&
                                                        value.split('.')[1].length > 2
                                                    ) {
                                                        return;
                                                    }
                                                    if (!isNaN(Number(e.target.value))) {
                                                        if (e.target.value.length === 0) {
                                                            onPriceChange({
                                                                target: { value: '' },
                                                            });
                                                        } else {
                                                            const val = Number(e.target.value);
                                                            if (
                                                                val === 0 ||
                                                                (val >= 0.01 && val <= 100000)
                                                            ) {
                                                                onPriceChange(e);
                                                            }
                                                        }
                                                    }
                                                }}
                                            ></input>
                                            <span className="h-[16px] w-[16px] bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon-filter-more.svg')] bg-center bg-no-repeat transition duration-100 ease-linear"></span>
                                        </div>
                                    </Dropdown>
                                </div>

                                <div
                                    onClick={() => setType('listing')}
                                    className={cn([
                                        'flex h-[32px] w-[100px] cursor-pointer items-center justify-center rounded-[4px] border  font-inter-medium ',
                                        type === 'listing' && 'border-none bg-[#000] text-[#fff]',
                                    ])}
                                >
                                    Select
                                </div>
                            </div>
                        </div>
                        <div className="mt-[10px] rounded-[8px] border border-opacity-[0.1] p-[10px]">
                            <div className="font-inter-medium text-[12px] leading-[12px]">
                                BAS offer{' '}
                                <span className=" font-inter-light text-[#989898]">
                                    accepted within 24hours
                                </span>
                            </div>
                            <div className="mt-[10px] flex items-center justify-between">
                                <div className="flex items-center ">
                                    <img
                                        className=" mr-[6px] h-[24px] w-[24px]"
                                        src={cdn(
                                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon_icp.png',
                                        )}
                                        alt=""
                                    />
                                    <span className=" font-inter-medium text-[#000c]">
                                        {buyBackPrice ? (
                                            <>
                                                {exponentNumber(
                                                    buyBackPrice,
                                                    -getLedgerIcpDecimals(),
                                                )}
                                            </>
                                        ) : (
                                            '--'
                                        )}
                                    </span>
                                </div>

                                <div
                                    onClick={() => setType('buy-back')}
                                    className={cn([
                                        'flex h-[32px] w-[100px] cursor-pointer items-center justify-center rounded-[4px] border  font-inter-medium ',
                                        type === 'buy-back' && 'border-none bg-[#000] text-[#fff]',
                                    ])}
                                >
                                    Select
                                </div>
                            </div>
                        </div>
                        <div className="mb-[26px] mt-[6px] flex items-center">
                            <div className="mr-[5px] flex  w-[115px] items-center justify-center rounded-[4px] border border-[#e0e0e0] bg-[#F2F2F2] text-[12px]">
                                <span className="font-inter-normal mr-[8px]  text-black/60">
                                    Service Fee
                                </span>
                                <span className="font-inter-bold  text-black">{'1'}%</span>
                            </div>
                            <div className="flex w-[142px] items-center justify-center rounded-[4px] border border-[#e0e0e0] bg-[#F2F2F2] text-[12px]">
                                <span className="font-inter-normal mr-[8px]  text-black/60">
                                    Creator Royalty
                                </span>
                                <span className="font-inter-bold  text-black">{'1'}%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                Total Price you will receive{' '}
                                <div>
                                    <TokenPrice
                                        value={{
                                            value: Number(combinedPrice) * 0.98 + '',
                                            decimals: {
                                                type: 'exponent',
                                                value: combinedDecimals,
                                            },
                                            symbol: combinedSymbol,
                                        }}
                                    />
                                    <Usd
                                        value={{
                                            value: Number(combinedPrice) * 0.98 + '',
                                            decimals: {
                                                type: 'exponent',
                                                value: combinedDecimals,
                                            },
                                            symbol: combinedSymbol,
                                            scale: 2,
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div
                                    onClick={onConfirm}
                                    className="h-[44px] w-[111px] flex-shrink-0 cursor-pointer rounded-[8px] bg-black text-center font-inter-bold text-[16px] leading-[43px] text-white"
                                >
                                    Sell
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {<ConfirmingModal open={resultOpen} setOpen={setResultOpen} lastPrice={lastPrice!} />}
        </>
    );
}

export default SellGoldModal;

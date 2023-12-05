import { useState } from 'react';
import { Image, message, Modal } from 'antd';
import { BuyingAction, BuyNftExecutor } from '@/01_types/exchange/single-buy';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { alreadyMessaged } from '@/02_common/data/promise';
import { getYumiOgyBroker } from '@/02_common/nft/ogy';
import { unwrapVariantKey } from '@/02_common/types/variant';
import { OrigynArtCollectionData } from '@/03_canisters/yumi/yumi_origyn_art';
import { getThumbnailByNftMetadata } from '@/05_utils/nft/metadata';
import { useIdentityStore } from '@/07_stores/identity';
import TokenPrice from '../../../../data/price';
import style from './index.module.less';

function OrigynArtBuyModal({
    card,
    listing,
    buy,
    action,
    refreshListing,
    onClose,
    collectionData,
}: {
    card: NftMetadata;
    listing: NftListingData;
    buy: BuyNftExecutor;
    action: BuyingAction;
    refreshListing: () => void;
    onClose: () => void;
    collectionData: OrigynArtCollectionData | undefined;
}) {
    const [open, setOpen] = useState(true);
    const collectionMetadata = collectionData?.metadata;
    const removeShoppingCartItem = useIdentityStore((s) => s.removeShoppingCartItem);
    const removeGoldShoppingCartItem = useIdentityStore((s) => s.removeGoldShoppingCartItem);
    const [tipsChecked, setTipsChecked] = useState(false);
    const { price, token } = (() => {
        if (listing.listing.type !== 'listing') return { price: undefined, token: undefined };
        return { price: listing.listing.price, token: listing.listing.token };
    })();

    const onConfirm = async () => {
        if (price === undefined || token === undefined) return; // ? 不会出现
        if (listing.listing.type !== 'listing') return;

        if (listing.listing.type !== 'listing') throw new Error('buy failed');
        message.loading('Buying...', 100000); // 一直显示的阻塞界面
        buy(
            card.owner.token_id,
            card.owner.owner,
            token,
            price,
            (() => {
                if (card.owner.raw.standard === 'ogy') {
                    // ! 要求当前所有者一定是 principal
                    const account = card.owner.raw.data.account;
                    const key = unwrapVariantKey(account);
                    if (key !== 'principal') {
                        throw new Error(`the owner of nft must be principal`);
                    }
                    const principal = account[key] as string;
                    if (listing.listing.raw.type !== 'ogy') {
                        throw new Error(`wrong listing data`);
                    }
                    return {
                        standard: 'ogy',
                        sale_id: listing.listing.raw.sale_id,
                        broker_id: getYumiOgyBroker(),
                        seller: principal,
                    };
                }
                return { standard: card.owner.raw.standard };
            })(),
        )
            .then((d) => {
                message.destroy();
                return alreadyMessaged(d);
            })
            .then(() => {
                message.success('Bought successful.');
                removeShoppingCartItem(card.metadata.token_id); // 尝试移除购物车
                removeGoldShoppingCartItem(card.metadata.token_id); // 尝试移除购物车
                refreshListing(); // 刷新界面
                onClose(); // 成功了
            });
    };

    const onModalClose = () => {
        setOpen(false);
        onClose();
    };

    return (
        <Modal
            open={open}
            footer={null}
            onCancel={onModalClose}
            width={723}
            centered={true}
            className={style['origyn-art-buy-modal']}
        >
            {/* pc端 ui */}
            <div className="hidden w-full gap-x-[24px] md:flex">
                <div className="hidden">{action}</div>
                <img
                    className="max-h-[303px] w-[182px] object-contain"
                    src={collectionMetadata && collectionMetadata.coverImage}
                    alt=""
                />
                <div className="flex flex-1 flex-col justify-center">
                    <div className="font-inter-medium text-[30px] leading-[35px] text-[#151515]">
                        {collectionMetadata && collectionMetadata.name}
                    </div>
                    <div className=" mt-[15px] font-inter-medium text-[17px] leading-[24px] text-[#151515]">
                        {collectionMetadata && collectionMetadata.artAuthor}
                        <span className=" ml-1 font-inter-light">
                            ({collectionMetadata && collectionMetadata.authorBirth})
                        </span>
                    </div>
                    <div className="mb-[17px] mt-[32px] flex items-center justify-between">
                        <div className=" flex max-h-[33px] items-center leading-[18px]">
                            <Image
                                className=" max-w-[33px]"
                                src={getThumbnailByNftMetadata(card)}
                            />
                            <div className="ml-2 font-inter-medium">
                                <div>Piece ID: </div>
                                <div>
                                    <b>#{card.owner.token_id.token_identifier}</b>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <img
                                className="mr-[11px] h-[24px] w-[24px]"
                                src={cdn(
                                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691397017738_Group 632393.svg',
                                )}
                                alt=""
                            />
                            <TokenPrice
                                className="mr-[10px] font-inter-bold text-black md:text-[26px]"
                                value={{
                                    value: price!,
                                    token: token!,
                                    symbolClassName: true,
                                    scale: 2,
                                    paddingEnd: 2,
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex cursor-pointer justify-between border-t pt-[15px]">
                        <div
                            className={
                                'relative flex cursor-pointer items-center font-inter-light text-[14px]'
                            }
                        >
                            <span
                                className={cn([
                                    ' mr-[10px] flex h-[32px] w-[32px] items-center justify-center border',
                                    tipsChecked && 'bg-[#000]',
                                ])}
                                onClick={() => {
                                    setTipsChecked(!tipsChecked);
                                }}
                            >
                                <span className="h-full w-full bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon-buy-modal-done.svg')] bg-cover bg-center bg-no-repeat"></span>
                            </span>
                            <span>I accept</span>
                            <span
                                className=" ml-[0.5em] cursor-pointer underline"
                                onClick={() => {
                                    window.open(
                                        'https://yuminftmarketplace.gitbook.io/yumi-docs/legal/purchase-terms-yumi-co-owned-nfts',
                                    );
                                }}
                            >
                                term and conditions
                            </span>
                        </div>
                        <div
                            onClick={onConfirm}
                            className={cn([
                                ' pointer-events-none h-[40px] w-[132px] flex-shrink-0  bg-[#999] text-center font-inter-bold text-[16px] leading-[39px] text-white',
                                tipsChecked && 'pointer-events-auto bg-black',
                            ])}
                        >
                            Confirm
                        </div>
                    </div>
                </div>
            </div>
            {/* 手机端ui */}
            <div className="flex w-full flex-col md:hidden">
                <div className="gap-x-[10px]">
                    <img
                        className="mx-auto mb-[58px] max-h-[230px] w-[114px] object-contain"
                        src={collectionMetadata && collectionMetadata.coverImage}
                        alt=""
                    />
                    <div className="flex flex-col justify-between">
                        <div className="font-inter-medium text-[30px] leading-[35px] text-[#151515]">
                            {collectionMetadata && collectionMetadata.name}
                        </div>
                        <div className=" mt-[25px] grid grid-cols-2 gap-[15px]">
                            <div className=" flex h-[71px] flex-col justify-center rounded-[5px] border border-[#e5e5e5] pl-[23px] text-xs leading-[18px] ">
                                <div className="label">Artist</div>
                                <div>
                                    <div className=" font-inter-semibold text-[#151515]">
                                        {collectionMetadata && collectionMetadata.artAuthor}
                                    </div>
                                    <div className="birthday">
                                        ({collectionMetadata && collectionMetadata.authorBirth})
                                    </div>
                                </div>
                            </div>
                            <div className=" flex items-center rounded-[5px] border border-[#e5e5e5] pl-[15px] text-xs">
                                <Image className="w-[48px]" src={getThumbnailByNftMetadata(card)} />
                                <div className="ml-[11px]">
                                    <div className="label">Piece ID</div>
                                    <div className="value">
                                        #{card.owner.token_id.token_identifier}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="my-[38px] flex items-center justify-center">
                            <img
                                className="mr-[11px] h-[24px] w-[24px]"
                                src={cdn(
                                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691397017738_Group 632393.svg',
                                )}
                                alt=""
                            />
                            <TokenPrice
                                className="mr-[10px] font-inter-bold text-[24px] text-black"
                                value={{
                                    value: price!,
                                    token: token!,
                                    symbolClassName: true,
                                    scale: 2,
                                    paddingEnd: 2,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="cursor-pointer justify-between border-t pt-[27px]">
                    <div
                        className={
                            'relative flex cursor-pointer items-center font-inter-light text-[14px]'
                        }
                    >
                        <span
                            className={cn([
                                ' mr-[10px] flex h-[32px] w-[32px] items-center justify-center border',
                                tipsChecked && 'bg-[#000]',
                            ])}
                            onClick={() => {
                                setTipsChecked(!tipsChecked);
                            }}
                        >
                            <span className="h-full w-full bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon-buy-modal-done.svg')] bg-cover bg-center bg-no-repeat"></span>
                        </span>
                        <span>I accept</span>
                        <span
                            className=" ml-[0.5em] cursor-pointer underline"
                            onClick={() => {
                                window.open(
                                    'https://yuminftmarketplace.gitbook.io/yumi-docs/legal/purchase-terms-yumi-co-owned-nfts',
                                );
                            }}
                        >
                            term and conditions
                        </span>
                    </div>
                    <div
                        onClick={onConfirm}
                        className={cn([
                            ' pointer-events-none mt-[27px] h-[40px] w-full flex-shrink-0  bg-[#999] text-center font-inter-bold text-[16px] leading-[39px] text-white',
                            tipsChecked && 'pointer-events-auto bg-black',
                        ])}
                    >
                        Confirm
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default OrigynArtBuyModal;

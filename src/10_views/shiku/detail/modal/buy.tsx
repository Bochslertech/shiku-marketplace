import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, message, Modal } from 'antd';
import { NftListingData } from '@/01_types/listing';
import { TokenInfo } from '@/01_types/nft';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { exponentNumber } from '@/02_common/data/numbers';
import { alreadyMessaged } from '@/02_common/data/promise';
import { useBuyNft } from '@/08_hooks/exchange/single/buy';
import TokenPrice from '@/09_components/data/price';

function ShikuLandsNftBuyModal({
    open,
    setOpen,
    name,
    token,
    price,
    card,
    listing,
    refreshAll,
}: {
    open: boolean;
    setOpen: (o: boolean) => void;
    name: string | undefined;
    token: TokenInfo | undefined;
    price: string | undefined;
    card: NftMetadata | undefined;
    listing: NftListingData | undefined;
    refreshAll: () => void;
}) {
    const [loading, setLoading] = useState(false);

    const [accept, setAccept] = useState(false);
    const onAcceptChange = ({ target: { checked } }) => setAccept(checked);

    // 购买
    const {
        buy,
        // action: buyAction
    } = useBuyNft(); // 也许需要取消状态来判断显示

    const onSubmit = () => {
        if (!accept) return message.error('please accept term and conditions');
        if (
            card === undefined ||
            token === undefined ||
            price === undefined ||
            listing === undefined
        ) {
            return;
        }
        // 进行购买
        setLoading(true);
        buy(card.owner.token_id, card.owner.owner, token, price, {
            standard: card.owner.raw.standard,
        } as any)
            .then(alreadyMessaged)
            .then(() => {
                message.success('Bought successful.');
                refreshAll();
                setOpen(false);
            })
            .finally(() => setLoading(false));
    };
    return (
        <Modal
            footer={null}
            centered={true}
            open={open}
            width="672px"
            onCancel={() => setOpen(false)}
        >
            <div className="m-auto hidden h-[124px] w-[124px] flex-shrink-0 translate-y-[-65px] items-center justify-center rounded-[50%] bg-white drop-shadow-[8px_8px_15px_rgba(0,0,0,0.15)] md:flex">
                <img
                    className="h-[116px] w-[116px] rounded-[50%]"
                    src={cdn(
                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691906508356_shiku_twitter_logo_v2 1.png',
                    )}
                    alt=""
                />
            </div>
            <div className="flex flex-col items-center justify-between border-b border-solid border-[#F6F6F6] px-[10px] pb-[40px] md:flex-row">
                <div
                    className="h-[239px] w-[237px] flex-shrink-0 rounded-[16px] bg-[#161717] bg-[length:220px_220px] bg-center"
                    style={{
                        backgroundImage: `url(${cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/shiku-cover-img.png',
                        )})`,
                    }}
                ></div>
                <div>
                    <div className="w-[323px] border-b border-solid border-black/30 pb-[21px] font-inter-semibold text-[26px] text-black">
                        Planet Earth {'  '} {name}
                    </div>
                    <div className="text-[rgba(141, 141, 141, 0.80)] font-inter-normal mb-[7px] mt-[16px] text-[16px]">
                        Price m²
                    </div>
                    <div className="flex w-[323px] items-center border-b border-solid border-black/30 pb-[18px] font-inter-semibold text-[16px] text-[#003541]">
                        <img
                            className="mr-[8px] block h-[14px] w-[14px]"
                            src={cdn(
                                // FIXME CYY OGY图片
                                token?.symbol === 'OGY'
                                    ? 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691397017738_Group 632393.svg'
                                    : 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691397017738_Group 632393.svg',
                            )}
                            alt=""
                        />
                        <TokenPrice
                            value={{
                                value: price ? exponentNumber(price, -4) : undefined,
                                token,
                                symbol: ' ',
                                thousand: { comma: true },
                            }}
                            className="text-[16px]"
                        />{' '}
                        &nbsp;{token?.symbol ?? 'ICP'}/m² x10,000m²
                    </div>
                    <div className="mt-[28px] flex items-center">
                        <div className="text-[rgba(141, 141, 141, 0.80)] font-inter-normal text-[16px]">
                            Total
                        </div>
                        <img
                            className="ml-[18px] mr-[5px] block h-[24px] w-[24px]"
                            src={cdn(
                                // FIXME CYY OGY图片
                                token?.symbol === 'OGY'
                                    ? 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691397017738_Group 632393.svg'
                                    : 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691397017738_Group 632393.svg',
                            )}
                            alt=""
                        />
                        <div className="font-inter-extrabold text-[18px] text-[#003541] md:text-[30px]">
                            <TokenPrice
                                value={{
                                    value: price,
                                    token,
                                    symbol: '',
                                    thousand: { comma: true },
                                }}
                                className="text-[18px] md:text-[30px]"
                            />{' '}
                            {token?.symbol ?? 'ICP'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[14px] flex flex-col items-center justify-between md:flex-row">
                <Checkbox onChange={onAcceptChange} checked={accept} className="shiku-checkbox">
                    <div className="flex items-center font-inter-light text-[14px] text-[#151515]">
                        I accept
                        <Link
                            to={`https://yuminftmarketplace.gitbook.io/yumi-docs/legal/shiku-metaverse-land-plots-nfts-purchase-terms`}
                            target="_blank"
                            className="ml-[4px] cursor-pointer underline"
                        >
                            term and conditions
                        </Link>
                    </div>
                </Checkbox>
                <Button
                    className="mt-[10px] !h-[61px] !w-full !rounded-[8px] bg-[#0A0909] !p-0 text-center font-inter-semibold text-[16px] leading-[61px] text-white md:mt-0 md:!w-[190px]"
                    loading={loading}
                    onClick={onSubmit}
                >
                    Confirm
                </Button>
            </div>
        </Modal>
    );
}

export default ShikuLandsNftBuyModal;

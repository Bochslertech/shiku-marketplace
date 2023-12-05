import { Tooltip } from 'antd';
import { NftListingData } from '@/01_types/listing';
import { cdn } from '@/02_common/cdn';
import { useShikuAuctionCountdown } from '@/08_hooks/interval/shiku';
import { ShikuNftState } from '@/08_hooks/views/shiku';

function ShikuLandsNftAuctioningCountdown({
    listing,
    state,
}: {
    listing: NftListingData | undefined;
    state: ShikuNftState;
}) {
    const { remain: auctionRemain, countdown } = useShikuAuctionCountdown(listing, state);

    return auctionRemain && ['Auctioning'].includes(state ?? '') ? (
        <Tooltip
            placement="bottom"
            trigger="hover"
            overlayClassName="shiku-wrap-tips"
            title="Remaining time to auction end"
        >
            <div className="mb-[9px] ml-auto flex h-[30px] w-[103px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[100px] bg-[#003541] font-inter-extrabold text-[13px] text-white">
                <img
                    className="mr-[5px] h-[15px] w-[15px]"
                    src={cdn(
                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691834225902_clock_icon.svg',
                    )}
                    alt=""
                />
                {countdown}
            </div>
        </Tooltip>
    ) : (
        <></>
    );
}

export default ShikuLandsNftAuctioningCountdown;

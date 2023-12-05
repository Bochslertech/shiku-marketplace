import { cdn } from '@/02_common/cdn';

function TipText() {
    return (
        <div>
            <div className="mb-[22px]">
                <img
                    className="float-left mr-[4px] mt-[4px] h-[16px] w-[16px]"
                    src={cdn(
                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691852335074_vuesax_outline_wallet-add.svg',
                    )}
                    alt=""
                />
                <div>
                    10% of the land NFT sale revenue will be evenly distributed to the existing land
                    owners
                </div>
            </div>
            <div>
                <img
                    className="float-left mr-[4px] mt-[4px] h-[16px] w-[16px]"
                    src={cdn(
                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691852335080_vuesax_outline_global-refresh.svg',
                    )}
                    alt=""
                />
                The secondary land market will be open when all the 100 land parcels on the first
                planet are sold out
            </div>
        </div>
    );
}

export default TipText;

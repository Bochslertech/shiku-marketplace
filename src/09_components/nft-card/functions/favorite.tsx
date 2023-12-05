import { ConnectedIdentity } from '@/01_types/identity';
import { NftMetadata } from '@/01_types/nft';
import { preventLink } from '@/02_common/react/link';
import { useNftFavorite } from '@/08_hooks/nft/favorited';
import YumiIcon from '@/09_components/ui/yumi-icon';

function FavoriteButton({ card }: { card: NftMetadata; identity?: ConnectedIdentity }) {
    const { favorited, toggle, action } = useNftFavorite(card.metadata.token_id);

    // 取消收藏 NFT
    const onChange = async () => {
        toggle();
    };

    // if (!identity || favorited === undefined) return <></>; // 没登录不显示
    return (
        <div className="absolute bottom-[7px] right-[7px] z-40 hidden h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-[18px] bg-black/25  group-hover:flex ">
            <span onClick={preventLink(onChange)}>
                {action === undefined && favorited ? (
                    <YumiIcon
                        name="heart-fill"
                        size={14}
                        color="white"
                        className="visible h-auto w-full scale-75 rounded-[8px]"
                    />
                ) : (
                    <YumiIcon
                        name="heart"
                        size={14}
                        color="white"
                        className="visible h-auto w-full scale-75 rounded-[8px]"
                    />
                )}
                {action === 'DOING' && <span>变更中</span>}
                {action === 'CHANGING' && !favorited && <span>收藏中</span>}
                {action === 'CHANGING' && favorited && <span>取消收藏中</span>}
            </span>
        </div>
    );
}

export default FavoriteButton;

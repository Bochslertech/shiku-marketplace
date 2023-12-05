import { useCallback, useState } from 'react';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftMetadata } from '@/01_types/nft';
import { NFTOwnable, NftTicketOwnedData } from '@/01_types/yumi-standard/ticket';
import { preventLink } from '@/02_common/react/link';
import { unwrapVariantKey } from '@/02_common/types/variant';
import { queryNftTicketStatus } from '@/03_canisters/nft/nft_ext/ext_ticket';
import { useShowTicketButton } from '@/08_hooks/nft/functions/ticket';
import YumiIcon from '@/09_components/ui/yumi-icon';
import message from '../../message';
import TicketModal from '../components/ticket';

function TicketButton({
    card,
    identity,
    className,
}: {
    card: NftMetadata;
    identity?: ConnectedIdentity;
    className?: string;
}) {
    const tickedData = useShowTicketButton(card);

    const [owned, setOwned] = useState<NftTicketOwnedData | undefined>(undefined);

    // 获取数据
    const [loading, setLoading] = useState<boolean>(false);
    const onOpen = useCallback(() => {
        if (!identity) return;
        if (!tickedData) return;
        if (loading) return;
        // 尝试获取数据
        setLoading(true);
        // message.loading('query ticket data'); // 出现错误立即关闭, 正确则在弹窗出关闭
        queryNftTicketStatus(identity, card.owner.token_id.collection, card.owner.token_id)
            .then((data) => {
                const status = unwrapVariantKey<
                    'NoBody' | 'InvalidToken' | 'Forbidden' | 'Owner' | 'Anonymous'
                >(data);
                if (['Owner', 'Anonymous'].includes(status)) {
                    // 这 2 种情况有数据, 可以打开查看
                    const ownable: { List: Array<NFTOwnable> } = data[status][1];
                    // 规定一定是 list. 最核心的数据一定是第一个
                    let owned: string | undefined = undefined;
                    if (ownable.List.length === 0) owned = '';
                    else if (tickedData.project === 'ICP x EthCC NFT')
                        owned = (ownable.List[1] as { Text: string }).Text; // ! 特例
                    else owned = (ownable.List[0] as { Text: string }).Text;
                    return setOwned({
                        type: tickedData.type,
                        project: tickedData.project,
                        owned,
                        status,
                        data,
                    });
                }
                throw new Error('can not find data');
            })
            .catch((e) => {
                message.destroy();
                console.error('queryNftTicketStatus', e);
                message.error('query ticket data failed');
            })
            .finally(() => setLoading(false));
    }, [identity, tickedData, loading]);

    const onCleanOwned = () => setOwned(undefined);

    if (!tickedData || !identity) return <></>;
    return (
        <>
            <YumiIcon
                name="nft-ticket"
                color="#999999"
                size={15}
                className={className}
                onClick={preventLink(onOpen)}
            />
            {owned && <TicketModal data={owned} onClose={onCleanOwned} />}
        </>
    );
}

export default TicketButton;

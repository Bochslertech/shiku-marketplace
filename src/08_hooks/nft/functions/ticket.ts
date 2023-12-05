import { useEffect, useState } from 'react';
import { NftMetadata } from '@/01_types/nft';
import {
    NftTicketMetadata,
    NftTicketProject,
    NftTicketType,
    SUPPORTED_NFT_TICKET_TYPES,
} from '@/01_types/yumi-standard/ticket';
import { useIdentityStore } from '@/07_stores/identity';

export const useShowTicketButton = (
    card: NftMetadata | undefined,
): NftTicketMetadata | undefined => {
    const [data, setData] = useState<NftTicketMetadata | undefined>(undefined);

    // self
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const self = !!identity && !!card && card.owner.owner === identity.account;

    useEffect(() => {
        setData(() => {
            if (card === undefined) return undefined; // 没有数据不显示
            if (identity === undefined) return undefined; // 没有登录不能打开
            if (!self) return undefined; // 非自己的不能打开

            const metadata_raw = card.metadata.raw.data;
            if (
                !metadata_raw ||
                typeof metadata_raw !== 'string' ||
                !metadata_raw.startsWith('{') ||
                !metadata_raw.endsWith('}')
            )
                return undefined;
            // 取出数据
            let json: { yumi_traits?: { name: string; value: string }[] } = {};
            try {
                json = JSON.parse(metadata_raw);
            } catch {
                console.error('can not parse metadata raw data', card, metadata_raw);
            }
            if (!json.yumi_traits) return undefined;
            const type = json.yumi_traits.find((c) => c.name === 'ticket')?.value;
            const project = json.yumi_traits.find((c) => c.name === 'project')?.value;
            if (!type || !project) return undefined;
            if (!SUPPORTED_NFT_TICKET_TYPES.includes(type)) return undefined;

            return {
                type: type as NftTicketType,
                project: project as NftTicketProject,
            };
        });
    }, [card, identity, self]);

    return data;
};

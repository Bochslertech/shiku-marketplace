import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { isCanisterIdText } from '@/02_common/ic/principals';
import { FirstRender } from '@/02_common/react/render';
import { GoldActivityType } from '@/04_apis/yumi/gold-api';
import { queryGoldActivities } from '@/05_utils/apis/yumi/gold-api';
import { getTokenOwners } from '@/05_utils/combined/collection';
import { useDeviceStore } from '@/07_stores/device';
import { useGoldCollectionNftMetadata } from '@/08_hooks/views/gold';
import TableList from '../market/tabs/components/table-list';
import LeftImage from './components/nft-info';
import NftOption from './components/nft-option';
import style from './index.module.less';

function GoldNft() {
    const navigate = useNavigate();
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);
    const { collection, token_identifier } = useParams(); // 获取参数

    // 检查 collection 对不对
    // 判断一下 token_identifier 对不对
    const [once_check_collection] = useState(new FirstRender());
    useEffect(
        once_check_collection.once(() => {
            if (!isCanisterIdText(collection)) return navigate('/', { replace: true });
            if (token_identifier === undefined)
                return navigate(`/market/${collection}`, { replace: true });
            getTokenOwners(collection!, 'stored_remote').then((token_owners) => {
                if (token_owners) {
                    const owner = token_owners.find(
                        (o) => o.token_id.token_identifier === token_identifier,
                    );
                    if (owner === undefined) {
                        message.error(`wrong token_identifier`);
                        return navigate(`/gold`, { replace: true });
                    }
                }
            });
        }),
        [],
    );

    const { card, refreshCard } = useGoldCollectionNftMetadata(collection, token_identifier);

    const [activityList, setActivityList] = useState<GoldActivityType[] | undefined>(undefined);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(20);

    useEffect(() => {
        if (collection === undefined || token_identifier === undefined) return;
        queryGoldActivities(collection, token_identifier, page + 1, size)
            .then((d) => {
                setTotal(d.total);
                setActivityList(d.list);
            })
            .catch((e) => {
                console.error('queryGoldActivities', collection, token_identifier, page, size, e);
                message.error(`query nft activity failed`);
            });
    }, [collection, token_identifier, page, size]);
    return (
        <div
            className={`${style['gold-details']} m-auto max-w-[1440px] lg:pl-[110px] lg:pr-[157px] lg:pt-[57px]`}
        >
            <div className="flex">
                <LeftImage card={card} refreshCard={refreshCard} refreshListing={refreshCard} />
                {!isMobile ? (
                    <NftOption card={card} refreshCard={refreshCard} refreshListing={refreshCard} />
                ) : (
                    ''
                )}
            </div>
            <TableList
                list={activityList}
                total={total}
                setPage={(number: number) => setPage(number)}
            />
        </div>
    );
}

export default GoldNft;

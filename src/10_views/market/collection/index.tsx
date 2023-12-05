import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/02_common/cn';
import { isCanisterIdText } from '@/02_common/ic/principals';
import { FirstRenderByData } from '@/02_common/react/render';
import { Spend } from '@/02_common/react/spend';
import { useCollectionData, useCollectionTokenOwners } from '@/08_hooks/views/market';
import MarketCollectionActivity from './components/activity';
import MarketCollectionHeader from './components/header';
import MarketCollectionItems from './components/items';

function MarketCollectionPage() {
    const navigate = useNavigate();

    const param = useParams(); // 获取参数
    const collection = param.collection;

    // 检查 collection 对不对
    const [once_check_collection] = useState(new FirstRenderByData());
    useEffect(
        () =>
            once_check_collection.once([collection], () => {
                if (!isCanisterIdText(collection)) return navigate('/', { replace: true });
            }),
        [collection],
    );
    // 集合元数据信息
    const data = useCollectionData(collection);
    const [once_check_data_spend] = useState(new FirstRenderByData());
    const [spend_data] = useState(Spend.start(`market collection index !!!!!!!!!!!!!!!`));
    useEffect(() => {
        once_check_data_spend.once([!!data], () => {
            spend_data.mark(`data is ${data ? 'exist' : 'not exist'}`);
        });
    }, [data]);

    // 集合内所有Token的所有者信息
    const owners = useCollectionTokenOwners(collection, data);
    const [once_check_owners] = useState(new FirstRenderByData());
    const [spend_owners] = useState(Spend.start(`market collection index @@@@@@@@@@@@@@@`));
    useEffect(() => {
        once_check_owners.once(data && [(owners ?? []).length], () => {
            spend_owners.mark(`owners is ${owners?.length} data ${data ? 'exist' : 'not exist'}`);
        });
    }, [data, owners]);

    const [tab, setTab] = useState<'items' | 'activity'>('items');

    if (!isCanisterIdText(collection)) return <></>;
    return (
        <>
            <div className="market-collection">
                <MarketCollectionHeader data={data} owners={owners} />
                <div className="mx-[15px] flex items-center border-b border-solid border-[#DDD] md:mx-[40px]">
                    <div
                        className={cn([
                            'mr-[37px] cursor-pointer pb-[20px] font-inter-bold text-[18px] text-[#999]',
                            tab === 'items' &&
                                'border-b-[3px] border-solid border-black pb-[17px] text-black',
                        ])}
                        onClick={() => setTab('items')}
                    >
                        Items
                    </div>
                    <div
                        className={cn([
                            'cursor-pointer pb-[20px] font-inter-bold  text-[18px] text-[#999]',
                            tab === 'activity' &&
                                'border-b-[3px] border-solid border-black pb-[17px] text-black',
                        ])}
                        onClick={() => setTab('activity')}
                    >
                        Activity
                    </div>
                </div>
                {tab === 'items' &&
                    (collection === undefined || data === undefined || owners === undefined) && (
                        <div></div>
                    )}
                {tab === 'items' && (
                    <MarketCollectionItems
                        collection={collection!}
                        data={data!}
                        owners={owners!}
                        loading={
                            !(
                                collection !== undefined &&
                                data !== undefined &&
                                owners !== undefined
                            )
                        }
                    />
                )}
                {tab === 'activity' && collection === undefined && <div></div>}
                {tab === 'activity' && collection !== undefined && (
                    <MarketCollectionActivity collection={collection} data={data} />
                )}
            </div>
        </>
    );
}

export default MarketCollectionPage;

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { message, Skeleton } from 'antd';
import { cdn } from '@/02_common/cdn';
import { thousandCommaOnlyInteger } from '@/02_common/data/numbers';
import { parseLowerCaseSearch } from '@/02_common/data/search';
import { OgyTokenActive } from '@/03_canisters/nft/nft_ogy';
import { OrigynArtCollectionData } from '@/03_canisters/yumi/yumi_origyn_art';
import { queryTokenActiveRecordsByOgy } from '@/05_utils/canisters/nft/ogy';
import { getYumiOrigynArtCanisterId } from '@/05_utils/canisters/yumi/special';
import {
    combinedQueryOrigynArtCollectionDataList,
    combinedQueryOrigynArtCollectionIdList,
} from '@/05_utils/combined/yumi/origyn-art';
import FilterSearch from '@/09_components/nft-card/filter/search';
import Empty from '@/09_components/ui/empty';

function OrigynArtMarketPage() {
    const [list, setList] = useState<OrigynArtCollectionData[] | undefined>(undefined);

    const backend_canister_id = getYumiOrigynArtCanisterId();
    useEffect(() => {
        Promise.all([
            combinedQueryOrigynArtCollectionIdList(backend_canister_id),
            combinedQueryOrigynArtCollectionDataList(backend_canister_id),
        ])
            .then((d) => {
                const [id_list, data_list] = d;
                setList(data_list.filter((item) => id_list.includes(item.collection)));
            })
            .catch((e) => {
                console.debug(`🚀 ~ file: index.tsx:77 ~ useEffect ~ e:`, e);
                message.error(`load message failed`);
                setList([]);
            });
    }, []);

    // 过滤条件
    const [search, setSearch] = useState('');

    const s = parseLowerCaseSearch(search);
    const filteredList = list?.filter(
        (item) => !s || item.metadata.name.toLowerCase().indexOf(s) > -1,
    );

    return (
        <>
            <div className="flex flex-col">
                <div className="relative h-[120px] items-center overflow-hidden bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1666780981741_origyn-home-bg.png')] bg-[length:100%_auto] bg-center md:h-[260px]">
                    <p className="absolute left-0 top-0 flex h-full w-full items-center justify-center font-[Montserrat-Bold] text-[35px] text-[#151515] md:text-[70px]">
                        MARKETPLACE
                    </p>
                </div>
            </div>
            <div className="mx-auto flex w-full max-w-[1200px] flex-col">
                <div className="mx-5 flex flex-col md:mx-0">
                    <div className="mt-[30px] flex h-12 flex-1 flex-shrink-0 flex-col md:flex-row">
                        <FilterSearch
                            className={'ml-[0px] mr-[0px] w-full flex-1 md:mr-[27px] md:w-auto'}
                            search={search}
                            setSearch={setSearch}
                        />
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-[20px] flex w-full max-w-[1200px] flex-col">
                <div className=" mx-5 text-[18px] leading-[23px] text-[#0009] md:mx-0">
                    {(filteredList && filteredList.length) || 0} Items
                </div>
                <div className="mx-5 mb-5 flex flex-col md:mx-0">
                    {filteredList && filteredList.length === 0 && <Empty />}

                    <div className="mt-4 grid h-full grid-cols-1 gap-x-[15px] gap-y-[15px] md:mt-7 md:grid-cols-3 md:gap-x-[33px] md:gap-y-[25px] ">
                        {!filteredList && [''].map((_, index) => <ItemSkeleton key={index} />)}
                        {filteredList &&
                            filteredList.length > 0 &&
                            filteredList.map((item) => <Item key={item.collection} item={item} />)}
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrigynArtMarketPage;

function ItemSkeleton() {
    return (
        <div className="flex flex-col rounded-[5px] border border-[#e5e5e5] duration-150 hover:shadow-lg">
            <div className="flex h-[265px] items-center justify-center bg-[#c5b3580f] p-[25px]">
                <Skeleton.Image className="!h-full !w-full" />
            </div>
            <div className="mx-[20px] my-[10px] flex flex-col border-b border-[#D8D8D8] pb-[10px]">
                <div className="text-[24px] font-bold italic leading-[30px]">
                    <Skeleton.Input className="!h-full !w-full" />
                </div>
                <div className="mt-3">
                    <Skeleton.Input className="!h-full !w-[50%]" />
                </div>
            </div>
            <div className="mx-[20px] flex">
                <div className="flex flex-1 flex-col">
                    <div className="flex h-[20px]">
                        <Skeleton.Input className="!h-full !w-[50%]" />
                    </div>
                    <div className="mt-3 flex h-[20px]">
                        <Skeleton.Input className="!h-full !w-[50%]" />
                    </div>
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="flex h-[20px]">
                        <Skeleton.Input className="!h-full !w-[50%]" />
                    </div>
                    <div className="mt-3 flex h-[20px]">
                        <Skeleton.Input className="!h-full !w-[50%]" />
                    </div>
                </div>
            </div>
            <div className="mx-[20px] mb-[30px] mt-[12px] flex h-[37px] cursor-pointer items-center justify-center text-[#fff]">
                <Skeleton.Button className="!h-full !w-full" />
            </div>
        </div>
    );
}

function Item({ item }: { item: OrigynArtCollectionData }) {
    const { t } = useTranslation();

    const [active, setActive] = useState<OgyTokenActive | undefined>(undefined);

    useEffect(() => {
        queryTokenActiveRecordsByOgy(item.collection).then(setActive);
    }, [item]);

    const sale = useMemo(() => {
        if (active === undefined) return undefined;
        return active.records.filter((item) => {
            const sale = item.sale;
            if (sale === undefined) return false;
            const json = JSON.parse(sale.sale_type);
            return json.auction?.status.open === null;
        }).length;
    }, [active]);

    return (
        <Link
            to={`/origyn/art/${item.collection}`}
            className="flex flex-col rounded-[5px] border border-[#e5e5e5] duration-150 hover:shadow-lg"
        >
            <div className="flex h-[265px] items-center justify-center bg-[#c5b3580f] p-[25px]">
                <img className="h-full" src={cdn(item.metadata.coverImage)} alt="" />
            </div>
            <div className="mx-[20px] my-[10px] flex flex-col border-b border-[#D8D8D8] pb-[10px]">
                <p className="line-clamp-2 font-[Inter-Bold] text-[24px] font-bold italic leading-[30px] md:h-[60px]">
                    {item.metadata.name}
                </p>
                <p className="mt-3 text-[15px] font-semibold text-[#000]">
                    {item.metadata.artAuthor} ({item.metadata.authorBirth})
                </p>
            </div>
            <div className="mx-[20px] flex">
                <div className="flex flex-1 flex-col">
                    <p className="flex text-[14px] text-[#151515]">{t('owned.market.total')}</p>
                    <p className="flex font-inter-semibold text-[14px] text-[#151515]">1000</p>
                </div>
                <div className="flex flex-1 flex-col">
                    <p className="flex text-[14px] text-[#151515]">{t('owned.market.sale')}</p>
                    <p className="flex font-inter-semibold text-[14px] text-[#151515]">
                        {sale !== undefined ? thousandCommaOnlyInteger(`${sale}`) : undefined}
                    </p>
                </div>
            </div>
            <div className="mx-[20px] mb-[30px] mt-[12px] flex h-[37px] cursor-pointer items-center justify-center bg-[#0B140C] font-inter-bold text-[14px] text-[#fff]">
                {t('owned.market.buy')}
            </div>
        </Link>
    );
}

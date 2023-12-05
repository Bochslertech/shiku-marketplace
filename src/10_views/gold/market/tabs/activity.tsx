import { useEffect, useState } from 'react';
import { GoldActivityType } from '@/04_apis/yumi/gold-api';
import { queryGoldActivities } from '@/05_utils/apis/yumi/gold-api';
import DashBoard from './components/dash-board';
import TableList from './components/table-list';

function Activity() {
    const [list, setList] = useState<GoldActivityType[]>([]);
    const [total, setTotal] = useState(0);
    const pageSize = 20;
    const getActivity = (page: number) => {
        if (page === 1) setList([]);
        queryGoldActivities('', '', page, pageSize).then((res) => {
            // console.debug(`🚀 ~ file: activity.tsx:19 ~ queryGoldActivities ~ res:`, res);
            setTotal(res.total);
            setList(res.list);
        });
    };

    // useEffect(() => getActivity(page), [page]);
    useEffect(() => {
        getActivity(1);
    }, []);
    return (
        <div className="relative mx-auto w-full px-[4px]">
            <DashBoard />
            <TableList
                list={list}
                total={total}
                setPage={(number: number) => getActivity(number + 1)}
            />
        </div>
    );
}

export default Activity;

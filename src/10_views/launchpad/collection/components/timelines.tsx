import { Skeleton, Timeline } from 'antd';
import { formatDateByNano } from '@/02_common/data/dates';
import { exponentNumber } from '@/02_common/data/numbers';
import { LaunchpadCollectionInfo } from '@/03_canisters/yumi/yumi_launchpad/index';

export const LaunchpadProjectTimelines = ({ info }: { info: LaunchpadCollectionInfo }) => {
    const { whitelist_start, whitelist_end, open_start, open_end } = info;
    const items = [
        {
            color: 'gray',
            children: (
                <div className="mb-[15px] flex flex-col">
                    <h2 className="mb-3 text-[16px] font-semibold text-stress">
                        Whitelist Sale Info
                    </h2>
                    <p className="mb-[13px] text-[14px] text-symbol">
                        Starts: {formatDateByNano(whitelist_start)}
                    </p>
                    <p className="mb-[13px] text-[14px] text-symbol">
                        Ends: {formatDateByNano(whitelist_end)}
                    </p>
                    <p className="mb-[13px] text-[14px] text-symbol">
                        NFT amount: {info.whitelist_supply}
                    </p>
                    <p className="mb-[13px] text-[14px] text-symbol">
                        Price: {exponentNumber(info.whitelist_price, -8)} ICP
                    </p>
                    <p className="mb-[13px] text-[14px] text-symbol">
                        Limit: {info.whitelist_limit}
                    </p>
                </div>
            ),
        },
        {
            color: 'gray',
            children: (
                <div className="mb-[15px] flex flex-col">
                    <h2 className="mb-3 text-[16px] font-semibold text-stress">Public Sale Info</h2>
                    <p className="mb-[13px] text-[14px] text-symbol">
                        Starts: {formatDateByNano(open_start)}
                    </p>
                    <p className="mb-[13px] text-[14px] text-symbol">
                        Ends: {formatDateByNano(open_end)}
                    </p>
                    <p className="mb-[13px] text-[14px] text-symbol">
                        NFT amount: {info.open_supply}
                    </p>
                    <p className="mb-[13px] text-[14px] text-symbol">
                        Price: {exponentNumber(info.open_price, -8)} ICP
                    </p>
                    <p className="mb-[13px] text-[14px] text-symbol">
                        Limit: {info.open_limit === undefined ? 'No Limit' : info.open_limit}
                    </p>
                </div>
            ),
        },
        // {
        //     color: 'gray',
        //     children: (
        //         <div className="mb-[15px] flex flex-col">
        //             <h2 className="mb-3 text-[14px] font-semibold text-stress">
        //                 Whitelist Sale Info
        //             </h2>
        //             <p className="mb-[13px] text-[12px] text-symbol">Technical testing 2</p>
        //             <p className="mb-[13px] text-[12px] text-symbol">
        //                 Technical testing 3 2015-09-01
        //             </p>
        //         </div>
        //     ),
        // },
    ];

    return (
        <>
            <Timeline items={items} />
        </>
    );
};

export const LaunchpadProjectTimelinesSkeleton = () => {
    const item = {
        color: 'gray',
        children: (
            <div className="mb-[15px] flex flex-col">
                <Skeleton.Input className="mb-1 ml-3 !h-4 !w-[180px] !min-w-0 md:mb-2" />
                <Skeleton.Input className="mb-1 ml-3 !h-4 !w-[180px] !min-w-0 md:mb-2" />
                <Skeleton.Input className="ml-3 !h-4 !w-[180px] !min-w-0" />
            </div>
        ),
    };
    const items: { color: string; children: any }[] = [];
    for (let i = 0; i < 3; i++) {
        items.push(item);
    }

    return (
        <>
            <Timeline items={items} />
        </>
    );
};

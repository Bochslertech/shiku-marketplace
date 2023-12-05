import { sinceNowByByNano } from '@/02_common/data/dates';
import { shrinkPrincipal } from '@/02_common/data/text';
import { isCanisterIdText } from '@/02_common/ic/principals';
import { CollectionNftEvent } from '@/04_apis/yumi/aws';
import TokenPrice from '@/09_components/data/price';
import Usd from '@/09_components/data/usd';
import Username from '@/09_components/user/username';

function NftActivities({ current }: { current: CollectionNftEvent[] | undefined }) {
    return (
        <div className="w-full flex-shrink-0 lg:rounded-[16px] lg:border-2 lg:border-solid lg:border-[#E7E7E7] lg:px-[48px] lg:pb-[25px] lg:pt-[34px]">
            {current &&
                current.map((event) => (
                    <div key={event.index} className="list-0 mb-[24px] flex text-left lg:mb-[35px]">
                        <div className="mr-[10px] min-w-[100px] font-inter-semibold text-[14px] text-black lg:w-[20%]">
                            {showEventType(event.type)}
                        </div>
                        <div className="mr-[10px] flex min-w-[100px] items-end lg:w-[20%]">
                            <span className="font-inter-semibold text-[14px] text-black">
                                <TokenPrice
                                    value={{
                                        value: event.price,
                                        decimals: { type: 'exponent', value: 8 },
                                        paddingEnd: 2,
                                    }}
                                />
                            </span>
                            <span className="ml-[3px] font-inter-bold text-[12px] text-symbol">
                                ICP
                            </span>
                            <span className="hidden font-inter-medium text-[14px] text-symbol lg:block">
                                {/* ≈ */}
                                <Usd
                                    value={{
                                        value: event.price,
                                        decimals: { type: 'exponent', value: 8 },
                                        symbol: 'ICP',
                                        scale: 2,
                                    }}
                                />
                            </span>
                        </div>
                        <div className="mr-[10px] min-w-[100px] font-inter-medium text-[14px] text-[#2B2929] lg:w-[20%]">
                            {isCanisterIdText(event.from) ? (
                                <span>@{shrinkPrincipal(event.from)}</span>
                            ) : (
                                <span>
                                    @<Username principal_or_account={event.from} />
                                </span>
                            )}
                        </div>
                        <div className="mr-[10px] min-w-[100px] font-inter-medium text-[14px] text-[#2B2929] lg:w-[20%]">
                            {isCanisterIdText(event.to) ? (
                                <span>@{event.to}</span>
                            ) : (
                                <span>
                                    @<Username principal_or_account={event.to} />
                                </span>
                            )}
                        </div>
                        <div className="mr-[10px] min-w-[100px] font-inter-medium text-[14px] text-stress lg:w-[20%]">
                            {sinceNowByByNano(event.created)}
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default NftActivities;

const showEventType = (type: string) => {
    switch (type) {
        case 'sale':
            return 'Sale';
        case 'sold':
            return 'Sale';
        case 'claim':
            return 'Claim';
    }
    return type;
};

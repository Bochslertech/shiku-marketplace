import { NftMetadata } from '@/01_types/nft';
import { cn } from '@/02_common/cn';
import { uniqueKey } from '@/02_common/nft/identifier';
import NftCard, { NftCardMode, NftCardSkeleton } from '../nft-card';

// 要展示多少行
export const ROWS = 10;

const WrappedCards = ({
    mode,
    current,
    refreshList,
    updateItem,
    size,
}: {
    mode: NftCardMode;
    current: NftMetadata[] | undefined;
    refreshList?: () => void;
    updateItem?: (item: NftMetadata) => void;
    size?: number;
}) => {
    return (
        <>
            <div className="w-full @container">
                <div
                    className={cn(
                        'grid grid-cols-2 gap-3 px-0  @md:grid-cols-5 @md:gap-2.5 @lg:grid-cols-7 @2xl:grid-cols-10',
                        mode === ':market:middle' &&
                            '@md:grid-cols-4  @lg:grid-cols-6 @2xl:grid-cols-8',
                    )}
                >
                    {!current &&
                        size &&
                        new Array(size).fill('').map((_, index) => (
                            <div key={index} className="mb-[20px] w-full">
                                <NftCardSkeleton />
                            </div>
                        ))}
                    {current &&
                        current.map((card) => (
                            <div className="mb-[20px] w-full" key={uniqueKey(card.owner.token_id)}>
                                <NftCard
                                    mode={mode}
                                    card={card}
                                    refreshList={refreshList}
                                    updateItem={updateItem}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export const SlicedCardsByProfile = ({
    current,
    refreshList,
    updateItem,
    size,
}: {
    current: NftMetadata[] | undefined;
    refreshList?: () => void;
    updateItem?: (item: NftMetadata) => void;
    size?: number;
}) => {
    return WrappedCards({
        mode: ':profile',
        current,
        refreshList,
        updateItem,
        size,
    });
};

export const SlicedCardsByMarketMiddle = ({
    current,
    refreshList,
    updateItem,
    size,
}: {
    current: NftMetadata[] | undefined;
    refreshList?: () => void;
    updateItem?: (item: NftMetadata) => void;
    size?: number;
}) => {
    return WrappedCards({
        mode: ':market:middle',
        current,
        refreshList,
        updateItem,
        size,
    });
};

export const SlicedCardsByMarketSmall = ({
    current,
    refreshList,
    updateItem,
    size,
}: {
    current: NftMetadata[] | undefined;
    refreshList?: () => void;
    updateItem?: (item: NftMetadata) => void;
    size?: number;
}) => {
    return WrappedCards({
        mode: ':market:small',
        current,
        refreshList,
        updateItem,
        size,
    });
};

export const SlicedCardsByGold = ({
    current,
    refreshList,
    updateItem,
    size,
}: {
    current: NftMetadata[] | undefined;
    refreshList?: () => void;
    updateItem?: (item: NftMetadata) => void;
    size?: number;
}) => {
    return WrappedCards({
        mode: ':gold',
        current,
        refreshList,
        updateItem,
        size,
    });
};

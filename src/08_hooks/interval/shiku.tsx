import { useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { NftListingData } from '@/01_types/listing';
import { TokenInfo } from '@/01_types/nft';
import { MILLISECONDS_DAY, MILLISECONDS_HOUR, MILLISECONDS_MINUTE } from '@/02_common/data/dates';
import { ShikuNftState } from '../views/shiku';

export const useShikuNotStartedCountdown = (
    listing: NftListingData | undefined,
): { days?: string; hours?: string; minutes?: string; seconds?: string } => {
    const [remain, setRemain] = useState<number | undefined>(undefined);

    useInterval(() => {
        setRemain(() => {
            if (listing === undefined) return undefined;
            if (listing.listing.type !== 'dutch') return undefined;
            const remain =
                Number(`${BigInt(listing.listing.auction.time.start) / BigInt(1e6)}`) - Date.now();
            return remain;
        });
    }, 233);

    const r: { days?: string; hours?: string; minutes?: string; seconds?: string } = useMemo(() => {
        if (remain === undefined || remain < 0) return {};
        let seconds = remain;
        const days = Math.floor(seconds / MILLISECONDS_DAY);
        seconds -= MILLISECONDS_DAY * days;
        const hours = Math.floor(seconds / MILLISECONDS_HOUR);
        seconds -= MILLISECONDS_HOUR * hours;
        const minutes = Math.floor(seconds / MILLISECONDS_MINUTE);
        seconds -= MILLISECONDS_MINUTE * minutes;
        seconds = Math.floor(seconds / 1e3);
        return {
            days: `${days}`,
            hours: hours < 10 ? `0${hours}` : `${hours}`,
            minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
            seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
        };
    }, [remain]);

    return r;
};

export const useShikuAuctionCountdown = (
    listing: NftListingData | undefined,
    state: ShikuNftState,
): {
    remain: number | undefined;
    countdown: string;
} => {
    const [remain, setRemain] = useState<number | undefined>(undefined);
    useInterval(() => {
        if (state !== 'Auctioning') return;
        setRemain(() => {
            if (listing === undefined) return undefined;
            if (listing.listing.type !== 'dutch') return undefined;
            const remain =
                Number(`${BigInt(listing.listing.auction.time.end) / BigInt(1e6)}`) - Date.now();
            return remain;
        });
    }, 233);

    const { hours, minutes, seconds }: { hours?: string; minutes?: string; seconds?: string } =
        useMemo(() => {
            if (remain === undefined || remain < 0) return {};
            let seconds = remain;
            const hours = Math.floor(seconds / MILLISECONDS_HOUR);
            seconds -= MILLISECONDS_HOUR * hours;
            const minutes = Math.floor(seconds / MILLISECONDS_MINUTE);
            seconds -= MILLISECONDS_MINUTE * minutes;
            seconds = Math.floor(seconds / 1e3);
            return {
                hours: hours < 10 ? `0${hours}` : `${hours}`,
                minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
                seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
            };
        }, [remain]);

    return { remain, countdown: `${hours ?? '--'}:${minutes ?? '--'}:${seconds ?? '--'}` };
};

export const useShikuAuctioningData = (
    listing: NftListingData | undefined,
): {
    token?: TokenInfo;
    price?: string;
    remain?: number;
    block?: number;
    remainTime?: string;
    reduceTime?: string;
    reducePrice?: string;
    startPrice?: string;
    floorPrice?: string;
} => {
    const [now, setNow] = useState<number>(0);
    useInterval(() => setNow(Date.now() * 1e6), 233);

    const r: {
        token?: TokenInfo;
        price?: string;
        remain?: number;
        block?: number;
        remainTime?: string;
        reduceTime?: string;
        reducePrice?: string;
        startPrice?: string;
        floorPrice?: string;
    } = useMemo(() => {
        if (listing === undefined) return {};
        if (listing.listing.type !== 'dutch') return {};
        const dutch = listing.listing;

        const startPrice = dutch.auction.price.start;
        const floorPrice = dutch.auction.price.floor;
        const reducePrice = dutch.auction.price.reduce;
        const startTime = dutch.auction.time.start;
        const endTime = dutch.auction.time.end;
        const reduceTime = dutch.auction.time.reduce;

        let price = floorPrice;
        let remain = 0;
        let remainTime = '00:00';
        if (now < Number(endTime)) {
            // 计算时间过去的块数
            const blocks = Math.floor((now - Number(startTime)) / Number(reduceTime));
            remain = (blocks + 1) * Number(reduceTime) - (now - Number(startTime));
            price = `${BigInt(startPrice) - BigInt(reducePrice) * BigInt(blocks)}`;
            if (BigInt(price) < BigInt(floorPrice)) price = floorPrice;

            let seconds = remain / 1e6;
            const minutes = Math.floor(seconds / MILLISECONDS_MINUTE);
            seconds -= MILLISECONDS_MINUTE * minutes;
            seconds = Math.floor(seconds / 1e3);
            remainTime = `${(minutes < 10 ? `0${minutes}` : `${minutes}`) ?? '--'}:${
                seconds < 10 ? `0${seconds}` : `${seconds}` ?? '--'
            }`;
        }

        return {
            token: dutch.token,
            price,
            remain,
            block: Number(reduceTime),
            remainTime,
            reduceTime,
            reducePrice,
            startPrice,
            floorPrice,
        };
    }, [listing, now]);

    return r;
};

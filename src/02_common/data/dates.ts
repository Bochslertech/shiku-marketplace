import dayjs from 'dayjs';

// 时间相关的常量
export const MILLISECONDS = 1000; // 秒
export const MILLISECONDS_MINUTE = MILLISECONDS * 60; // 分
export const MILLISECONDS_HOUR = MILLISECONDS_MINUTE * 60; // 时
export const MILLISECONDS_DAY = MILLISECONDS_HOUR * 24; // 天
export const MILLISECONDS_WEEK = MILLISECONDS_DAY * 7; // 周
export const MILLISECONDS_MONTH = MILLISECONDS_DAY * 30; // 月
export const MILLISECONDS_YEAR = MILLISECONDS_DAY * 365; // 年

// 格式化日期
export const formatDateByMills = (mills: number, format: string): string => {
    return dayjs(mills).utc().format(format);
};

// 格式化日期
export const formatDateByNano = (nano: string): string =>
    formatDateByMills(Number(`${BigInt(nano) / BigInt(1e6)}`), 'DD MMM YYYY HH:mm:ss [UTC]');

// 格式化日期
export const formatDateByDate = (date: Date): string =>
    formatDateByMills(date.getTime(), 'YYYY-MM-DD');

// 格式化日期时间
export const formatDateTimeByMills = (mills: number, format: string): string => {
    return dayjs(mills).format(format);
};
// 格式化日期时间
export const formatDateTimeByNano = (nano: string, split: string = '/'): string => {
    return formatDateTimeByMills(
        Number(`${BigInt(nano) / BigInt(1e6)}`),
        `YYYY${split}MM${split}DD HH:mm:ss`,
    );
};

// 距离当前时间
export const sinceNowByMills = (mills: number) => {
    const now = Date.now();
    const delta = now - Number(mills);

    const seconds = Math.floor(delta / MILLISECONDS);
    if (seconds <= 1) return `1 second ago`;
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(delta / MILLISECONDS_MINUTE);
    if (minutes <= 1) return `1 minute ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(delta / MILLISECONDS_HOUR);
    if (hours <= 1) return `an hour ago`;
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(delta / MILLISECONDS_DAY);
    if (days <= 1) return `1 day ago`;
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(delta / MILLISECONDS_WEEK);
    if (weeks <= 1) return `1 week ago`;
    if (weeks < 4) return `${weeks} weeks ago`;
    const months = Math.floor(delta / MILLISECONDS_MONTH);
    if (months <= 1) return `1 month ago`;
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(delta / MILLISECONDS_YEAR);
    if (years <= 1) return `1 year ago`;
    return `${years} years ago`;
};

// 距离当前时间
export const sinceNowByByNano = (nano: string): string =>
    sinceNowByMills(Number(`${BigInt(nano) / BigInt(1e6)}`));

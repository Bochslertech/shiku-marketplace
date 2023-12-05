import { ReactNode, useState } from 'react';

export const TextShowMore = ({
    className,
    text,
    limit,
    moreButton,
    lessButton,
}: {
    className?: string;
    text: string;
    limit: number;
    moreButton?: ReactNode;
    lessButton?: ReactNode;
}) => {
    const has = text.length > limit;
    const [more, setMore] = useState(!has);
    const toggle = () => setMore(!more);
    if (!has) return <span className={className}>{text}</span>;
    return (
        <div>
            <span className={className}>
                {more ? text.substring(0, limit) : text} {more ? '...' : ''}{' '}
            </span>
            <span className="cursor-pointer font-inter-semibold text-[#000]" onClick={toggle}>
                {more ? moreButton ?? 'Show more' : lessButton ?? 'Show less'}
            </span>
        </div>
    );
};

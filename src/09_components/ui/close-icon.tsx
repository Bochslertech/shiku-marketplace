import { MouseEventHandler } from 'react';
import { cn } from '@/02_common/cn';
import YumiIcon from './yumi-icon';

export default function CloseIcon({
    onClick,
    className,
}: {
    onClick?: MouseEventHandler<HTMLDivElement>;
    className?: string;
}) {
    return (
        <div onClick={onClick} className={cn('group flex cursor-pointer', className)}>
            <YumiIcon
                name="action-close"
                color="grey"
                className="m-auto block w-full group-hover:hidden"
            />
            <YumiIcon
                name="action-close"
                color="black"
                className="m-auto hidden w-full group-hover:block"
            />
        </div>
    );
}

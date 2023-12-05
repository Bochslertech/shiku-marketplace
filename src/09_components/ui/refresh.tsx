import { cn } from '@/02_common/cn';
import YumiIcon from './yumi-icon';

export default function Refresh({
    className,
    onClick,
    control,
}: {
    className?: string;
    onClick: () => void;
    control: boolean;
}) {
    return (
        <YumiIcon
            name="action-refresh"
            color="white"
            size={20}
            className={cn('w-5', className, control && 'animate-spin')}
            onClick={onClick}
        />
    );
}

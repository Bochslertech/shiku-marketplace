import { Skeleton } from 'antd';
import { cn } from '@/02_common/cn';

export default function SkeletonTW({ className }: { className?: string }) {
    return <Skeleton.Input size={'small'} className={cn('!min-w-0', className)} />;
}

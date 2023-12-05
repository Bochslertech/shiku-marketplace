import { cdn_by_assets } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';

export default function Loading({ className }: { className?: string }) {
    return (
        <div className={cn('mt-[20vh] flex w-full justify-center', className)}>
            <img
                className="h-10 w-10 md:h-20 md:w-20 "
                src={cdn_by_assets('/images/common/loading.gif')}
                alt="loading image"
            />
        </div>
    );
}

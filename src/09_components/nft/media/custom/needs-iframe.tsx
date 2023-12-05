import { cn } from '@/02_common/cn';

export const isNeedsIFrame = (src?: string): boolean => {
    if (src === undefined) return false;
    return (
        src.indexOf('pk6rk-6aaaa-aaaae-qaazq-cai') >= 0 ||
        src.indexOf('dhiaa-ryaaa-aaaae-qabva-cai') >= 0 ||
        src.indexOf('skjpp-haaaa-aaaae-qac7q-cai') >= 0
    );
};

function NftMediaNeedsIFrame({ src, className }: { src?: string; className?: string }) {
    return (
        <div className={cn([className, 'relative h-full w-full'])}>
            <iframe src={src} className={cn([className, 'h-full w-full'])}></iframe>
            <div className="absolute top-0 h-full w-full"></div>
        </div>
    );
}

export default NftMediaNeedsIFrame;

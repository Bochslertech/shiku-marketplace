import { useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import { motion, TargetAndTransition, VariantLabels } from 'framer-motion';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';

export const isHasImageSrc = (src?: string): boolean => {
    if (src === undefined) return false;
    return src.indexOf('xizxk-fqaaa-aaaap-aa2nq-cai') >= 0;
};

export const isHasImageHref = (src?: string): boolean => {
    if (src === undefined) return false;
    return (
        src.indexOf('bzsui-sqaaa-aaaah-qce2a-cai') >= 0 ||
        src.indexOf('llf4i-riaaa-aaaag-qb4cq-cai') >= 0 ||
        src.indexOf('nf35t-jqaaa-aaaag-qbp4q-cai') >= 0
    );
};
export const isHasImageUrl = (src?: string): boolean => {
    if (src === undefined) return false;
    return isHasImageSrc(src) || isHasImageHref(src);
};

function NftMediaHasImageUrl({
    src,
    whileHover,
    className,
    imageClass,
    skeleton,
}: {
    src?: string;
    whileHover?: TargetAndTransition | VariantLabels;
    className?: string;
    imageClass?: string;
    skeleton?: boolean;
}) {
    const [loading, setLoading] = useState<boolean>(true);
    const [aspectRatio, setAspectRatio] = useState<number>(1);

    const showSkeleton = !src || loading;

    const [url, setUrl] = useState<string | undefined>(undefined);
    useEffect(() => {
        if (!src) return;
        if (src.indexOf('thumbnail') >= 0 && isHasImageHref(src)) return setUrl(src);
        fetch(src)
            .then((d) => d.text())
            .then((d) => {
                let url: string = src;
                if (isHasImageHref(src)) {
                    url = d.split('href="')[1].split('" width')[0];
                }
                if (isHasImageSrc(src)) {
                    url = d.split('src="')[1].split('"></img>')[0];
                }
                setUrl(url);
            })
            .catch((e) => {
                console.error('use origin image src', e);
                setUrl(src);
            });
    }, [src]);

    const onImageLoaded = ({ target: { naturalWidth, naturalHeight } }) => {
        setAspectRatio(naturalWidth / naturalHeight);
        setLoading(false);
    };
    return (
        <div className={cn([className, 'relative h-full w-full'])}>
            {showSkeleton && skeleton && (
                <Skeleton.Image className="absolute !h-full !w-full" active={true} />
            )}
            {url && (
                <motion.img
                    src={cdn(url)}
                    whileHover={whileHover}
                    className={cn(
                        'h-auto w-auto',
                        aspectRatio > 1 ? 'w-full' : 'h-full',
                        skeleton && loading ? 'invisible' : 'visible',
                        className,
                        imageClass,
                    )}
                    onLoad={(e: any) => onImageLoaded(e)}
                    onError={() => setLoading(false)}
                />
            )}
        </div>
    );
}

export default NftMediaHasImageUrl;

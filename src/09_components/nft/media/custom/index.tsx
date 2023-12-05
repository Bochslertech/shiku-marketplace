import { TargetAndTransition, VariantLabels } from 'framer-motion';
import NftMediaHasImageUrl, { isHasImageUrl } from './has-image-url';
import NftMediaNeedsIFrame, { isNeedsIFrame } from './needs-iframe';

export const isCustomMedia = (src?: string): boolean => isNeedsIFrame(src) || isHasImageUrl(src);

function CustomNftMedia({
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
    if (isNeedsIFrame(src)) return <NftMediaNeedsIFrame src={src} className={className} />;
    if (isHasImageUrl(src))
        return (
            <NftMediaHasImageUrl
                src={src}
                whileHover={whileHover}
                className={className}
                imageClass={imageClass}
                skeleton={skeleton}
            />
        );
    return <></>;
}

export default CustomNftMedia;

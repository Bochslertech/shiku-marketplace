import { useEffect, useRef, useState } from 'react';
import { motion, TargetAndTransition, VariantLabels } from 'framer-motion';
import { useWindowSize } from 'usehooks-ts';
import { cdn, url_cdn, url_cdn_by_assets } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { NFT_ICNAMING } from '@/03_canisters/nft/special';
import './index.less';

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

const ByMotionImg = ({
    src,
    whileHover,
    visible,
    className,
    svgClass,
    onImageLoaded,
    onError,
}: {
    src: string;
    whileHover?: TargetAndTransition | VariantLabels;
    visible: boolean;
    className?: string;
    svgClass?: string;
    onImageLoaded?: (e: any) => void;
    onError?: () => void;
}) => {
    return (
        <>
            <motion.img
                src={cdn(src)}
                whileHover={whileHover}
                className={cn(
                    'h-auto w-full',
                    !visible ? 'invisible' : 'visible',
                    className,
                    svgClass,
                )}
                onLoad={(e: any) => onImageLoaded && onImageLoaded(e)}
                onError={() => onError && onError()}
            />
        </>
    );
};

const ByImg = ({
    src,
    visible,
    className,
    svgClass,
    onImageLoaded,
    onError,
}: {
    src: string;
    whileHover?: TargetAndTransition | VariantLabels;
    visible: boolean;
    className?: string;
    svgClass?: string;
    onImageLoaded?: (e: any) => void;
    onError?: () => void;
}) => {
    return (
        <>
            <img
                src={cdn(src)}
                className={cn(
                    'h-auto w-full',
                    !visible ? 'invisible' : 'visible',
                    className,
                    svgClass,
                )}
                onLoad={(e: any) => onImageLoaded && onImageLoaded(e)}
                onError={() => onError && onError()}
            />
        </>
    );
};

const ByBackgroundImage = ({
    src,
    className,
    svgClass,
    onError,
}: {
    src: string;
    whileHover?: TargetAndTransition | VariantLabels;
    visible: boolean;
    className?: string;
    svgClass?: string;
    onImageLoaded?: (e: any) => void;
    onError?: () => void;
}) => {
    onError && onError(); // 直接显示
    return (
        <>
            <div className="h-full w-full">
                <div
                    style={{
                        backgroundImage: `${url_cdn(src)}`,
                        backgroundSize: '100% 100%',
                    }}
                    className={cn('h-full w-full', 'visible', className, svgClass)}
                />
            </div>
        </>
    );
};

const ByHTML = ({
    src,
    className,
    svgClass,
    onError,
}: {
    src: string;
    whileHover?: TargetAndTransition | VariantLabels;
    visible: boolean;
    className?: string;
    svgClass?: string;
    onImageLoaded?: (e: any) => void;
    onError?: () => void;
}) => {
    const [svg, setSvg] = useState('');
    useEffect(() => {
        fetch(src)
            .then((d) => d.text())
            .then(setSvg)
            .finally(() => onError && onError());
    }, [src]);
    return (
        <>
            {svg && (
                <div
                    className={cn(
                        'media-svg-container by-html h-full w-full',
                        'visible',
                        className,
                        svgClass,
                    )}
                    dangerouslySetInnerHTML={{
                        __html: `<div class="inner">${svg}</div>`,
                    }}
                ></div>
            )}
        </>
    );
};

const ByIframe = ({
    src,
    whileHover,
    className,
    svgClass,
    onError,
}: {
    src: string;
    whileHover?: TargetAndTransition | VariantLabels;
    visible: boolean;
    className?: string;
    svgClass?: string;
    onImageLoaded?: (e: any) => void;
    onError?: () => void;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(550);
    useEffect(() => {
        fetch(src)
            .then((d) => d.text())
            .then((d) => {
                const split = d.split('width="');
                if (split.length >= 2) {
                    const s = split[1];
                    const index = s.indexOf('"');
                    const width = s.substring(0, index);
                    setWidth(parseInt(width));
                }
            })
            .finally(() => onError && onError());
    }, [src]);
    return (
        <>
            {
                <motion.div
                    ref={ref}
                    className="media-svg-container by-iframe h-full w-full"
                    whileHover={whileHover}
                >
                    <div
                        className="inner"
                        style={{
                            transform: ref.current
                                ? `scale(${ref.current.offsetWidth / width})`
                                : `scale(0.4)`,
                        }}
                    >
                        <iframe
                            src={cdn(src)}
                            style={{
                                border: 'none',
                                overflow: 'hidden',
                                display: 'flex',
                            }}
                            className={cn('h-full w-full', 'visible', className, svgClass)}
                        ></iframe>
                    </div>
                    <div className="mask"></div>
                </motion.div>
            }
        </>
    );
};

const ByIcnamingBackground = ({
    src,
    whileHover,
    visible,
    className,
    svgClass,
    onError,
}: {
    src: string;
    whileHover?: TargetAndTransition | VariantLabels;
    visible: boolean;
    className?: string;
    svgClass?: string;
    onImageLoaded?: (e: any) => void;
    onError?: () => void;
}) => {
    const [domain, setDomain] = useState<string | undefined>(undefined);
    const [expired, setExpired] = useState<string | undefined>(undefined);
    useEffect(() => {
        fetch(src)
            .then((d) => d.text())
            .then((d) => {
                let split = d.split('text-anchor="middle">');
                if (split.length >= 2) {
                    const s = split[1];
                    const index = s.indexOf('</tspan>');
                    setDomain(s.substring(0, index));
                }
                split = d.split('<tspan x="24.273" y="41" fill="#FFF">');
                if (split.length >= 2) {
                    const s = split[1];
                    const index = s.indexOf('</tspan>');
                    setExpired(s.substring(0, index));
                }
            })
            .finally(() => onError && onError());
    }, [src]);

    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(550);
    const size = useWindowSize();
    const resetHeight = () => setHeight(ref.current?.offsetHeight ?? 550);
    useEffect(resetHeight, [ref]);
    useEffect(resetHeight, [size]);
    return (
        <>
            {
                <motion.div
                    ref={ref}
                    whileHover={whileHover}
                    className={cn(
                        'media-svg-container by-icnaming-background h-full w-full',
                        !visible ? 'invisible' : 'visible',
                        className,
                        svgClass,
                    )}
                >
                    {domain && expired && (
                        <div
                            className="inner"
                            style={{
                                backgroundImage: `${url_cdn_by_assets(
                                    '/images/nft/icnaming-background.png',
                                )}`,
                            }}
                        >
                            <div className="text">
                                <div
                                    className="domain black"
                                    style={{
                                        top: `${(height * (356.156 - 40)) / 550}px`,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: `${(height * 80) / 550}px`,
                                            lineHeight: `${(height * 80) / 550}px`,
                                        }}
                                    >
                                        {domain}
                                    </span>
                                </div>
                                <div
                                    className="domain white"
                                    style={{
                                        top: `${(height * (346.156 - 40)) / 550}px`,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: `${(height * 80) / 550}px`,
                                            lineHeight: `${(height * 80) / 550}px`,
                                        }}
                                    >
                                        {domain}
                                    </span>
                                </div>
                                <div
                                    className="ic black"
                                    style={{
                                        top: `${(height * (446.156 - 40)) / 550}px`,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: `${(height * 80) / 550}px`,
                                            lineHeight: `${(height * 80) / 550}px`,
                                        }}
                                    >
                                        {'.IC'}
                                    </span>
                                </div>
                                <div
                                    className="ic green"
                                    style={{
                                        top: `${(height * (436.156 - 40)) / 550}px`,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: `${(height * 80) / 550}px`,
                                            lineHeight: `${(height * 80) / 550}px`,
                                        }}
                                    >
                                        {'.IC'}
                                    </span>
                                </div>
                                <div
                                    className="expired"
                                    style={{
                                        top: `${(height * 492) / 550}px`,
                                    }}
                                >
                                    <span
                                        style={{
                                            padding: `${(height * 15) / 550}px ${
                                                (height * 24) / 550
                                            }px`,
                                            fontSize: `${(height * 28) / 550}px`,
                                            lineHeight: `${(height * 28) / 550}px`,
                                        }}
                                    >
                                        {expired}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mask"></div>
                </motion.div>
            }
        </>
    );
};

function ShowSvg({
    src,
    whileHover,
    visible,
    className,
    svgClass,
    onImageLoaded,
    onError,
}: {
    src: string;
    whileHover?: TargetAndTransition | VariantLabels;
    visible: boolean;
    className?: string;
    svgClass?: string;
    onImageLoaded?: (e: any) => void;
    onError?: () => void;
}) {
    // 如果是 icnaming 的可以使用特定的显示
    if (NFT_ICNAMING.find((c) => src.indexOf(c) >= 0)) {
        return (
            <>
                <ByIcnamingBackground
                    src={src}
                    whileHover={whileHover}
                    visible={visible}
                    className={className}
                    svgClass={svgClass}
                    onImageLoaded={onImageLoaded}
                    onError={onError}
                />
            </>
        );
    }

    return (
        <>
            {
                // ! 卡顿
                <ByMotionImg
                    src={src}
                    whileHover={whileHover}
                    visible={visible}
                    className={className}
                    svgClass={svgClass}
                    onImageLoaded={onImageLoaded}
                    onError={onError}
                />
            }
            {
                // ! 卡顿
                // <ByImg
                //     src={src}
                //     whileHover={whileHover}
                //     visible={visible}
                //     className={className}
                //     svgClass={svgClass}
                //     onImageLoaded={onImageLoaded}
                //     onError={onError}
                // />
            }
            {
                // ! 卡顿
                // <ByBackgroundImage
                //     src={src}
                //     whileHover={whileHover}
                //     visible={visible}
                //     className={className}
                //     svgClass={svgClass}
                //     onImageLoaded={onImageLoaded}
                //     onError={onError}
                // />
            }
            {
                // ! 卡顿, 样式有问题
                // <ByHTML
                //     src={src}
                //     whileHover={whileHover}
                //     visible={visible}
                //     className={className}
                //     svgClass={svgClass}
                //     onImageLoaded={onImageLoaded}
                //     onError={onError}
                // />
            }
            {
                // ! 也卡顿, 有个加载错误，应该可以使用
                // <ByIframe
                //     src={src}
                //     whileHover={whileHover}
                //     visible={visible}
                //     className={className}
                //     svgClass={svgClass}
                //     onImageLoaded={onImageLoaded}
                //     onError={onError}
                // />
            }
        </>
    );
}

export default ShowSvg;

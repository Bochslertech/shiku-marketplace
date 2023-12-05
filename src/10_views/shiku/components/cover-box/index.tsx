import { useMemo, useState } from 'react';
import { Image, message } from 'antd';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import './index.less';

const PLOTS: (string | 0)[][] = [
    [0, 0, 0, '3-12', '4-12', '5-12', '6-12', '7-12', '8-12', '9-12', '10-12', 0, 0, 0],
    [0, 0, '2-11', '3-11', '4-11', '5-11', '6-11', '7-11', '8-11', '9-11', '10-11', '11-11', 0, 0],
    [
        0,
        '1-10',
        '2-10',
        '3-10',
        '4-10',
        '5-10',
        '6-10',
        '7-10',
        '8-10',
        '9-10',
        '10-10',
        '11-10',
        '12-10',
        0,
    ],
    [0, 0, 0, '3-9', '4-9', '5-9', 0, 0, 0, 0, 0, 0, 0, 0],
    ['0-8', 0, '2-8', 0, '4-8', '5-8', 0, '7-8', '8-8', '9-8', '10-8', 0, 0, '13-8'],
    ['0-7', 0, '2-7', 0, 0, 0, '6-7', 0, 0, 0, 0, '11-7', 0, '13-7'],
    ['0-6', 0, '2-6', 0, 0, 0, '6-6', '7-6', 0, 0, 0, '11-6', 0, '13-6'],
    ['0-5', 0, '2-5', 0, 0, 0, 0, '7-5', 0, 0, 0, '11-5', 0, '13-5'],
    ['0-4', 0, 0, '3-4', '4-4', '5-4', '6-4', 0, '8-4', '9-4', 0, '11-4', 0, '13-4'],
    [0, 0, 0, 0, 0, 0, 0, 0, '8-3', '9-3', '10-3', 0, 0, 0],
    [0, '1-2', '2-2', '3-2', '4-2', '5-2', '6-2', '7-2', '8-2', '9-2', '10-2', '11-2', '12-2', 0],
    [0, 0, '2-1', '3-1', '4-1', '5-1', '6-1', '7-1', '8-1', '9-1', '10-1', '11-1', 0, 0],
    [0, 0, 0, '3-0', '4-0', '5-0', '6-0', '7-0', '8-0', '9-0', '10-0', 0, 0, 0],
];

// { currentPos = '3-0', selectLand, nftInfo }
const CoverBox = ({
    position,
    setPosition,
    card,
}: {
    position: string;
    setPosition: (p: string) => void;
    card: NftMetadata | undefined;
}) => {
    const [preview, setPreview] = useState<boolean>(false);

    const images: string[] | undefined = useMemo(() => {
        if (card === undefined) return undefined;
        const raw = JSON.parse(card.metadata.raw.data);
        return raw[1].image_url;
    }, [card]);

    const onPosition = (p: string | 0) => {
        if (p === 0) return;
        if (position === p) {
            if (card === undefined) return;
            if (!images) message.error('No Image');
            else setPreview(true);
        }
        setPosition(p);
    };

    return (
        <div className="h-[340px] w-full flex-shrink-0 rounded-[16px] bg-[#161717] bg-[length:300px_300px] bg-center md:h-[530px] md:w-[525px] md:bg-[length:392px_392px]">
            <div className="shiku-cover-box">
                {PLOTS.map((item, index) => {
                    return (
                        <div key={`plot_cells_${index}`} className="plot-cells">
                            {item.map((plot, plotIndex) => {
                                return (
                                    <div
                                        key={`plot_${index}_${plotIndex}`}
                                        className={
                                            plot === 0
                                                ? 'plot-cell hide'
                                                : position === plot
                                                ? 'plot-cell active'
                                                : 'plot-cell'
                                        }
                                        onClick={() => onPosition(plot)}
                                    ></div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            {preview && images && (
                <div style={{ display: 'none' }}>
                    <Image.PreviewGroup
                        preview={{
                            visible: !!preview,
                            onVisibleChange: setPreview,
                        }}
                    >
                        {images
                            .filter((url) => !!url)
                            .map((url, index) => {
                                return <Image key={`preview_cover_${index}`} src={cdn(url)} />;
                            })}
                    </Image.PreviewGroup>
                </div>
            )}
        </div>
    );
};

export default CoverBox;

import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import { NftTokenScore } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';

function NftScore({ score, scores }: { score?: NftTokenScore; scores?: NftTokenScore[] }) {
    if (score === undefined) return <></>;
    return (
        <Tooltip placement="top" title={ScoreTips(score, scores)} color={'white'} trigger="hover">
            <div className="group relative left-0 top-0  cursor-pointer rounded-[4px] bg-black px-[8px] py-[2px] text-center font-inter-bold text-[12px] text-white">
                {`RR ${score?.score.order}`}
            </div>
        </Tooltip>
    );
}

export default NftScore;

const ScoreTips = (score: NftTokenScore | undefined, scores: NftTokenScore[] | undefined) => {
    const rank = (() => {
        if (score === undefined || scores === undefined || scores.length === 0) return undefined;
        const rank = score.score.order / scores.length;
        if (rank <= 0.001) return `Top 0.1%`;
        if (rank <= 0.01) return `Top 1%`;
        if (rank <= 0.05) return `Top 5%`;
        if (rank <= 0.2) return `Top 20%`;
        return `Common`;
    })();
    return (
        <div className="text-center">
            {(score || rank) && (
                <div className="mt-[8px]">
                    {score && (
                        <span className="mr-[8px] font-inter-bold text-[14px] text-black">
                            RS {score.score.value.toFixed(2)}
                        </span>
                    )}
                    {rank && (
                        <span className="font-inter-bold text-[16px] text-black">({rank})</span>
                    )}
                </div>
            )}

            <Link
                to={`https://yuminftmarketplace.gitbook.io/yumi-docs/developers/methodology-of-rr`}
                target="_blank"
                className="mb-[8px] mt-[10px] flex h-[19px] w-[203px] cursor-pointer items-center justify-center rounded-[10px] bg-black font-inter-medium text-[12px] text-white hover:text-white"
            >
                Learn more about rarity score
                <img
                    className="ml-[6px] block h-[10px] w-[10px]"
                    src={cdn(
                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691146472666_Frame.svg',
                    )}
                    alt=""
                />
            </Link>
        </div>
    );
};

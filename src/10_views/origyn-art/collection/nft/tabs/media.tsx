import { Skeleton } from 'antd';
import { cdn } from '@/02_common/cdn';
import { OrigynArtCollectionData } from '@/03_canisters/yumi/yumi_origyn_art';

function OrigynArtCollectionNftMedia({
    collectionData,
}: {
    collectionData: OrigynArtCollectionData | undefined;
}) {
    return (
        <div className="mx-auto mt-[10px] flex  w-full max-w-[1200px] flex-col gap-y-[20px] md:grid md:grid-cols-2 md:gap-x-[30px]">
            {collectionData
                ? collectionData.metadata.media.map((url) => (
                      <img key={url} className="max-w-[600px]" src={cdn(url)} alt="" />
                  ))
                : ['', ''].map(() => <Skeleton.Input />)}
        </div>
    );
}

export default OrigynArtCollectionNftMedia;

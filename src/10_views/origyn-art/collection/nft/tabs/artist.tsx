import { useMemo } from 'react';
import { Fragment } from 'react';
import { Skeleton } from 'antd';
import { OrigynArtCollectionData } from '@/03_canisters/yumi/yumi_origyn_art';

function OrigynArtCollectionNftArtist({
    collectionData,
}: {
    collectionData: OrigynArtCollectionData | undefined;
}) {
    const artworkDescription = useMemo(() => {
        if (collectionData === undefined) return undefined;
        let sections = collectionData.metadata.artworkDescription.split('\n');
        sections = sections
            .map((s) => s.trim())
            .map((s) => {
                if (s.endsWith('<br/><br/>')) return s.substring(0, s.length - 10);
                return s;
            });
        return sections.splice(0, sections.length - 1); // 最后一条去掉
    }, [collectionData]);

    const list = useMemo(() => {
        if (collectionData === undefined) return undefined;
        const parts = collectionData.metadata.artworkList.split('\n').map((t) => t.trim());
        return parts.map((p) => {
            const index = p.lastIndexOf(',');
            return [p.substring(0, index).trim(), p.substring(index + 1).trim()];
        });
    }, [collectionData]);

    return (
        <div className="flex w-full flex-col justify-center gap-x-[20px] md:flex-row">
            <div className="h-fit w-full max-w-[800px] bg-white p-[30px] px-[27px] py-[30px] shadow md:w-2/3">
                <h1 className="text-[30px] font-medium">
                    {collectionData?.metadata.artAuthor ?? <Skeleton.Input />}
                </h1>
                <div className="text-[14px]">
                    {collectionData?.metadata.authorBirth ? (
                        `(${collectionData?.metadata.authorBirth})`
                    ) : (
                        <Skeleton.Input />
                    )}
                </div>
                <div className="mt-[28px] text-[15px] leading-[22px]">
                    {artworkDescription ? (
                        artworkDescription.map((text, index) => (
                            <Fragment key={index}>
                                {index !== 0 && (
                                    <>
                                        {' '}
                                        <br />
                                        <br />
                                    </>
                                )}
                                {text}
                            </Fragment>
                        ))
                    ) : (
                        <Skeleton.Input className="!h-[300px] !w-[500px]" />
                    )}
                </div>
            </div>
            <div className="mt-[20px] h-fit w-full bg-white px-[27px] py-[30px]  text-[15px] shadow md:mt-0 md:w-1/3">
                <h1>Collections</h1>
                <div className="mt-[15px] flex flex-col gap-y-[10px]">
                    {list ? (
                        list.map((item, index) => (
                            <div key={index} className="flex justify-start text-[14px]">
                                <div className=" font-inter-semibold ">{item[0]}</div>
                                {','}
                                <div>{item[1]}</div>
                            </div>
                        ))
                    ) : (
                        <Skeleton.Input className="!h-[300px] !w-[230px]" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrigynArtCollectionNftArtist;

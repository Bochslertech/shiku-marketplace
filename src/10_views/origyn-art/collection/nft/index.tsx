import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useOrigynArtCollectionData } from '@/08_hooks/views/origyn-art';
import OrigynArtCollectionNftHeader from './header';
import OrigynArtCollectionNftArtist from './tabs/artist';
import OrigynArtCollectionNftArtwork from './tabs/artwork';
import OrigynArtCollectionNftMedia from './tabs/media';

function OrigynArtNFTDetailPage() {
    const { t } = useTranslation();

    const { collection } = useParams();

    const collectionData = useOrigynArtCollectionData(collection);

    const [tab, setTab] = useState<'media' | 'artist' | 'artwork'>('artist');

    return (
        <>
            <OrigynArtCollectionNftHeader collectionData={collectionData} />
            <div className="relative flex h-[50px] w-full items-center justify-between bg-[#151515] md:justify-center">
                <div
                    onClick={() => setTab('artist')}
                    className={`relative flex h-full w-[108px] cursor-pointer items-center justify-center font-[Inter-Bold] text-[14px] text-[#aeaeae] duration-150 ${
                        tab === 'artist' &&
                        '!text-[#fff] after:absolute after:bottom-0 after:left-0 after:flex after:h-[3px] after:w-full after:rounded-[2px] after:bg-white after:content-[""]'
                    }`}
                >
                    {t('owned.detail.tab.artist')}
                </div>
                <div
                    onClick={() => setTab('media')}
                    className={`relative flex h-full w-[108px] cursor-pointer items-center justify-center font-[Inter-Bold] text-[14px] text-[#aeaeae] duration-150 ${
                        tab === 'media' &&
                        '!text-[#fff] after:absolute after:bottom-0 after:left-0 after:flex after:h-[3px] after:w-full after:rounded-[2px] after:bg-white after:content-[""]'
                    }`}
                >
                    {t('owned.detail.tab.media')}
                </div>
                <div
                    onClick={() => setTab('artwork')}
                    className={`relative flex h-full w-[128px] cursor-pointer items-center justify-center font-[Inter-Bold] text-[14px] text-[#aeaeae] duration-150 ${
                        tab === 'artwork' &&
                        '!text-[#fff] after:absolute after:bottom-0 after:left-0 after:flex after:h-[3px] after:w-full after:rounded-[2px] after:bg-white after:content-[""]'
                    }`}
                >
                    {t('owned.detail.tab.artwork')}
                </div>
                {/* pc faq btn */}
                <Link
                    to={'/origyn/land'}
                    className="absolute right-[127px] hidden cursor-pointer  items-center gap-x-[10px] rounded-md border border-gray-700 bg-gray-800 px-[20px] py-[6px] text-[14px] text-white md:flex"
                >
                    <div>FAQ</div>
                    <div className="h-[18px] w-[18px] rounded-full bg-[#AEAEAE] text-center leading-[18px]">
                        ?
                    </div>
                </Link>
                {/* pc faq btn */}
                <Link
                    to={'/origyn/land'}
                    className="flex cursor-pointer items-center gap-x-[10px] rounded-md border border-gray-700 bg-gray-800 px-[10px] py-[6px] text-[12px] text-white md:hidden"
                >
                    <div className="h-[18px] w-[18px] rounded-full bg-[#AEAEAE] text-center leading-[18px]">
                        ?
                    </div>
                </Link>
            </div>
            <div className="bg-gray-100 px-[20px] py-[20px] md:px-[60px] xl:px-[120px]">
                {tab === 'artist' && (
                    <OrigynArtCollectionNftArtist collectionData={collectionData} />
                )}
                {tab === 'media' && <OrigynArtCollectionNftMedia collectionData={collectionData} />}
                {tab === 'artwork' && <OrigynArtCollectionNftArtwork />}
            </div>
        </>
    );
}

export default OrigynArtNFTDetailPage;

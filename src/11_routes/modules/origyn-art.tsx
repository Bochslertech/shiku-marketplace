import React from 'react';
import { RouteObject } from 'react-router-dom';
import OrigynArtCollectionPage from '@/10_views/origyn-art/collection';
import OrigynArtNFTDetailPage from '@/10_views/origyn-art/collection/nft';
import OrigynArtLandPage from '@/10_views/origyn-art/land-page';
import OrigynArtLaunchpad from '@/10_views/origyn-art/launchpad';
import OrigynArtMainPage from '@/10_views/origyn-art/main';
import OrigynArtMarketPage from '@/10_views/origyn-art/market';

// const OrigynArtCollection = React.lazy(() => import('@/views2/origyn-art/collection'));
// const OrigynArtNftDetail = React.lazy(() => import('@/views2/origyn-art/collection/nft'));
// const OrigynArtLandPage = React.lazy(() => import('@/views2/origyn-art/land'));
// const OrigynArtLaunchpad = React.lazy(() => import('@/views2/origyn-art/launchpad'));
// const OrigynArtMain = React.lazy(() => import('@/views2/origyn-art/main'));
// const OrigynArtMarket = React.lazy(() => import('@/views2/origyn-art/market'));

const origyn_art: RouteObject[] = [
    {
        path: '/origyn',
        element: <OrigynArtMainPage />,
    },
    {
        path: '/origyn/launchpad',
        element: <OrigynArtLaunchpad />,
    },
    {
        path: '/origyn/market',
        element: <OrigynArtMarketPage />,
    },
    {
        path: '/origyn/art/:collection',
        element: <OrigynArtCollectionPage />,
    },
    {
        path: '/origyn/art/:collection/:token_identifier',
        element: <OrigynArtNFTDetailPage />,
    },
    {
        path: '/origyn/land',
        element: <OrigynArtLandPage />,
    },
];

export default origyn_art;

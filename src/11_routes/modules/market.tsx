import React from 'react';
import { RouteObject } from 'react-router-dom';
import MarketCollectionPage from '@/10_views/market/collection';
import MarketNftDetailPage from '@/10_views/market/nft';

// const MarketCollection = React.lazy(() => import('@/views2/market/collection'));
// const MarketNftDetail = React.lazy(() => import('@/views2/market/nft'));

const market: RouteObject[] = [
    {
        path: '/market/:collection',
        element: <MarketCollectionPage />,
    },
    {
        path: '/market/:collection/:token_identifier_or_index',
        element: <MarketNftDetailPage />,
    },
];

export default market;

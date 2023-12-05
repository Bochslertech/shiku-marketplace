import React from 'react';
import { RouteObject } from 'react-router-dom';
import GoldAboutPage from '@/10_views/gold/about';
import GoldAuditPage from '@/10_views/gold/audit';
import GoldFaqPage from '@/10_views/gold/faq';
import GoldMarket from '@/10_views/gold/market';
import GoldNft from '@/10_views/gold/nft';

// const GoldAbout = React.lazy(() => import('@/views2/gold/about'));
// const GoldAudit = React.lazy(() => import('@/views2/gold/audit'));
// const GoldFaq = React.lazy(() => import('@/views2/gold/faq'));
// const GoldMarket = React.lazy(() => import('@/views2/gold/market'));
// const GoldNft = React.lazy(() => import('@/views2/gold/nft'));

const gold: RouteObject[] = [
    {
        path: '/gold',
        element: <GoldMarket />,
    },
    {
        path: '/gold/nfts', // 老版的路由也要支持
        element: <GoldMarket />,
    },
    {
        path: '/gold/market',
        element: <GoldMarket />,
    },
    {
        path: '/gold/about',
        element: <GoldAboutPage />,
    },
    {
        path: '/gold/faq',
        element: <GoldFaqPage />,
    },
    {
        path: '/gold/audit',
        element: <GoldAuditPage />,
    },
    {
        path: '/gold/:collection/:token_identifier',
        element: <GoldNft />,
    },
];

export default gold;

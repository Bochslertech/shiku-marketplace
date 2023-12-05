import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import ExploreMainPage from '@/10_views/explore/main';
import ExploreOatClaimPage from '@/10_views/explore/oat/claim';
import ExploreOatProjectPage from '@/10_views/explore/oat/project';
import MarketNftDetailPage from '@/10_views/market/nft';
import ExploreArtCreatingMain from '@/views2/explore/art';
import ExploreArtApply from '@/views2/explore/art/apply';
import ExploreArtCreating from '@/views2/explore/art/creating';
import ArtistCreator from '@/views2/explore/art/creator';

// const ExploreArtCreatingMain = React.lazy(() => import('@/views2/explore/art'));
// const ExploreArtApply = React.lazy(() => import('@/views2/explore/art/apply'));
// const ExploreArtCreating = React.lazy(() => import('@/views2/explore/art/creating'));
// const ArtistCreator = React.lazy(() => import('@/views2/explore/art/creator'));
// const ExploreMain = React.lazy(() => import('@/views2/explore/main'));
// const ExploreOatClaim = React.lazy(() => import('@/views2/explore/oat/claim'));
// const ExploreOatProject = React.lazy(() => import('@/views2/explore/oat/project'));
// const MarketNftDetail = React.lazy(() => import('@/views2/market/nft'));

const explore: RouteObject[] = [
    {
        path: '/explore',
        element: <ExploreMainPage />,
        children: [
            {
                path: '/explore/:tab',
                element: <ExploreMainPage />,
            },
        ],
    },
    {
        path: '/oat/:project',
        element: <ExploreOatProjectPage />,
    },
    {
        path: '/oat/:project/claim/:event',
        element: <ExploreOatClaimPage />,
    },
    {
        path: '/artist/creator',
        element: <ArtistCreator />,
    },
    {
        path: '/art/create',
        element: <ExploreArtCreatingMain />,
    },
    {
        path: '/art/create-nft',
        element: <ExploreArtCreating />,
    },
    {
        path: '/art/apply',
        element: <ExploreArtApply />,
    },
    {
        path: '/art/:collection/:token_identifier_or_index',
        element: <MarketNftDetailPage />,
    },
    {
        path: '/oat',
        element: <Navigate to="/explore/oat" />,
    },
    {
        path: '/art',
        element: <Navigate to="/explore/art" />,
    },
];

export default explore;

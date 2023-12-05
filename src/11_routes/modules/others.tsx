import React from 'react';
import { RouteObject } from 'react-router-dom';
import AnnouncementPage from '@/10_views/announcement';
import RankingPage from '@/10_views/ranking';

// const AppAnnouncementMain = React.lazy(() => import('@/views2/announcement'));
// const Ranking = React.lazy(() => import('@/views2/ranking'));

const others: RouteObject[] = [
    {
        path: '/ranking',
        element: <RankingPage />,
    },
    {
        path: '/announcements',
        element: <AnnouncementPage />,
        children: [
            {
                path: '/announcements/:id',
                element: <AnnouncementPage />,
            },
        ],
    },
];

export default others;

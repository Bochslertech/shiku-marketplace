import React from 'react';
import { RouteObject } from 'react-router-dom';
import ShikuPage from '@/10_views/shiku';

// const ShikuMain = React.lazy(() => import('@/views2/shiku'));

const shiku: RouteObject[] = [
    {
        path: '/shiku',
        element: <ShikuPage />,
        children: [
            {
                path: '/shiku/:token_index',
                element: <ShikuPage />,
            },
        ],
    },
];

export default shiku;

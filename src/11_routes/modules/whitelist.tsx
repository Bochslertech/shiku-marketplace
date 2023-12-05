import { RouteObject } from 'react-router-dom';
import WhiteList from '@/views2/whitelist';

const whitelist: RouteObject[] = [
    {
        path: '/add-oat-whitelist',
        element: <WhiteList />,
    },
    {
        path: '/add-whitelist',
        element: <WhiteList />,
    },
];

export default whitelist;

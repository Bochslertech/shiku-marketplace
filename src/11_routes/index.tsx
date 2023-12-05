import { Navigate, RouteObject } from 'react-router-dom';
import { isDevMode } from '@/05_utils/app/env';
import ConnectPage from '@/10_views/connect';
import HackPage from '@/10_views/hack';
import HomePage from '@/10_views/home';
import explore from './modules/explore';
import launchpad from './modules/launchpad';
import market from './modules/market';
import others from './modules/others';
import profile from './modules/profile';
import shiku from './modules/shiku';
import whitelist from './modules/whitelist';

const isDev = isDevMode();

// 如果是测试环境,就增加开发信息页面
const hacks: RouteObject[] = isDev
    ? [
          {
              path: '/hack',
              element: <HackPage />,
          },
      ]
    : [];

const routes: RouteObject[] = [
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/connect',
        element: <ConnectPage />,
    },
    ...profile,
    ...launchpad,
    ...market,
    ...explore,
    ...shiku,
    ...others,
    ...whitelist,
    ...hacks,
    {
        path: '/*',
        element: <Navigate to="/" />,
    },
];

export default routes;

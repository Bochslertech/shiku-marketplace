import React from 'react';
import { RouteObject } from 'react-router-dom';
import KycIntroduction from '@/views2/kyc/introduction';
import KycRegister from '@/views2/kyc/register';

// const KycIntroduction = React.lazy(() => import('@/views2/kyc/introduction'));
// const KycRegister = React.lazy(() => import('@/views2/kyc/register'));

const kyc: RouteObject[] = [
    {
        path: '/kyc/introduction',
        element: <KycIntroduction />,
    },
    {
        path: '/kyc/register',
        element: <KycRegister />,
    },
];

export default kyc;

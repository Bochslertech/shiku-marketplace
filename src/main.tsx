import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Connect2ICProvider } from '@connect2ic/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/00_assets/css/main.css';
import '@/00_assets/yumi-icon/iconfont.css';
import { initBackendType } from '@/05_utils/app/backend';
import { createClient } from '@/05_utils/connect/connect';
import App from './app';

// 初始化后端设置 // ! 必须最先设置后端类型，否则登录组件获取到的白名单就是错误的
initBackendType();

const connectClient = createClient();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Connect2ICProvider client={connectClient}>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </Connect2ICProvider>
        </BrowserRouter>
    </React.StrictMode>,
);

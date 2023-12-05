import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SupportedLanguage } from '@/01_types/app';
import { YumiPlatformFee } from '@/03_canisters/yumi/yumi_core';
import { isDevMode } from '@/05_utils/app/env';
import { setLanguage } from '@/06_locales';

const isDev = isDevMode();

// =========================== 网站相关数据持久化 ===========================

interface AppState {
    // 多语言
    language: SupportedLanguage; // 网页用户设置的语言
    setLanguage: (language: SupportedLanguage) => void;
    // 页面主题
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    goldModalFlag: boolean; // 总共显示一次gold弹窗
    setGoldModalFlag: (flag: boolean) => void;
    // 汇率价格
    icp_usd: string | undefined;
    setIcpUsd: (value: string | undefined) => void;
    ogy_usd: string | undefined;
    setOgyUsd: (value: string | undefined) => void;
    // 平台费
    yumi_platform_fee: YumiPlatformFee | undefined;
    setYumiPlatformFee: (value: YumiPlatformFee | undefined) => void;
}

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set) => ({
                // 多语言
                language: 'en',
                setLanguage: (language: SupportedLanguage) => {
                    setLanguage(language); // 设置新的语言
                    return set({ language }); // 修改状态
                },
                goldModalFlag: false,
                setGoldModalFlag: (flag) => set({ goldModalFlag: flag }),
                // 页面主题
                // theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                theme: 'light', // ? 暂时只支持 light
                setTheme: (theme: 'light' | 'dark') => set({ theme }),
                // 汇率价格
                icp_usd: undefined,
                setIcpUsd: (value: string | undefined) => set({ icp_usd: value }),
                ogy_usd: undefined,
                setOgyUsd: (value: string | undefined) => set({ ogy_usd: value }),
                // 平台费
                yumi_platform_fee: undefined,
                setYumiPlatformFee: (value: YumiPlatformFee | undefined) =>
                    set({ yumi_platform_fee: value }),
            }),
            {
                name: '__yumi_app__',
            },
        ),
        {
            enabled: isDev,
        },
    ),
);

isDev && mountStoreDevtool('AppStore', useAppStore);

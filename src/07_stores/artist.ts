import { produce } from 'immer';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { Apply2ArtistFormData } from '@/03_canisters/yumi/yumi_application';
import { MintingNFT } from '@/03_canisters/yumi/yumi_artist_router';
import { isDevMode } from '@/05_utils/app/env';

const isDev = isDevMode();

// =========================== 申请表单页面数据类型 ===========================

// =========================== 创建NFT表单页面数据类型 ===========================

export type MimeType = 'video' | 'image' | '3dmodel';

export interface CreateNFTFormData extends MintingNFT {
    discord?: string;
    twitter?: string;
    instagram?: string;
    telegram?: string;
    medium?: string;
    website?: string;

    // origin和thumb的mimeType
    mimeTypeOrigin?: MimeType;
    mimeTypeThumb?: MimeType;
}

// =========================== Artist初始数据 ===========================

const getInitialApply2ArtistFromData = (): Apply2ArtistFormData => {
    return {
        contact: '',
        name: '',
        representing: '',
        interested: '',
    };
};

const initialCreateNFTFormData: CreateNFTFormData = {
    name: '',
    category: '',
    description: '',
    url: '',
    mimeType: '',
    thumb: '',
    attributes: [],
    timestamp: 0,
};

// =========================== Artist表格相关数据持久化 ===========================

interface ArtistState {
    // 申请表单页面数据
    applyFormData: Apply2ArtistFormData;
    updateArtistApplyFormData: (data: Apply2ArtistFormData) => void;
    deleteArtistApplyFormData: () => void;

    // 创建ART-NFT页面表单数据
    createNFTFormData: CreateNFTFormData;
    updateCreateNFTFormData: (data: any) => void;
    deleteCreateNFTFormData: () => void;
}

export const useArtistStore = createWithEqualityFn<ArtistState>()(
    devtools(
        persist(
            (set) => ({
                // 申请表单页面数据相关
                applyFormData: getInitialApply2ArtistFromData(),
                updateArtistApplyFormData: (data: Apply2ArtistFormData) =>
                    set(
                        produce((state: ArtistState) => {
                            Object.keys(data).forEach((key) => {
                                state.applyFormData[key] = data[key];
                            });
                        }),
                    ),
                deleteArtistApplyFormData: () => {
                    set({ applyFormData: getInitialApply2ArtistFromData() });
                },

                // 创建ART-NFT页面表单数据相关
                createNFTFormData: initialCreateNFTFormData,
                updateCreateNFTFormData: (data: CreateNFTFormData) =>
                    set(
                        produce((state: ArtistState) => {
                            Object.keys(data).forEach((key) => {
                                state.createNFTFormData[key] = data[key];
                            });
                        }),
                    ),
                deleteCreateNFTFormData: () => {
                    set({ createNFTFormData: initialCreateNFTFormData });
                },
            }),
            {
                name: '__yumi_artist__',
            },
        ),
        {
            enabled: isDev,
        },
    ),
    shallow,
);

isDev && mountStoreDevtool('ArtistStore', useArtistStore);

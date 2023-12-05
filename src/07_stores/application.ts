import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AppAnnouncement } from '@/03_canisters/yumi/yumi_application';
import { isDevMode } from '@/05_utils/app/env';
import { queryAnnouncementList } from '@/05_utils/canisters/yumi/application';

const isDev = isDevMode();

// =========================== 网站相关数据 非持久化 ===========================

interface ApplicationState {
    // 公告
    announcements?: AppAnnouncement[];
    reloadAnnouncements: () => Promise<void>;
}

export const useApplicationStore = create<ApplicationState>()(
    devtools(
        (set) => ({
            announcements: undefined,
            reloadAnnouncements: async () => {
                const announcements = await queryAnnouncementList();
                set({ announcements });
            },
        }),
        {
            enabled: isDev,
        },
    ),
);

isDev && mountStoreDevtool('ApplicationStore', useApplicationStore);

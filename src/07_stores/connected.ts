import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { isDevMode } from '@/05_utils/app/env';

const isDev = isDevMode();

// =========================== 网站相关数据持久化 ===========================

interface ConnectedState {
    // 登录历史记录
    connectedRecordsFlag: number; // ! 真正的数据从 connectedRecordsStored 读取 // 目前没有使用历史记录
    noticeConnectedRecordsFlag: () => void;

    // 记录哪些账户注册过了
    registered: Record<string, Record<string, 'registered'>>; // 记录注册过的账户
    addRegistered: (backend_canister_id: string, principal: string) => void;
}

export const useConnectedStore = create<ConnectedState>()(
    devtools(
        persist(
            (set, get) => ({
                // 登录历史记录
                connectedRecordsFlag: 0,
                noticeConnectedRecordsFlag: () =>
                    set({ connectedRecordsFlag: get().connectedRecordsFlag + 1 }),

                // 记录哪些账户注册过了
                registered: {}, // 记录注册过的账户
                addRegistered: (backend_canister_id: string, principal: string) => {
                    const old = get().registered;
                    const registered: Record<string, Record<string, 'registered'>> = { ...old }; // 复制一份
                    if (registered[backend_canister_id] === undefined)
                        registered[backend_canister_id] = {};
                    const record = registered[backend_canister_id];
                    if (record[principal]) return;
                    record[principal] = 'registered';
                    return set({ registered });
                },
            }),
            {
                name: '__yumi_connected__',
                storage: createJSONStorage(() => localStorage),
            },
        ),
        {
            enabled: isDev,
        },
    ),
);

isDev && mountStoreDevtool('ConnectedStore', useConnectedStore);

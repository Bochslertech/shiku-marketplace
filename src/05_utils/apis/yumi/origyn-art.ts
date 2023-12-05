import * as origynArt from '@/04_apis/yumi/origyn-art';

//  origyn art 的邮箱订阅
export const origynArtRegisterEmail = async (email: string): Promise<boolean> => {
    return origynArt.origynArtRegisterEmail(email);
};

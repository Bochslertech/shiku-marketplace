import { watchIdentityProfile } from '../interval/identity';
import { watchDevice } from './device';
import { watchScrollToTop } from './scroll';

// 综合要初始化的动作
export const watching = () => {
    // 每次进入新的路由, 判断是否要回到页面顶端
    watchScrollToTop();

    // 监听设备变化
    watchDevice();

    // 启动轮询 身份和信息的轮询
    watchIdentityProfile();
};

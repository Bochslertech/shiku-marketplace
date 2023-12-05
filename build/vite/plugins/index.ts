import type { PluginOption } from 'vite';
import purgeIcons from 'vite-plugin-purge-icons';
import react from '@vitejs/plugin-react-swc';
import { ImportMetaEnv } from '../../../src/vite-env';
import { viteCompressionPlugin } from './compression';
import { viteHtmlPlugins } from './html';
import { imageminPlugin } from './imagemin';
import { legacyPlugin } from './legacy';
import { pwaPlugin } from './pwa';
import { svgIconsPlugin } from './svgIcons';
import { visualizerPlugin } from './visualizer';
import { viteYaml } from './yaml';

export const createVitePlugins = (metaEvn: ImportMetaEnv, isProd: boolean, isBuild: boolean) => {
    const {
        VITE_PLUGIN_LEGACY: legacy,
        VITE_PLUGIN_BUILD_COMPRESS_TYPE: compressType,
        VITE_PLUGIN_BUILD_COMPRESS_DELETE_ORIGIN_FILE: shouldBuildCompressDeleteFile,
        VITE_PLUGIN_USE_IMAGEMIN: shouldUseImagemin,
    } = metaEvn;

    const vitePlugins: (PluginOption | PluginOption[])[] = [];
    vitePlugins.push(react());
    vitePlugins.push(...viteHtmlPlugins(metaEvn, isProd, isBuild)); // 注入配置字符串
    vitePlugins.push(svgIconsPlugin(isProd)); // svg 图标资源整合管理
    vitePlugins.push(...viteYaml()); // yml导入
    vitePlugins.push(purgeIcons({})); // 图片管理
    vitePlugins.push(...visualizerPlugin()); // 可视化依赖分析，非生产模式
    legacy === 'true' && vitePlugins.push(...legacyPlugin()); // 低级浏览器支持

    if (isProd) {
        // 生成模式执行
        vitePlugins.push(
            viteCompressionPlugin(compressType, shouldBuildCompressDeleteFile === 'true'), // 压缩
        );
        shouldUseImagemin === 'true' && vitePlugins.push(imageminPlugin()); // 压缩图片 vite-plugin-imagemin 貌似这个插件不支持 m1 芯片 以后再检查吧
        vitePlugins.push(...pwaPlugin(metaEvn)); // 缓存应用什么的
    }

    return vitePlugins;
};

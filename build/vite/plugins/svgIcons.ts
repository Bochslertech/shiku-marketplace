import type { Plugin } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

export function svgIconsPlugin(isProd: boolean) {
    const svgIconsPlugin = createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets2/svg')],
        svgoOptions: isProd,
        // default
        symbolId: 'icon-[dir]-[name]',
    });
    return svgIconsPlugin as unknown as Plugin;
}

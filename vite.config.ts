import { defineConfig, loadEnv, UserConfig } from 'vite';
import path from 'path';
import { createVitePlugins } from './build/vite/plugins';
import { ImportMetaEnv } from './src/vite-env';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    console.warn('command and mode->', command, mode);

    const readEnv = loadEnv(mode, './env');
    // @ts-ignore force transform, not a bit problem for string variable
    const metaEvn: ImportMetaEnv = readEnv; // 导入设置的环境变量，会根据选择的 mode 选择文件
    console.warn('IMPORT_META_ENV -> ', metaEvn); // 输出加载的环境变量
    // but matters other types

    // port
    let port = parseInt(metaEvn.VITE_PORT ?? '3000');
    if (isNaN(port)) port = 3000;
    console.log('port ->', port);

    const isBuild = command === 'build';
    const isProd = command === 'build' && mode.startsWith('production');

    console.warn('isBuild and isProd ->', isProd, isProd);

    // console and debugger
    const drop_console = isProd || metaEvn.VITE_DROP_CONSOLE === 'true';
    const drop_debugger = isProd || metaEvn.VITE_DROP_DEBUGGER === 'true';

    let define: any = {};
    if (!isBuild) {
        define = {
            ...define,
            // ? 本来 astrox me 登录需要的，但是打包总是失败，html 里面引入了，这里就不需要了
            'process.env.NODE_ENV': JSON.stringify(mode), // 接口文件里面需要用来判断 莫名其妙要加双引号
            'process.env': process.env, // 环境变量
        };
    }

    const common: UserConfig = {
        publicDir: 'public', // 该目录下文件会原封不动存放至 dist
        mode, // 运行模式
        define,
        plugins: [...createVitePlugins(metaEvn, isProd, isBuild)], // 插件
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'), // @符号要解析
            },
            extensions: ['.js', '.ts', '.jsx', '.tsx'], // import 可以省略的拓展名
        },
        build: {
            minify: isProd ? 'terser' : false, // 默认为 esbuild，它比 terser 快 20-40 倍，压缩率只差 1%-2%
            terserOptions: isProd && {
                compress: {
                    drop_console, // 生产环境去除 console
                    drop_debugger, // 生产环境去除 debugger
                },
            },
        },
        envDir: 'env',
        envPrefix: ['BUILD', 'CONNECT', 'ALCHEMY', 'YUMI'],
        clearScreen: false,
        // optimizeDeps: {
        //     esbuildOptions: {
        //         target: 'esnext',
        //         // Node.js global to browser globalThis
        //         // define: {
        //         //     global: 'globalThis',
        //         // },
        //         supported: {
        //             bigint: true,
        //         },
        //     },
        // },
    };

    if (!isProd) {
        return {
            // serve 独有配置 开发模式
            ...common,
            server: {
                hmr: true, // 热更新
                proxy: {
                    '/api': {
                        target: 'http://localhost',
                        changeOrigin: true,
                        rewrite: (path) => path,
                    },
                },
                cors: true,
                host: '0.0.0.0',
                port,
            },
        };
    } else {
        return {
            // build 独有配置 生产模式
            ...common,
        };
    }
});

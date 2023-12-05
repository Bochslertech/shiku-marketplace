// 静态资源可以使用 cdn 代理
export const cdn = (
    url: string | undefined,
    origin?: string, // 如果需要补全链接的话, 使用的源地址
    modify?: (cdn: string) => string, // 如果要对原始 url 进行修饰的话
): string | undefined => {
    if (url === undefined) return undefined;
    if (!url.trim()) return url; // 没有内容
    if (url.startsWith('https://cdn.yumi.io')) return url; // 已经代理了

    // 0. 拦截不需要代理的地址
    // for (const key of [
    //     'pk6rk-6aaaa-aaaae-qaazq-cai', // BTC Flower 不需要代理
    // ]) {
    //     if (url.indexOf(key) >= 0) return url;
    // }

    // 1. 补全链接
    if (!url.match(/^https?:\/\//)) {
        url = `${
            origin ?? location.origin // 不写就表示使用当前访问的地址
        }${url}`;
    }

    // 2. 检查是否要进行编码
    url = decodeURIComponent(url); // 先解码,防止已经有编码过的内容了
    let path = (() => {
        let index = url.indexOf('/', 9); // 寻找第一个 /
        if (index >= 0) return url.substring(index);
        // 没有 / 的话, 看有没有参数了
        index = url.indexOf('?');
        if (index === -1) return '';
        return url.substring(index);
    })();
    url = encodeURIComponent(url); // 再编码

    // 3. 返回代理
    if (path.indexOf('url=') >= 0) path = '';
    const hasSearch = path.indexOf('?') >= 0;

    let cdn = `https://cdn.yumi.io${path}${!hasSearch ? '?' : ''}${
        path.endsWith('?') ? '' : '&'
    }url=${url}`;
    if (modify) cdn = modify(cdn); // 是否要修饰一下
    return cdn;
};

// 图片指定变形方向
export const cdn_by_resize = (
    url: string | undefined,
    {
        width,
        height,
        fit,
        quality,
    }: {
        width?: number;
        height?: number;
        fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
        quality?: number;
    },
    origin?: string,
) =>
    cdn(url, origin, (cdn) => {
        const changed = width || height || fit || quality;
        if (!changed) return cdn;
        const index = cdn.lastIndexOf('?');
        if (index === -1) cdn += '?';
        if (width) cdn += `${cdn.endsWith('?') ? '' : '&'}width=${width}`;
        if (height) cdn += `${cdn.endsWith('?') ? '' : '&'}height=${height}`;
        if (fit) cdn += `${cdn.endsWith('?') ? '' : '&'}fit=${fit}`;
        if (quality) cdn += `${cdn.endsWith('?') ? '' : '&'}quality=${quality}`;
        return cdn;
    });

// 静态罐子的资源路径
export const ASSETS_CANISTER_ORIGIN = 'https://yg2aj-yqaaa-aaaai-qpbqq-cai.raw.icp0.io/frontend';

// 从静态资源罐子加载资源
export const cdn_by_assets = (url: string | undefined) => cdn(url, ASSETS_CANISTER_ORIGIN);

// url 包装
export const url_cdn = (
    url: string | undefined,
    origin?: string, // 如果需要补全链接的话, 使用的源地址
    modify?: (cdn: string) => string, // 如果要对原始 url 进行修饰的话
): string | undefined => `url('${cdn(url, origin, modify)}')`;
export const url_cdn_by_resize = (
    url: string | undefined,
    options: {
        width?: number;
        height?: number;
        fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
        quality?: number;
    },
    origin?: string,
) => `url('${cdn_by_resize(url, options, origin)}')`;
export const url_cdn_by_assets = (url: string | undefined) => `url('${cdn_by_assets(url)}')`;

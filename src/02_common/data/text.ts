// 显示简短的文本
export const shrinkText = (
    text: string | undefined,
    prefix = 5,
    suffix = 5,
): string | undefined => {
    if (!text) return text;
    const max_length = prefix + 3 + suffix; // 保留的字符串长度
    if (text.length <= max_length) return text;
    const prefix_text = prefix === 0 ? '' : text.slice(0, prefix); // 前面取

    const suffix_text = suffix === 0 ? '' : text.slice(-suffix); // 后面取
    return `${prefix_text}...${suffix_text}`; // 中间加上省略号
};

// 显示简短的文本
export const shrinkPrincipal = (text: string | undefined): string | undefined =>
    shrinkText(text, 5, 3);
// 显示简短的文本
export const shrinkAccount = (text: string | undefined): string | undefined =>
    shrinkText(text, 4, 4);

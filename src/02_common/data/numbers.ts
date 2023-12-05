// 是否指定精度的数字
export const isValidNumber = (value: string | undefined, max_decimals?: number): boolean => {
    if (value === undefined) return false;
    if (max_decimals === undefined) return !!value.match(/^[1-9]\d*$/);
    if (max_decimals <= 0) throw new Error(`decimal can not be ${max_decimals}`);
    if (max_decimals === 1)
        return (
            !!value.match(/^[1-9]\d*(\.[0-9])?$/) ||
            !!value.match(/^0(\.[0-9])?$/) ||
            !!value.match(/^[1-9]\d*\.$/) ||
            !!value.match(/^0\.$/)
        );
    return (
        RegExp(`^[1-9]\\d*(\\.\\d{1,${max_decimals}})?$`).test(value) ||
        RegExp(`^0(\\.\\d{1,${max_decimals}})?$`).test(value) ||
        RegExp(`^[1-9]\\d*\\.$`).test(value) ||
        RegExp(`^0\\.$`).test(value)
    );
};

// 按指数计算数字
export const exponentNumber = (value: string, decimals: number): string => {
    if (decimals !== Math.floor(decimals)) throw new Error(`decimals must be a integer`);
    if (decimals === 0) return value;
    switch (value.split('.').length) {
        case 1:
            value = value + '.'; // 没有小数点就加上
            break;
        case 2:
            // 有 1 个小数点
            break;
        default:
            throw new Error(`can not calculate number: ${value}`);
    }
    const chars = value.split('');

    // 先在对应方向增加 0
    const zeros: string[] = [];
    const d = Math.abs(decimals);
    for (let i = 0; i < d; i++) zeros.push('0');
    if (decimals > 0) chars.splice(chars.length, 0, ...zeros);
    else chars.splice(0, 0, ...zeros);

    // 移动小数点
    const index = chars.findIndex((s) => s === '.');
    chars.splice(index, 1); // 移除小数点
    chars.splice(index + decimals, 0, '.'); // 插入小数点

    // 移除后面的 0
    do {
        const current = chars.length - 1;
        if (chars[current] === '0') chars.splice(current, 1);
    } while (chars[chars.length - 1] === '0');

    // 移除前面的 0
    do {
        if (chars[0] === '0') chars.splice(0, 1);
    } while (chars[0] === '0');

    value = chars.join('');
    if (value.startsWith('.')) value = '0' + value;
    if (value.endsWith('.')) value = value.substring(0, value.length - 1);
    return value;
};

// 数字每隔 3 位加上逗号
export const thousandComma = (text_number: string): string => {
    const splits = text_number.split('.');
    const res1: string[] = [];
    const res2: string[] = [];
    splits[0]
        .split('')
        .reverse()
        .map((item, i) => {
            if (i % 3 == 0 && i != 0) res1.push(',');
            res1.push(item);
        });
    if (splits.length > 1) {
        splits[1].split('').map((item, i) => {
            if (i % 3 == 0 && i != 0) res2.push(',');
            res2.push(item);
        });
    }
    return res1.reverse().join('') + (splits.length > 1 ? '.' + res2.join('') : '');
};

// 数字每隔 3 位加上逗号 // ? 只有整数部分需要逗号分隔
export const thousandCommaOnlyInteger = (text_number: string): string => {
    const splits = text_number.split('.');
    const res1: string[] = [];
    splits[0]
        .split('')
        .reverse()
        .map((item, i) => {
            if (i % 3 == 0 && i != 0) res1.push(',');
            res1.push(item);
        });
    return res1.reverse().join('') + (splits.length > 1 ? '.' + splits[1] : '');
};

import { isPrincipalText } from '../ic/principals';

// 自定义序列化
// ! 下面是否无法恢复类型的
// ? 1. bigint -> string
// ? 2. principal -> string
export const customStringify = (v: any): string =>
    JSON.stringify(v, (_key, value) => {
        if (typeof value === 'bigint') return `${value}`;
        if (value && typeof value === 'object' && value['_isPrincipal'] === true) {
            return value.toText();
        }
        if (
            value &&
            typeof value === 'object' &&
            value['__principal__'] &&
            isPrincipalText(value['__principal__'])
        ) {
            return value['__principal__'];
        }
        return value;
    });

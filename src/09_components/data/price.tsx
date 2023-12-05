import { TokenInfo } from '@/01_types/nft';
import { cn } from '@/02_common/cn';
import { exponentNumber, thousandComma } from '@/02_common/data/numbers';

// ================== 显示代币价格 ==================

function TokenPrice({
    value,
    className,
}: {
    value: {
        value: string | undefined; // 不考虑精度的文本
        decimals?:
            | { type: 'unit'; value: number | string } // 例如 100000000
            | { type: 'exponent'; value: number | string }; // 例如 8
        symbol?: string; // 是否显示单位
        token?: TokenInfo; // 带有 exponent 和 symbol, 优先独立配置的
        scale?: number | ((n: number) => number); // 小数位取整, 参数是实际值
        paddingEnd?: number;
        thousand?: {
            symbol?: 'K' | 'k'; // 是否除以 1000 显示
            comma?: boolean; // 是否每隔 3 位显示逗号
            commaFunc?: (n: string) => string; // 是否指定数字加逗号的方式
        };
        symbolClassName?: boolean;
    };
    className?: string;
}) {
    if (value.value === undefined) return <span className="text-[14px] leading-tight">--</span>;
    const decimals = (() => {
        if (value.decimals?.type === 'unit') {
            if (!`${value.decimals.value}`.match(/^10+$/))
                throw new Error(`wrong decimals: ${value.decimals.value}`);
            return Math.log10(Number(value.decimals.value));
        }
        if (value.decimals?.type === 'exponent') return Number(value.decimals.value);
        if (value.token?.decimals) return Number(value.token.decimals);
        return 0; // 默认不改变
    })();

    const symbol = (() => {
        if (value.symbol !== undefined) return value.symbol;
        if (value.token?.symbol) return value.token.symbol;
        return undefined; // 默认不显示单位
    })();

    let v = Number(exponentNumber(value.value, -decimals));

    let thousand_symbol: 'K' | 'k' | undefined = undefined;
    if (value.thousand !== undefined && value.thousand.symbol && v >= 1000) {
        thousand_symbol = value.thousand.symbol;
        v = v / 1000;
    }

    let show: string = `${v}`;
    if (value?.scale !== undefined) {
        if (typeof value.scale === 'number') show = v.toFixed(value.scale);
        if (typeof value.scale === 'function') show = v.toFixed(value.scale(v));
    }

    // 是否要在尾部补齐 0
    if (value?.paddingEnd && value.paddingEnd > 0) {
        if (show.indexOf('.') === -1) show = show + '.';
        const index = show.indexOf('.');
        for (let i = show.length - 1 - index; i < value.paddingEnd; i++) show = show + '0';
    } else if (show.indexOf('.') >= 0) {
        while (show.endsWith('0')) show = show.substring(0, show.length - 1);
    }
    if (show.endsWith('.')) show = show.substring(0, show.length - 1);

    return (
        <span
            className={cn(['font-inter-semibold text-[12px] leading-4 md:text-[16px]'], className)}
        >
            {value.thousand?.comma && value.thousand.commaFunc && value.thousand.commaFunc(show)}
            {value.thousand?.comma && !value.thousand.commaFunc && thousandComma(show)}
            {!value.thousand?.comma && show}
            {thousand_symbol ?? ''}
            {symbol && (
                <span
                    className={cn([
                        !value.symbolClassName && 'text-[12px] md:text-[14px]',
                        value.symbolClassName && 'ml-2',
                    ])}
                >
                    {symbol}
                </span>
            )}
        </span>
    );
}

export default TokenPrice;

import { TokenInfo } from '@/01_types/nft';
import { cn } from '@/02_common/cn';
import { exponentNumber } from '@/02_common/data/numbers';
import { useTokenRate } from '@/08_hooks/interval/token_rate';

function Usd({
    value,
    className,
}: {
    value: {
        value: string | undefined;
        decimals?:
            | { type: 'unit'; value: number | string } // 例如 100000000
            | { type: 'exponent'; value: number | string }; // 例如 8
        symbol?: string; // 是否显示单位
        token?: TokenInfo; // 带有 exponent 和 symbol, 优先独立配置的
        scale?: number | ((n: number) => number); // 小数位取整, 参数是实际值
        paddingEnd?: number;
    };
    className?: string;
}) {
    const { icp_usd, ogy_usd } = useTokenRate();

    if (value.value === undefined) return <span>--</span>;

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
        if (value.symbol) return value.symbol;
        if (value.token?.symbol) return value.token.symbol;
        return undefined; // 默认不显示单位
    })();

    const v = Number(exponentNumber(value.value, -decimals));

    let vv: number | undefined = undefined;
    switch (symbol) {
        case 'ICP':
            if (icp_usd !== undefined) vv = v * Number(icp_usd);
            break;
        case 'OGY':
            if (ogy_usd !== undefined) vv = v * Number(ogy_usd);
            break;
    }

    if (vv === undefined) return <span className={cn(['usd', className])}>--</span>;

    let show: string = `${vv}`;

    if (value?.scale !== undefined) {
        if (typeof value.scale === 'number') show = vv.toFixed(value.scale);
        if (typeof value.scale === 'function') show = vv.toFixed(value.scale(vv));
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

    return <span className={cn(['text-xs text-symbol', className])}>(${show})</span>;
}

export default Usd;

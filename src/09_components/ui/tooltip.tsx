import { Tooltip as AntdTooltip, TooltipProps } from 'antd';

export default function Tooltip({ children, ...props }: TooltipProps) {
    return (
        <AntdTooltip
            {...props}
            color="white"
            overlayInnerStyle={{
                color: '#000',
                width: 'fit-content',
                fontFamily: 'Inter-Semibold',
                ...props.overlayInnerStyle,
            }}
        >
            {children}{' '}
        </AntdTooltip>
    );
}

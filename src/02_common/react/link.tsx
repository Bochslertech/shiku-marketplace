import { Link, useNavigate } from 'react-router-dom';

// 嵌套 Link 的点击事件需要拦截, 有特定功能的按钮并不是想让用户进行跳转
export const preventLink = (callback: (e: any) => void) => (e: any) => {
    callback(e);
    e.preventDefault();
    e.stopPropagation();
};

// 防止点击穿透
export const justPreventLink = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
};

// 确保是有效的链接
export const AssureLink = ({
    to,
    className,
    children,
}: {
    to?: string;
    className?: string;
    children: any;
}) => {
    if (!to) return <div className={className}>{children}</div>;
    return (
        <Link to={to} className={className}>
            {children}
        </Link>
    );
};

// 非连接方式的点击
export const AssureLinkByNavigate = ({
    to,
    className,
    children,
}: {
    to?: string;
    className?: string;
    children: any;
}) => {
    const navigate = useNavigate();
    if (!to) return <div className={className}>{children}</div>;
    const goto = () => navigate(to);
    return (
        <div onClick={goto} className={className}>
            {children}
        </div>
    );
};

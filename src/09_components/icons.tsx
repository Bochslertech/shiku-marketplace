import { MouseEventHandler } from 'react';
import { cdn_by_assets } from '@/02_common/cdn';

type H = MouseEventHandler;

const wrap_path = (path: string): string => cdn_by_assets(`/svgs/${path}`)!;

const Icon = ({
    src,
    onClick,
    className,
    alt = 'icon',
}: {
    src: string;
    onClick?: MouseEventHandler;
    className?: string;
    alt?: string;
}) => {
    return <img src={src} onClick={onClick} className={className} alt={alt} />;
};

// logo
export const IconLogoYumi = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({ src: wrap_path('logo/yumi.svg'), onClick, className, alt: 'yumi logo' });

export const IconLogoShiku = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({ src: '/img/logo/shiku.svg', onClick, className, alt: 'yumi logo' });

export const IconLogoYumiGold = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({ src: wrap_path('/logo/yumi-gold.svg'), onClick, className, alt: 'yumi gold logo' });

export const IconLogoYumiWhite = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({ src: wrap_path('logo/yumi-white.svg'), onClick, className, alt: 'yumi logo' });

// ledger
export const IconLogoLedgerIcp = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({ src: wrap_path('ledger/icp.svg'), onClick, className, alt: 'icp logo' });
export const IconLogoLedgerOgy = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({ src: wrap_path('ledger/ogy.svg'), onClick, className, alt: 'ogy logo' });

export const IconLogoLedger = ({ symbol, className }: { symbol?: string; className?: string }) => {
    if (symbol === 'ogy') return <IconLogoLedgerOgy className={className} />;
    return <IconLogoLedgerIcp className={className} />;
};

// other

export const IconWallet = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({ src: wrap_path('wallet.svg'), onClick, className, alt: 'wallet icon' });

export const IconLaunchpadFailed = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({ src: wrap_path('launchpad-failed.svg'), onClick, className, alt: 'failed icon' });

// action

export const IconCopy = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({ src: wrap_path('action/copy.svg'), onClick, className, alt: 'copy icon' });

export const IconDirectionDownSelect = ({
    onClick,
    className,
}: {
    onClick?: H;
    className?: string;
}) => Icon({ src: wrap_path('direction/down-select.svg'), onClick, className, alt: 'down icon' });

// close
export const IconCloseModal = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({ src: wrap_path('action/close/modal.svg'), onClick, className, alt: 'close icon' });

// cart
export const IconCartWhiteForbidden = ({
    onClick,
    className,
}: {
    onClick?: H;
    className?: string;
}) => Icon({ src: wrap_path('cart/cart-white-no.svg'), onClick, className, alt: 'cart icon' });

// arrow
export const IconArrowFeaturedRight = ({
    onClick,
    className,
}: {
    onClick?: H;
    className?: string;
}) =>
    Icon({
        src: wrap_path('arrow/featured/right.svg'),
        onClick,
        className,
        alt: 'right icon',
    });
export const IconArrowFeaturedLeft = ({
    onClick,
    className,
}: {
    onClick?: H;
    className?: string;
}) =>
    Icon({
        src: wrap_path('arrow/featured/left.svg'),
        onClick,
        className,
        alt: 'left icon',
    });

export const PreloadIcons = () => {
    return (
        <div className="invisible absolute">
            <IconLogoShiku />
            <IconLogoLedgerIcp />
            <IconLogoLedgerOgy />
            <IconWallet />
            <IconCloseModal />
        </div>
    );
};

export default Icon;

// ============================= 直接包含图片 =============================

export const IconKycNa = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI3ByZWZpeF9fY2xpcDBfMzEzOF8xMDMwNikiPjxwYXRoIGQ9Ik0xNi44MTcgOC4wODJsLTEuNjUyLTEuMDk0YS44NjYuODY2IDAgMDEtLjM2OS0uODlsLjM5Mi0xLjk0NWExLjEyNyAxLjEyNyAwIDAwLS4zMDItMS4wMDggMS4xIDEuMSAwIDAwLTEuMDA4LS4zMDFsLTEuOTQ0LjM5MWEuODYxLjg2MSAwIDAxLS44OTEtLjM2OUw5Ljk0NSAxLjIxNUExLjExIDEuMTEgMCAwMDkuMDE4LjcyYy0uMzc0IDAtLjcyLjE4NC0uOTI3LjQ5NUw2Ljk5MyAyLjg2NmEuODY2Ljg2NiAwIDAxLS44OTEuMzdsLTEuOTQ0LS4zOTJhMS4xMjcgMS4xMjcgMCAwMC0xLjAwOC4zMDEgMS4xIDEuMSAwIDAwLS4zMDIgMS4wMDhsLjM5MiAxLjk0NGEuODcuODcgMCAwMS0uMzY5Ljg5MUwxLjIxOSA4LjA4NmExLjExIDEuMTEgMCAwMC0uNDk1LjkyN2MwIC4zNzQuMTg1LjcyLjQ5NS45MjdsMS42NTIgMS4wOTlhLjg2Ni44NjYgMCAwMS4zNjkuODlsLS4zOTIgMS45NDRjLS4wNzIuMzY1LjA0MS43NDMuMzAyIDEuMDA5YTEuMSAxLjEgMCAwMDEuMDA4LjMwMWwxLjk0NC0uMzkyYS44NjEuODYxIDAgMDEuODkxLjM3bDEuMDk4IDEuNjUxYy4yMDcuMzEuNTUzLjQ5NS45MjcuNDk1LjM3MyAwIC43Mi0uMTg0LjkyNy0uNDk1bDEuMDk4LTEuNjUyYS44NjYuODY2IDAgMDEuODkxLS4zNjlsMS45NDQuMzkyYy4zNjQuMDcyLjc0Mi0uMDQgMS4wMDgtLjMwMWExLjEgMS4xIDAgMDAuMzAyLTEuMDA4bC0uMzkyLTEuOTQ0YS44Ny44NyAwIDAxLjM2OS0uODkxbDEuNjUyLTEuMDk5YTEuMTE5IDEuMTE5IDAgMDAwLTEuODU4em0tNC4zODMtLjM4N2wtMy43MTggMy43OGEuNTMuNTMgMCAwMS0uMzg3LjE2Mi41MzIuNTMyIDAgMDEtLjM1NS0uMTM1bC0yLjQzLTIuMTQ3YS41NC41NCAwIDAxLS4wNS0uNzYuNTQuNTQgMCAwMS43NjEtLjA1bDIuMDQ3IDEuODEgMy4zNTctMy40MTZhLjU0LjU0IDAgMDEuNzY1LS4wMDUuNTM1LjUzNSAwIDAxLjAxLjc2MXoiIGZpbGw9InNpbHZlciIvPjxjaXJjbGUgY3g9IjkuNSIgY3k9IjkuNSIgcj0iNC41IiBmaWxsPSJzaWx2ZXIiLz48cGF0aCBkPSJNMTIuOTAzIDYuMjM2di4xNzljLS4yMiAwLS42MDIuMDUzLS43MDguMTYtLjEwNy4xMDYtLjIzMi4zNDQtLjM3Ni43MTNMOS43MzMgMTIuNTZsLTEuMzM3LjAwNC0yLjMwMy01LjE2M2MtLjE4Mi0uNDA3LS4zMzgtLjY3My0uNDctLjc5OC0uMTMxLS4xMjYtLjMwNy0uMTg4LS41MjYtLjE4OHYtLjE3OWgzLjYwMXYuMTc5Yy0uMjc1IDAtLjcwNy4wMi0uODA1LjA2LS4wOTcuMDQyLS4xNDUuMTM3LS4xNDUuMjg3IDAgLjA4OC4wNTEuMjQ4LjE1NS40OC4xMDMuMjMyLjE4LjQwNy4yMy41MjZsMS40MTggMy4xNjQgMS4zOC0zLjQzOGMuMDM4LS4xMTkuMDgtLjI0LjEyNC0uMzY2YTEuMjkgMS4yOSAwIDAwLjA1Ny0uMjgxYzAtLjE3Ni0uMDYxLS4yOTEtLjE4My0uMzQ4LS4xMjItLjA1Ni0uNjUtLjA4NC0uODYyLS4wODR2LS4xNzloMi44MzZ6IiBmaWxsPSIjZmZmIi8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0icHJlZml4X19jbGlwMF8zMTM4XzEwMzA2Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDE4djE4SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+',
        onClick,
        className,
    });
export const IconKycTier1 = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI3ByZWZpeF9fY2xpcDBfNzgxNF8xNTk4NCkiPjxwYXRoIGQ9Ik0yMy4yODQgMTAuNjUybC0yLjM5LTEuNTgyYTEuMjUzIDEuMjUzIDAgMDEtLjUzNC0xLjI5bC41NjctMi44MTJhMS42MzEgMS42MzEgMCAwMC0uNDM2LTEuNDU4IDEuNTkxIDEuNTkxIDAgMDAtMS40NTktLjQzN2wtMi44MTMuNTY3YTEuMjQ2IDEuMjQ2IDAgMDEtMS4yODktLjUzNEwxMy4zNDEuNzE2QzEzLjA0MS4yNjcgMTIuNTQxIDAgMTIgMGMtLjU0IDAtMS4wNDIuMjY3LTEuMzQxLjcxNkw5LjA3IDMuMTA2Yy0uMjguNDIzLS43ODguNjMxLTEuMjkuNTM0bC0yLjgxMi0uNTY3YTEuNjMxIDEuNjMxIDAgMDAtMS40NTguNDM3IDEuNTkxIDEuNTkxIDAgMDAtLjQzNyAxLjQ1OGwuNTY3IDIuODEzYTEuMjU4IDEuMjU4IDAgMDEtLjUzNCAxLjI4OWwtMi4zOSAxLjU4OWMtLjQ0OS4zLS43MTYuOC0uNzE2IDEuMzQxIDAgLjU0LjI2NyAxLjA0Mi43MTYgMS4zNDFsMi4zOSAxLjU4OWMuNDIzLjI4LjYzMS43ODguNTM0IDEuMjlsLS41NjcgMi44MTJhMS42MzEgMS42MzEgMCAwMC40MzcgMS40NTkgMS41OSAxLjU5IDAgMDAxLjQ1OC40MzZsMi44MTMtLjU2N2ExLjI0NiAxLjI0NiAwIDAxMS4yODkuNTM0bDEuNTg5IDIuMzljLjMuNDQ5LjguNzE2IDEuMzQxLjcxNi41NCAwIDEuMDQyLS4yNjcgMS4zNDEtLjcxNmwxLjU4OS0yLjM5Yy4yOC0uNDIzLjc4OC0uNjMxIDEuMjktLjUzNGwyLjgxMi41NjdhMS42MzEgMS42MzEgMCAwMDEuNDU5LS40MzZjLjM4NC0uMzg1LjU0Ni0uOTI1LjQzNi0xLjQ1OWwtLjU2Ny0yLjgxM2ExLjI1NyAxLjI1NyAwIDAxLjUzNC0xLjI4OWwyLjM5LTEuNTg5YTEuNjE5IDEuNjE5IDAgMDAwLTIuNjl6bS02LjM0Mi0uNTZsLTUuMzc4IDUuNDdhLjc2OC43NjggMCAwMS0uNTYuMjM0Ljc3Ljc3IDAgMDEtLjUxNS0uMTk1bC0zLjUxNi0zLjEwNmEuNzgyLjc4MiAwIDAxLS4wNzEtMS4xLjc4Mi43ODIgMCAwMTEuMS0uMDcybDIuOTYzIDIuNjE3IDQuODU3LTQuOTQyYS43ODIuNzgyIDAgMDExLjEwNy0uMDA2Ljc3NC43NzQgMCAwMS4wMTMgMS4xeiIgZmlsbD0iIzcxNDlGRiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjYuNjY3IiBmaWxsPSIjNzE0OUZGIi8+PGcgY2xpcC1wYXRoPSJ1cmwoI3ByZWZpeF9fY2xpcDFfNzgxNF8xNTk4NCkiPjxwYXRoIGQ9Ik0xNi4yOTcgOC4zMTV2LjIzOGMtLjI5MiAwLS44MDIuMDctLjk0NC4yMTMtLjE0Mi4xNDItLjMxLjQ2LS41MDEuOTUybC0yLjc4MSA3LjAyOS0xLjc4Mi4wMDUtMy4wNzItNi44ODRjLS4yNDItLjU0Mi0uNDUtLjg5Ny0uNjI2LTEuMDY1LS4xNzUtLjE2Ny0uNDA5LS4yNS0uNzAyLS4yNXYtLjIzOGg0LjgwMnYuMjM4Yy0uMzY3IDAtLjk0My4wMjctMS4wNzMuMDgxLS4xMy4wNTUtLjE5NC4xODItLjE5NC4zODMgMCAuMTE3LjA2OS4zMy4yMDYuNjM5LjEzOC4zMDkuMjQuNTQzLjMwNy43MDFsMS44OSA0LjIxOSAxLjg0MS00LjU4NGMuMDUtLjE1OC4xMDYtLjMyLjE2NS0uNDg4LjA1MS0uMTgzLjA3Ni0uMzA4LjA3Ni0uMzc1IDAtLjIzNC0uMDgxLS4zODgtLjI0NC0uNDYzLS4xNjMtLjA3NS0uODY1LS4xMTMtMS4xNS0uMTEzdi0uMjM4aDMuNzgyeiIgZmlsbD0iI2ZmZiIvPjwvZz48cGF0aCBkPSJNMTggMTF2NmgtMS4yOTF2LTQuOTQyaC0uMDQyTDE1IDEyLjk1NHYtLjk5NkwxNi43NzEgMTFIMTh6IiBmaWxsPSIjZmZmIi8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0icHJlZml4X19jbGlwMF83ODE0XzE1OTg0Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDI0djI0SDB6Ii8+PC9jbGlwUGF0aD48Y2xpcFBhdGggaWQ9InByZWZpeF9fY2xpcDFfNzgxNF8xNTk4NCI+PHBhdGggZmlsbD0iI2ZmZiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS43NiA3LjIpIiBkPSJNMCAwaDEwLjY2N3YxMC42NjdIMHoiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=',
        onClick,
        className,
    });
export const IconKycTier2 = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI3ByZWZpeF9fY2xpcDBfNzgxNF8xNjAxNCkiPjxwYXRoIGQ9Ik0yMy4yODQgMTAuNjUybC0yLjM5LTEuNTgyYTEuMjUzIDEuMjUzIDAgMDEtLjUzNC0xLjI5bC41NjctMi44MTJhMS42MzEgMS42MzEgMCAwMC0uNDM2LTEuNDU4IDEuNTkxIDEuNTkxIDAgMDAtMS40NTktLjQzN2wtMi44MTMuNTY3YTEuMjQ2IDEuMjQ2IDAgMDEtMS4yODktLjUzNEwxMy4zNDEuNzE2QzEzLjA0MS4yNjcgMTIuNTQxIDAgMTIgMGMtLjU0IDAtMS4wNDIuMjY3LTEuMzQxLjcxNkw5LjA3IDMuMTA2Yy0uMjguNDIzLS43ODguNjMxLTEuMjkuNTM0bC0yLjgxMi0uNTY3YTEuNjMxIDEuNjMxIDAgMDAtMS40NTguNDM3IDEuNTkxIDEuNTkxIDAgMDAtLjQzNyAxLjQ1OGwuNTY3IDIuODEzYTEuMjU4IDEuMjU4IDAgMDEtLjUzNCAxLjI4OWwtMi4zOSAxLjU4OWMtLjQ0OS4zLS43MTYuOC0uNzE2IDEuMzQxIDAgLjU0LjI2NyAxLjA0Mi43MTYgMS4zNDFsMi4zOSAxLjU4OWMuNDIzLjI4LjYzMS43ODguNTM0IDEuMjlsLS41NjcgMi44MTJhMS42MzEgMS42MzEgMCAwMC40MzcgMS40NTkgMS41OSAxLjU5IDAgMDAxLjQ1OC40MzZsMi44MTMtLjU2N2ExLjI0NiAxLjI0NiAwIDAxMS4yODkuNTM0bDEuNTg5IDIuMzljLjMuNDQ5LjguNzE2IDEuMzQxLjcxNi41NCAwIDEuMDQyLS4yNjcgMS4zNDEtLjcxNmwxLjU4OS0yLjM5Yy4yOC0uNDIzLjc4OC0uNjMxIDEuMjktLjUzNGwyLjgxMi41NjdhMS42MzEgMS42MzEgMCAwMDEuNDU5LS40MzZjLjM4NC0uMzg1LjU0Ni0uOTI1LjQzNi0xLjQ1OWwtLjU2Ny0yLjgxM2ExLjI1NyAxLjI1NyAwIDAxLjUzNC0xLjI4OWwyLjM5LTEuNTg5YTEuNjE5IDEuNjE5IDAgMDAwLTIuNjl6bS02LjM0Mi0uNTZsLTUuMzc4IDUuNDdhLjc2OC43NjggMCAwMS0uNTYuMjM0Ljc3Ljc3IDAgMDEtLjUxNS0uMTk1bC0zLjUxNi0zLjEwNmEuNzgyLjc4MiAwIDAxLS4wNzEtMS4xLjc4Mi43ODIgMCAwMTEuMS0uMDcybDIuOTYzIDIuNjE3IDQuODU3LTQuOTQyYS43ODIuNzgyIDAgMDExLjEwNy0uMDA2Ljc3NC43NzQgMCAwMS4wMTMgMS4xeiIgZmlsbD0iIzcxNDlGRiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjYuNjY3IiBmaWxsPSIjNzE0OUZGIi8+PGcgY2xpcC1wYXRoPSJ1cmwoI3ByZWZpeF9fY2xpcDFfNzgxNF8xNjAxNCkiPjxwYXRoIGQ9Ik0xNi4yOTcgOC4zMTV2LjIzOGMtLjI5MiAwLS44MDIuMDctLjk0NC4yMTMtLjE0Mi4xNDItLjMxLjQ2LS41MDEuOTUybC0yLjc4MSA3LjAyOS0xLjc4Mi4wMDUtMy4wNzItNi44ODRjLS4yNDItLjU0Mi0uNDUtLjg5Ny0uNjI2LTEuMDY1LS4xNzUtLjE2Ny0uNDA5LS4yNS0uNzAyLS4yNXYtLjIzOGg0LjgwMnYuMjM4Yy0uMzY3IDAtLjk0My4wMjctMS4wNzMuMDgxLS4xMy4wNTUtLjE5NC4xODItLjE5NC4zODMgMCAuMTE3LjA2OS4zMy4yMDYuNjM5LjEzOC4zMDkuMjQuNTQzLjMwNy43MDFsMS44OSA0LjIxOSAxLjg0MS00LjU4NGMuMDUtLjE1OC4xMDYtLjMyLjE2NS0uNDg4LjA1MS0uMTgzLjA3Ni0uMzA4LjA3Ni0uMzc1IDAtLjIzNC0uMDgxLS4zODgtLjI0NC0uNDYzLS4xNjMtLjA3NS0uODY1LS4xMTMtMS4xNS0uMTEzdi0uMjM4aDMuNzgyeiIgZmlsbD0iI2ZmZiIvPjwvZz48cGF0aCBkPSJNMTUuMDM0IDE3di0uNzc1bDIuMDA4LTIuMDE0Yy4xOTItLjE5OS4zNTItLjM3NS40OC0uNTI5LjEyOS0uMTU0LjIyNS0uMzAzLjI4OS0uNDQ4LjA2NC0uMTQ0LjA5Ni0uMjk5LjA5Ni0uNDYyYS44OS44OSAwIDAwLS4xMjUtLjQ4LjgzMy44MzMgMCAwMC0uMzQxLS4zMTIgMS4wODIgMS4wODIgMCAwMC0uNDk1LS4xMSAxIDEgMCAwMC0uNS4xMjEuODI2LjgyNiAwIDAwLS4zMzMuMzM4Yy0uMDc3LjE0Ny0uMTE2LjMyMS0uMTE2LjUyNEgxNWMwLS4zNzYuMDg0LS43MDMuMjUxLS45OC4xNjgtLjI3OC4zOTktLjQ5Mi42OTMtLjY0NUEyLjE5IDIuMTkgMCAwMTE2Ljk2IDExYy4zODggMCAuNzMuMDc0IDEuMDIzLjIyMy4yOTQuMTQ4LjUyMi4zNTEuNjg0LjYxLjE2My4yNTguMjQ1LjU1Mi4yNDUuODg0IDAgLjIyMS0uMDQxLjQ0LS4xMjQuNjUzLS4wODMuMjE0LS4yMjkuNDUtLjQzOC43MS0uMjA3LjI2MS0uNDk4LjU3Ni0uODczLjk0NmwtLjk5NyAxLjAzOHYuMDRIMTlWMTdoLTMuOTY2eiIgZmlsbD0iI2ZmZiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9InByZWZpeF9fY2xpcDBfNzgxNF8xNjAxNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMGgyNHYyNEgweiIvPjwvY2xpcFBhdGg+PGNsaXBQYXRoIGlkPSJwcmVmaXhfX2NsaXAxXzc4MTRfMTYwMTQiPjxwYXRoIGZpbGw9IiNmZmYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuNzYgNy4yKSIgZD0iTTAgMGgxMC42Njd2MTAuNjY3SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+',
        onClick,
        className,
    });
export const IconKycTier3 = ({ onClick, className }: { onClick?: H; className?: string }) =>
    Icon({
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI3ByZWZpeF9fY2xpcDBfNzAyOV8zMTgpIj48cGF0aCBkPSJNMjMuMjg0IDEwLjY1MmwtMi4zOS0xLjU4MmExLjI1MyAxLjI1MyAwIDAxLS41MzQtMS4yOWwuNTY3LTIuODEyYTEuNjMxIDEuNjMxIDAgMDAtLjQzNi0xLjQ1OCAxLjU5MSAxLjU5MSAwIDAwLTEuNDU5LS40MzdsLTIuODEzLjU2N2ExLjI0NiAxLjI0NiAwIDAxLTEuMjg5LS41MzRMMTMuMzQxLjcxNkMxMy4wNDEuMjY3IDEyLjU0MSAwIDEyIDBjLS41NCAwLTEuMDQyLjI2Ny0xLjM0MS43MTZMOS4wNyAzLjEwNmMtLjI4LjQyMy0uNzg4LjYzMS0xLjI5LjUzNGwtMi44MTItLjU2N2ExLjYzMSAxLjYzMSAwIDAwLTEuNDU4LjQzNyAxLjU5MSAxLjU5MSAwIDAwLS40MzcgMS40NThsLjU2NyAyLjgxM2ExLjI1OCAxLjI1OCAwIDAxLS41MzQgMS4yODlsLTIuMzkgMS41ODljLS40NDkuMy0uNzE2LjgtLjcxNiAxLjM0MSAwIC41NC4yNjcgMS4wNDIuNzE2IDEuMzQxbDIuMzkgMS41ODljLjQyMy4yOC42MzEuNzg4LjUzNCAxLjI5bC0uNTY3IDIuODEyYTEuNjMxIDEuNjMxIDAgMDAuNDM3IDEuNDU5IDEuNTkgMS41OSAwIDAwMS40NTguNDM2bDIuODEzLS41NjdhMS4yNDYgMS4yNDYgMCAwMTEuMjg5LjUzNGwxLjU4OSAyLjM5Yy4zLjQ0OS44LjcxNiAxLjM0MS43MTYuNTQgMCAxLjA0Mi0uMjY3IDEuMzQxLS43MTZsMS41ODktMi4zOWMuMjgtLjQyMy43ODgtLjYzMSAxLjI5LS41MzRsMi44MTIuNTY3YTEuNjMxIDEuNjMxIDAgMDAxLjQ1OS0uNDM2Yy4zODQtLjM4NS41NDYtLjkyNS40MzYtMS40NTlsLS41NjctMi44MTNhMS4yNTcgMS4yNTcgMCAwMS41MzQtMS4yODlsMi4zOS0xLjU4OWExLjYxOSAxLjYxOSAwIDAwMC0yLjY5em0tNi4zNDItLjU2bC01LjM3OCA1LjQ3YS43NjguNzY4IDAgMDEtLjU2LjIzNC43Ny43NyAwIDAxLS41MTUtLjE5NWwtMy41MTYtMy4xMDZhLjc4Mi43ODIgMCAwMS0uMDcxLTEuMS43ODIuNzgyIDAgMDExLjEtLjA3MmwyLjk2MyAyLjYxNyA0Ljg1Ny00Ljk0MmEuNzgyLjc4MiAwIDAxMS4xMDctLjAwNi43NzQuNzc0IDAgMDEuMDEzIDEuMXoiIGZpbGw9IiM3MTQ5RkYiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI2LjY2NyIgZmlsbD0iIzcxNDlGRiIvPjxnIGNsaXAtcGF0aD0idXJsKCNwcmVmaXhfX2NsaXAxXzcwMjlfMzE4KSI+PHBhdGggZD0iTTE2LjI5NyA4LjMxNXYuMjM4Yy0uMjkyIDAtLjgwMi4wNy0uOTQ0LjIxMy0uMTQyLjE0Mi0uMzEuNDYtLjUwMi45NTJsLTIuNzggNy4wMjktMS43ODMuMDA1LTMuMDctNi44ODRjLS4yNDMtLjU0Mi0uNDUxLS44OTctLjYyNy0xLjA2NS0uMTc2LS4xNjctLjQxLS4yNS0uNzAyLS4yNXYtLjIzOGg0LjgwMnYuMjM4Yy0uMzY4IDAtLjk0NC4wMjctMS4wNzMuMDgxLS4xMy4wNTUtLjE5NC4xODItLjE5NC4zODMgMCAuMTE3LjA2OC4zMy4yMDYuNjM5LjEzOC4zMDkuMjQuNTQzLjMwNy43MDFsMS44OSA0LjIxOSAxLjg0MS00LjU4NGMuMDUtLjE1OC4xMDYtLjMyLjE2NS0uNDg4LjA1LS4xODMuMDc2LS4zMDguMDc2LS4zNzUgMC0uMjM0LS4wODEtLjM4OC0uMjQ0LS40NjMtLjE2My0uMDc1LS44NjUtLjExMy0xLjE1LS4xMTN2LS4yMzhoMy43ODJ6IiBmaWxsPSIjZmZmIi8+PC9nPjxwYXRoIGQ9Ik0xNi40OTMgMTdjLS4zODIgMC0uNzIyLS4wNy0xLjAxOS0uMjExYTEuNzI4IDEuNzI4IDAgMDEtLjctLjU4OCAxLjU5NyAxLjU5NyAwIDAxLS4yNzQtLjg3aC45OThhLjc0Mi43NDIgMCAwMC4xNDYuNDE0Ljg4Ljg4IDAgMDAuMzUzLjI3MWMuMTQ3LjA2NS4zMTEuMDk3LjQ5NC4wOTcuMTk0IDAgLjM2Ny0uMDM2LjUxNy0uMTA4YS44NjcuODY3IDAgMDAuMzUzLS4zMDguOC44IDAgMDAuMTI1LS40NTQuODMuODMgMCAwMC0uMTI3LS40NjcuODY1Ljg2NSAwIDAwLS4zNzctLjMxNyAxLjM4NSAxLjM4NSAwIDAwLS41OS0uMTE0aC0uNDh2LS44MTZoLjQ4Yy4xOSAwIC4zNTUtLjAzNS40OTctLjEwNWEuODE4LjgxOCAwIDAwLjMzNy0uMjk3LjgwNy44MDcgMCAwMC4xMi0uNDQ3LjgyNS44MjUgMCAwMC0uMTA0LS40MzEuNzIyLjcyMiAwIDAwLS4yOTUtLjI4OC45MTMuOTEzIDAgMDAtLjQ0My0uMTAzIDEuMSAxLjEgMCAwMC0uNDYyLjA5Ny44NS44NSAwIDAwLS4zNDIuMjc3LjczNS43MzUgMCAwMC0uMTM4LjQyMmgtLjk0OGMuMDA3LS4zMjcuMDk1LS42MTQuMjYzLS44NjEuMTctLjI1LjM5Ni0uNDQzLjY4LS41ODIuMjgyLS4xNC42LS4yMTEuOTUyLS4yMTEuMzYzIDAgLjY3OC4wNzMuOTQ1LjIyYTEuNTUyIDEuNTUyIDAgMDEuODQ0IDEuMzk3Yy4wMDIuMzI5LS4wODguNjA0LS4yNy44MjctLjE4MS4yMjItLjQxOC4zNjgtLjcxMi40MzZ2LjA0NmMuMzgyLjA1Ny42NzUuMjA5Ljg3OS40NTYuMjA1LjI0NS4zMDcuNTUuMzA1LjkxNSAwIC4zMjctLjA4Ny42Mi0uMjYuODc5YTEuNzUyIDEuNzUyIDAgMDEtLjcxMS42MDRjLS4zMDEuMTQ3LS42NDYuMjItMS4wMzYuMjJ6IiBmaWxsPSIjZmZmIi8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0icHJlZml4X19jbGlwMF83MDI5XzMxOCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMGgyNHYyNEgweiIvPjwvY2xpcFBhdGg+PGNsaXBQYXRoIGlkPSJwcmVmaXhfX2NsaXAxXzcwMjlfMzE4Ij48cGF0aCBmaWxsPSIjZmZmIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1Ljc2IDcuMikiIGQ9Ik0wIDBoMTAuNjY3djEwLjY2N0gweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==',
        onClick,
        className,
    });

export const IconKyc = ({
    level,
    onClick,
    className,
}: {
    level: string;
    onClick?: H;
    className?: string;
}) => {
    switch (level) {
        case 'na':
            return <IconKycNa onClick={onClick} className={className} />;
        case 'tier1':
            return <IconKycTier1 onClick={onClick} className={className} />;
        case 'tier2':
            return <IconKycTier2 onClick={onClick} className={className} />;
        case 'tier3':
            return <IconKycTier3 onClick={onClick} className={className} />;
    }
    return <IconKycNa onClick={onClick} className={className} />;
};

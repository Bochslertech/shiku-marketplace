import { cn } from '@/02_common/cn';

export default function BalanceInsufficient({
    balance,
    need,
    setAddFundsOpen,
    className,
}: {
    balance: string;
    need: string;
    setAddFundsOpen: (open: boolean) => void;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'hidden px-[70px] pb-[20px]',
                className,
                BigInt(need) > BigInt(balance) && 'flex justify-center gap-x-[10px]',
            )}
        >
            <img src="/img/profile/warning.svg" alt="" />
            <div className="line-clamp-2 font-inter-medium text-sm text-[#666666]">
                <span className="whitespace-nowrap">Insufficient balance,please&nbsp;</span>
                <span
                    onClick={() => {
                        setAddFundsOpen(true);
                    }}
                    className="cursor-pointer whitespace-nowrap text-yumi"
                >
                    add funds
                </span>
                &nbsp;before purchasing
            </div>
        </div>
    );
}

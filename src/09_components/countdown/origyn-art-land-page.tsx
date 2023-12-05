import { cn } from '@/02_common/cn';

function OrigynArtCountdownRenderer(
    { days, hours, minutes, seconds, completed },
    textColor = 'text-white',
) {
    const time = { days, hours, mins: minutes, secs: seconds };
    // Render a countdown
    return (
        <div className="flex justify-between gap-x-[10px] md:gap-x-[30px] xl:gap-x-[76px]">
            {Object.keys(time).map((key) => (
                <div key={key} className="flex flex-col">
                    <div
                        className={cn(
                            `flex   flex-col  items-center justify-center rounded-lg text-[80px] font-semibold leading-[80px] tracking-[10px] md:text-[100px] md:leading-[100px]`,
                            key === 'secs' && 'hidden md:flex',
                            textColor,
                        )}
                    >
                        <div className="flex">
                            <div className="w-[50px] text-center md:w-[65px]">
                                {completed ? '0' : time[key].toString().padStart(2, '0')[0]}
                            </div>
                            <div className="w-[50px] text-center md:w-[65px] ">
                                {completed ? '0' : time[key].toString().padStart(2, '0')[1]}
                            </div>
                        </div>
                    </div>
                    <div
                        className={cn(
                            `mt-[5px] text-center text-[14px]`,
                            key === 'secs' && 'hidden md:block',
                            textColor,
                        )}
                    >
                        {key.replace(/^\w/, (c) => c.toUpperCase())}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default OrigynArtCountdownRenderer;

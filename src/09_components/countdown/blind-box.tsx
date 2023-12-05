export default function BlindBoxCountdownRenderer({ days, hours, minutes, seconds, completed }) {
    const time = { days, hours, mins: minutes, secs: seconds };
    if (completed) {
        // Render a completed state
        return <div></div>;
    } else {
        // Render a countdown
        return (
            <div className="flex ">
                {Object.keys(time).map((key) => (
                    <div key={key} className="flex flex-col">
                        <div
                            className={`flex items-center justify-center rounded-lg bg-transparent text-[14px] font-semibold text-black`}
                        >
                            <div className="flex">
                                <div className="w-[9px] text-center">
                                    {time[key].toString().padStart(2, '0')[0]}
                                </div>
                                <div className="w-[9px] text-center">
                                    {time[key].toString().padStart(2, '0')[1]}
                                </div>
                            </div>
                            {key !== 'secs' && ':'}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export const queryIcpPriceInUsd = async (backend_host: string): Promise<string> => {
    const r = await fetch(`${backend_host}/page/buy/trade/quote`, {
        method: 'POST',
        headers: {
            'Content-Type': ' application/json',
        },
        body: JSON.stringify({
            crypto: 'ICP',
            fiat: 'USD',
            side: 'buy',
            amount: 600,
            alpha2: 'US',
            network: 'ICP',
            networkName: 'Internet Computer',
            payWayCode: null,
            rawFiat: '',
        }),
    });
    const json = await r.json();
    if (json.success) return json.data.cryptoPrice;
    console.error('can not get alchemy icp usd price', json);
    throw new Error(`can not get alchemy icp usd price: ${json}`);
};

export const estimateIcpAmount = async (
    backend_host: string,
    usd_amount: number,
): Promise<number> => {
    const r = await fetch(`${backend_host}/page/buy/trade/quote`, {
        method: 'POST',
        headers: {
            'Content-Type': ' application/json',
        },
        body: JSON.stringify({
            crypto: 'ICP',
            fiat: 'USD',
            side: 'buy',
            amount: usd_amount,
            alpha2: 'US',
            network: 'ICP',
            networkName: 'Internet Computer',
            payWayCode: null,
            rawFiat: '',
        }),
    });
    const json = await r.json();
    if (json.success) return json.data.cryptoAmount;
    console.error('can not get alchemy icp ramp fee: ', json);
    throw new Error(`can not get alchemy icp ramp fee: ${json}`);
};

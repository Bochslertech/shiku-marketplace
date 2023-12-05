// 线性插值法
export default function interpolate(x, xArr, yArr) {
    if (x < xArr[0]) {
        const dx = xArr[1] - xArr[0];
        const dy = yArr[1] - yArr[0];
        const t = (x - xArr[0]) / dx;
        return yArr[0] + t * dy;
    }
    if (x > xArr[xArr.length - 1]) {
        const dx = xArr[xArr.length - 1] - xArr[xArr.length - 2];
        const dy = yArr[yArr.length - 1] - yArr[yArr.length - 2];
        const t = (x - xArr[xArr.length - 1]) / dx;
        return yArr[yArr.length - 1] + t * dy;
    }

    let i = 0;
    let j = xArr.length - 1;

    while (j - i > 1) {
        const k = Math.floor((i + j) / 2);
        if (xArr[k] > x) {
            j = k;
        } else {
            i = k;
        }
    }

    const t = (x - xArr[i]) / (xArr[j] - xArr[i]);
    const y = yArr[i] + t * (yArr[j] - yArr[i]);

    return y;
}

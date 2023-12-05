// 接口调用计时
export class Spend {
    private begin: number;
    private marks: number[];
    private tips: string;
    private silence: boolean;
    constructor(tips: string, silence = false) {
        this.begin = Date.now();
        this.marks = [];
        this.tips = tips;
        this.silence = silence;
    }
    public mark(mark?: string) {
        if (this.silence) return;
        const now = Date.now();
        this.marks.push(now);
        const last = this.marks.length <= 1 ? undefined : this.marks[this.marks.length - 2];
        if (last === undefined) {
            console.debug(`${this.tips}`, `${now - this.begin}ms`, mark ?? '');
        } else {
            console.debug(`${this.tips}`, `${now - this.begin}ms`, `${now - last}ms`, mark ?? '');
        }
    }
    public static start(tips: string, silence = false) {
        return new Spend(tips, silence);
    }
}

// 计时功能
export const timeSpend = async <T>(execute: () => Promise<T>, tips: string): Promise<T> => {
    const spend = Spend.start(tips);
    const r = await execute();
    spend.mark('done');
    return r;
};

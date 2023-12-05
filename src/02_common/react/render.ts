// ! 谨慎使用
// 只运行一次, 目前应该只有在最外层 app 和渐进式加载数据中使用
export class FirstRender {
    mark = false;
    once(callback: () => void): () => void {
        return () => {
            if (this.mark) {
                this.mark = false;
                return;
            }
            this.mark = true;
            callback();
        };
    }
}

// ! 谨慎使用
// 同参数只运行一次
export class FirstRenderByData {
    private comparer: (t1: any[], t2: any[]) => boolean = (t1: any[], t2: any[]) => {
        if (t1 === t2) return true;
        if (t1.length !== t2.length) return false;
        for (let i = 0; i < t1.length; i++) {
            if (JSON.stringify(t1[i]) !== JSON.stringify(t2[i])) return false;
        }
        return true;
    };
    private data: any[] | undefined;

    constructor(comparer?: (t1: any[], t2: any[]) => boolean, data?: any[], error?: string) {
        if (comparer !== undefined) this.comparer = comparer;
        this.data = data;
        if (error) console.error('new FirstRenderByData()', error);
    }

    once(data: any[] | undefined, callback: () => void, empty?: () => void) {
        if (data === undefined) {
            this.data = undefined;
            empty && empty();
            return;
        }
        if (this.data !== undefined && this.comparer(this.data, data)) {
            // 一样的就不重复执行了
            return;
        }
        this.data = [...data];
        callback();
    }

    // clean() {
    //     this.data = undefined;
    // }
}

// ! 谨慎使用
// 条件判断是否执行
export class FirstRenderWithData<T> {
    data: T;
    constructor(data: T) {
        this.data = data;
    }
    set(data: T) {
        this.data = data;
    }
    execute(condition: (d: T) => boolean, callback: () => void) {
        const execute = condition(this.data);
        if (execute) callback();
    }
}

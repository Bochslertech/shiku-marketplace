// 分批执行代码, 可以限制并发
export const executes = async <T>(
    tasks: {
        task: Promise<T>;
        success: (t: T) => void;
        error: (e: any) => void;
    }[],
    limit: number,
): Promise<void> => {
    if (limit <= 0) limit = 1;
    const length = tasks.length;
    let i = 0;
    let done = 0;
    return new Promise<void>((resolve) => {
        const execute = async (index: number) => {
            const { task, success, error } = tasks[index];
            try {
                success(await task);
            } catch (e: any) {
                error(e);
            }
            done++;
            if (length === done) resolve();
            if (i < length) {
                execute(i);
                i++;
            }
        };
        for (; i < limit; i++) execute(i);
    });
};

// 分批执行代码, 可以限制并发
export const collects = async <T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> => {
    if (limit <= 0) limit = 1;
    const length = tasks.length;
    const results: T[] = [];
    let i = 0;
    let done = 0;
    return new Promise<T[]>((resolve) => {
        const execute = async (index: number) => {
            const task = tasks[index];
            results[index] = await task();
            done++;
            if (length === done) resolve(results);
            if (i < length) {
                execute(i);
                i++;
            }
        };
        for (; i < limit; i++) execute(i);
    });
};

// 分批执行代码, 并合并结果
export const execute_and_join = async <A, T>(
    args: A[],
    call: (args: A[]) => Promise<T[]>,
    scale: number,
): Promise<T[]> => {
    args = [...args];
    const bound = Math.floor(args.length / scale);
    const splitArgs: A[][] = [];
    while (args.length) {
        if (bound < args.length) {
            splitArgs.push(args.splice(0, bound));
        } else {
            splitArgs.push(args);
            break;
        }
    }
    const splitResults = await collects(
        splitArgs.map((a) => () => call(a)),
        scale,
    );
    const results: T[] = [];
    for (let i = 0; i < splitResults.length; i++) results.push(...splitResults[i]);
    return results;
};

// 重复尝试
export const refetch = async <T>(
    fetch: () => Promise<T>,
    retry: number = 0, // 1 表示重试 1 次, 也就最大次数 2 次
): Promise<T | undefined> => {
    try {
        const r = await fetch();
        return r;
    } catch (e) {
        console.debug(`🚀 ~ file: tasks.ts:90 ~ e:`, e);
        if (retry > 0) return await refetch(fetch, retry - 1);
        else return undefined;
    }
};

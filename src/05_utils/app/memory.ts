// 异步内存存储对象
export class AsyncMemoryCache<T> {
    private key_value: Record<string, T> = {};

    // 查询值
    async getItem(name: string): Promise<T | null> {
        return this.key_value[name] ?? null;
    }

    // 设置值
    async setItem(name: string, value: T): Promise<void> {
        this.key_value[name] = value;
    }

    // 移除值
    async removeItem(name: string): Promise<void> {
        delete this.key_value[name];
    }
}

// 同步缓存内容
export class MemoryCache<T> {
    private key_value: Record<string, T> = {};

    // 查询值
    getItem(name: string): T | null {
        return this.key_value[name] ?? null;
    }

    // 设置值
    setItem(name: string, value: T): void {
        this.key_value[name] = value;
    }

    // 移除值
    removeItem(name: string): void {
        delete this.key_value[name];
    }

    // 获取所有值
    getAllItems(): { key: string; value: T }[] {
        return Object.keys(this.key_value).map((key) => ({ key, value: this.key_value[key] }));
    }
    // 清空数据
    clean(): string[] {
        const keys = Object.keys(this.key_value);
        this.key_value = {};
        return keys;
    }
}

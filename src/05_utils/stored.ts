import { INDEXED_DB_YUMI } from './app/indexed';
import { AsyncMemoryCache, MemoryCache } from './app/memory';
import { readStorage, writeStorage } from './app/storage';

const store = INDEXED_DB_YUMI ?? new AsyncMemoryCache<string>();

const random_time = (max: number) => Math.floor(Math.random() * max);

// 带缓存时间的 key
type CombinedKey = {
    key: string;
    expired: number; // 缓存时间,读取时候,太古老的数据就不要了
};
// 带缓存时间的值
type CombinedValue<T> = {
    expired: number; // 缓存时间,读取时候,太古老的数据就不要了
    value?: T;
};

// 数据库持久化的内容
class IndexedStored<T> {
    private indexed_key: (name: string) => string;
    constructor(indexed_key: (name: string) => string) {
        this.indexed_key = indexed_key;
    }
    async getItem(name: string): Promise<T | undefined> {
        name = this.indexed_key(name);
        return new Promise((resolve) => {
            // setTimeout(() => resolve(undefined), 1000); // 防止一直等待
            store.getItem(name).then(
                (value) => {
                    if (value === null) {
                        resolve(undefined);
                        return;
                    }
                    const stored: T = JSON.parse(value);
                    resolve(stored);
                },
                (error) => {
                    console.error(`get data failed`, name, error);
                    resolve(undefined);
                },
            );
        });
    }
    async setItem(name: string, value: T): Promise<void> {
        name = this.indexed_key(name);
        return store.setItem(name, JSON.stringify(value));
    }
    async removeItem(name: string): Promise<void> {
        name = this.indexed_key(name);
        return store.removeItem(name);
    }
}

// 联合内存和数据库的缓存
export class CombinedStore<T> {
    private max_alive: number;
    private random: boolean;
    private memory: MemoryCache<CombinedValue<T>>;

    private stored?: {
        key_name: string;
        indexed: IndexedStored<T>;
        indexed_delay: Record<string, T>;
        timeout_id: Record<string, number>;
    };

    constructor(
        max_alive: number,
        random: boolean,
        stored?: {
            key_name: string;
            indexed_key: (name: string) => string; // 表示不使用持久化
        },
    ) {
        this.max_alive = max_alive;
        this.random = random;
        this.memory = new MemoryCache<CombinedValue<T>>();
        if (stored !== undefined) {
            // 读取 local storage 里面的 key 信息
            const keys: CombinedKey[] = JSON.parse(readStorage(stored.key_name) ?? '[]');
            for (const key of keys) this.memory.setItem(key.key, { expired: key.expired });
            this.stored = {
                key_name: stored.key_name,
                indexed: new IndexedStored<T>(stored.indexed_key),
                indexed_delay: {},
                timeout_id: {},
            };
        }
    }
    saveKeys() {
        if (this.stored !== undefined) {
            writeStorage(
                this.stored.key_name,
                JSON.stringify(
                    this.memory
                        .getAllItems()
                        .map((item) => ({ key: item.key, expired: item.value.expired })),
                ),
            );
        }
    }
    async getItem(name: string): Promise<T | undefined> {
        return new Promise((resolve) => {
            const m = this.memory.getItem(name);
            if (m === null) resolve(undefined);
            else {
                const now = Date.now();
                if (m.expired <= now) resolve(undefined);
                else if (m.value !== undefined) resolve(m.value);
                else {
                    if (this.stored) {
                        // 持久化任务
                        this.stored.indexed
                            .getItem(name)
                            .then((v) => {
                                if (v === null) resolve(undefined);
                                else {
                                    m.value = v;
                                    resolve(v);
                                }
                            })
                            .catch((error) => {
                                console.error(`get data failed`, name, error);
                                resolve(undefined);
                            });
                    } else {
                        resolve(undefined);
                    }
                }
            }
        });
    }
    async setItem(name: string, value: T, expired?: number): Promise<void> {
        expired =
            expired ?? Date.now() + (this.random ? random_time(this.max_alive) : this.max_alive); // ? 随机时间,以防止同一时间大量缓存失效
        return new Promise((resolve) => {
            this.memory.setItem(name, { expired: expired!, value });
            if (this.stored) {
                // 持久化任务
                const { indexed, indexed_delay, timeout_id } = this.stored;
                this.stored.indexed_delay[name] = value;
                clearTimeout(timeout_id[name]);
                this.stored.timeout_id[name] = Number(
                    setTimeout(
                        () => {
                            const value = indexed_delay[name];
                            if (value !== undefined) {
                                delete indexed_delay[name];
                                indexed.setItem(name, value);
                                this.saveKeys();
                            }
                        },
                        Math.ceil(Math.random() * 10000), // 10s内进行持久化
                    ),
                );
            }
            resolve();
        });
    }
    async removeItem(name: string): Promise<void> {
        return new Promise((resolve) => {
            this.memory.removeItem(name);
            if (this.stored) {
                // 持久化任务
                const { indexed, timeout_id } = this.stored;
                this.saveKeys();
                clearTimeout(timeout_id['']);
                timeout_id[''] = Number(
                    setTimeout(
                        () => indexed.removeItem(name),
                        Math.ceil(Math.random() * 10000), // 10s内进行删除
                    ),
                );
            }
            resolve();
        });
    }

    async clean(): Promise<void> {
        const keys = this.memory.clean();
        if (this.stored) {
            // 持久化任务
            const { indexed } = this.stored;
            this.saveKeys();
            await Promise.all(keys.map((key) => indexed.removeItem(key)));
        }
    }
}

// 纯内存缓存
export class MemoryStore<T> {
    private max_alive: number;
    private random: boolean;
    private memory: MemoryCache<CombinedValue<T>>;

    constructor(max_alive: number, random: boolean) {
        this.max_alive = max_alive;
        this.random = random;
        this.memory = new MemoryCache<CombinedValue<T>>();
    }
    getItem(name: string): T | undefined {
        const m = this.memory.getItem(name);
        if (m === null) return undefined;
        const now = Date.now();
        if (m.expired <= now) return undefined;
        return m.value;
    }
    setItem(name: string, value: T) {
        const expired = Date.now() + (this.random ? random_time(this.max_alive) : this.max_alive); // ? 随机时间,以防止同一时间大量缓存失效
        this.memory.setItem(name, { expired, value });
    }
    removeItem(name: string) {
        this.memory.removeItem(name);
    }
    clean() {
        this.memory.clean();
    }
}

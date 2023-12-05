export const canister_query = async <T>(url: string): Promise<T | undefined> =>
    new Promise((resolve) => {
        fetch(url)
            .then((r) => r.json())
            .then(
                (
                    json:
                        | {
                              spend: string[]; // 耗时 毫秒
                              created: number; // 时间戳 毫秒
                              code: 0; // 状态码 0 表示正确
                              message: 'success'; // 附带的信息
                              data?: T; // 数据
                          }
                        | {
                              spend?: undefined; // 耗时 毫秒
                              created: number; // 时间戳 毫秒
                              code: number; // 状态码 0 表示正确
                              message: string; // 附带的信息
                              data?: undefined; // 数据
                          },
                ) => {
                    // console.debug(`🚀 ~ file: query.ts:23 ~ canister_query ~ json:`, json);
                    resolve(json.data);
                },
            )
            .catch((e) => {
                console.error(`🚀 ~ file: query.ts:7 ~ canister_query ~ e:`, e);
                resolve(undefined);
            });
    });

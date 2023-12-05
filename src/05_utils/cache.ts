import { useQuery } from '@tanstack/react-query';

// 缓存中获取数据, 获取到数据后会触发再次渲染
export const useCache = <T>({
    keys,
    fetch,
    alive,
    enable,
}: {
    keys: string[];
    fetch: () => Promise<T>;
    alive?: number;
    enable?: boolean;
}): T | undefined => {
    const { data } = useQuery({
        queryKey: keys,
        queryFn: fetch,
        staleTime: alive,
        enabled: enable,
    });
    return data;
};

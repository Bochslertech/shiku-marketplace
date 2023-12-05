// 检索信息, 如果是存空白, 就不用 trim
export const parseLowerCaseSearch = (search: string): string => {
    if (!search) return search;
    const s = search.trim().toLowerCase();
    if (!s) return search;
    return s;
};

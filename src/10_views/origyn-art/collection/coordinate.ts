export type OrigynArtNftCoordinate = {
    x_coordinate_start: number;
    x_coordinate_end: number;
    y_coordinate_start: number;
    y_coordinate_end: number;
};

export const unwrapCoordinateData_2f2a0ab9 = (
    metadata: any,
): OrigynArtNftCoordinate | undefined => {
    const __apps = metadata?.Class?.find((item: any) => item.name === '__apps');
    if (__apps === undefined) return undefined;
    const data = __apps?.value?.Array?.thawed[0]?.Class?.find((item: any) => item.name === 'data');
    if (data === undefined) return undefined;
    const custom_properties = data?.value?.Class?.find(
        (item: any) => item.name === 'custom_properties',
    );
    if (custom_properties === undefined) return undefined;
    const coordinate = custom_properties?.value?.Array?.thawed[0]?.Class[0]?.value?.Class;
    if (coordinate === undefined) return undefined;
    const x_coordinate_start = coordinate?.find((item: any) => item.name === 'x_coordinate_start')
        ?.value?.Float;
    const x_coordinate_end = coordinate?.find((item: any) => item.name === 'x_coordinate_end')
        ?.value?.Float;
    const y_coordinate_start = coordinate?.find((item: any) => item.name === 'y_coordinate_start')
        ?.value?.Float;
    const y_coordinate_end = coordinate?.find((item: any) => item.name === 'y_coordinate_end')
        ?.value?.Float;
    if (
        x_coordinate_start !== undefined &&
        x_coordinate_end !== undefined &&
        y_coordinate_start !== undefined &&
        y_coordinate_end !== undefined
    ) {
        return {
            x_coordinate_start,
            x_coordinate_end,
            y_coordinate_start,
            y_coordinate_end,
        };
    }
    return undefined;
};

const unwrapCoordinateData_9293bd34 = (metadata: any): OrigynArtNftCoordinate | undefined => {
    const __apps = metadata?.Class?.find((item: any) => item.name === '__apps');
    if (__apps === undefined) return undefined;
    const data = __apps?.value?.Array[0]?.Class?.find((item: any) => item.name === 'data');
    if (data === undefined) return undefined;
    const custom_properties = data?.value?.Class?.find(
        (item: any) => item.name === 'custom_properties',
    );
    if (custom_properties === undefined) return undefined;
    const coordinate = custom_properties?.value?.Array?.thawed[0]?.Class[0]?.value?.Class;
    if (coordinate === undefined) return undefined;
    const x_coordinate_start = coordinate?.find((item: any) => item.name === 'x_coordinate_start')
        ?.value?.Float;
    const x_coordinate_end = coordinate?.find((item: any) => item.name === 'x_coordinate_end')
        ?.value?.Float;
    const y_coordinate_start = coordinate?.find((item: any) => item.name === 'y_coordinate_start')
        ?.value?.Float;
    const y_coordinate_end = coordinate?.find((item: any) => item.name === 'y_coordinate_end')
        ?.value?.Float;
    if (
        x_coordinate_start !== undefined &&
        x_coordinate_end !== undefined &&
        y_coordinate_start !== undefined &&
        y_coordinate_end !== undefined
    ) {
        return {
            x_coordinate_start,
            x_coordinate_end,
            y_coordinate_start,
            y_coordinate_end,
        };
    }
    return undefined;
};

const MAPPING_OGY_MODULE = {
    ['2f2a0ab9f5d2f78e6aee2bb2c704be6b18e8cdfc1869bbb7ca56bd18598ccaa7']:
        unwrapCoordinateData_2f2a0ab9,
    ['9293bd3455eceb221f9968ff5ecb0dda8556b9209aa8a0c9963a5a63aa994f8c']:
        unwrapCoordinateData_9293bd34,
};

const MAPPING_OGY: Record<
    string,
    | '2f2a0ab9f5d2f78e6aee2bb2c704be6b18e8cdfc1869bbb7ca56bd18598ccaa7'
    | '9293bd3455eceb221f9968ff5ecb0dda8556b9209aa8a0c9963a5a63aa994f8c'
> = {
    // OGY
    // ! 正式环境 二级
    ['2oqzn-paaaa-aaaaj-azrla-cai']:
        '2f2a0ab9f5d2f78e6aee2bb2c704be6b18e8cdfc1869bbb7ca56bd18598ccaa7',
    // * 预发布环境 二级
    ['3e73x-nqaaa-aaaaj-azrma-cai']:
        '9293bd3455eceb221f9968ff5ecb0dda8556b9209aa8a0c9963a5a63aa994f8c',
    // ? 测试环境 二级
    ['lcaww-uyaaa-aaaag-aaylq-cai']:
        '9293bd3455eceb221f9968ff5ecb0dda8556b9209aa8a0c9963a5a63aa994f8c',
};

const getModule = (collection: string) => {
    const module_hex = MAPPING_OGY[collection];
    if (module_hex === undefined) throw new Error(`unknown ogy canister id: ${collection}`);
    const module = MAPPING_OGY_MODULE[module_hex];
    if (module === undefined) throw new Error(`unknown ogy canister id: ${collection}`);
    return module;
};

export const unwrapCoordinateData = (
    collection: string,
    metadata: any,
): OrigynArtNftCoordinate | undefined => {
    const module = getModule(collection);
    return module(metadata);
};

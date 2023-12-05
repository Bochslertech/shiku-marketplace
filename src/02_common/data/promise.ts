// 忽略异步调用产生的错误, 简单的错误已经提示了, 从异常走
// ! 注意, 无需给用户提示信息
export const alreadyMessaged = (d: undefined | false | any): any => {
    if (d === undefined || d === false) throw new Error(`${d}`);
    return d;
};

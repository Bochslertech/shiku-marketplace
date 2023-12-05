// 通过 Yumi 上架的 OGY,写上 Yumi 的地址, 收代理费
const { YUMI_OGY_BROKER } = import.meta.env;

export const getYumiOgyBroker = (): string => YUMI_OGY_BROKER;

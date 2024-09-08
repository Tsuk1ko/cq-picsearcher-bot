export const IS_DOCKER = !!process.env.CQPS_DOCKER;

export const isNapCat = () => global.botClientInfo.name.startsWith('NapCat');

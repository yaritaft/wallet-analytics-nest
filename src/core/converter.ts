export const fromWeiToETH = (weiBalance: number | string): number => {
  return Number(weiBalance) / 1000000000000000000;
};

export const fromTimestampToDate = (timestamp: number | string): Date => {
  return new Date(Number(timestamp) * 1000);
};

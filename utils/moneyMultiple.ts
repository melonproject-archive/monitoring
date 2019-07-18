import { CashFlow } from '@webcarrot/xirr';

export const moneyMultiple = (cashflows: CashFlow[]): string => {
  const sums = cashflows.reduce(
    (carry, item) => {
      return item.amount > 0 ? [carry[0] + item.amount, carry[1]] : [carry[0], carry[1] - item.amount];
    },
    [0, 0],
  );
  if (sums[1] !== 0) {
    return (sums[0] / sums[1]).toFixed(3);
  } else {
    return '';
  }
};

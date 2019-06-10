import { xirr, CashFlow } from '@webcarrot/xirr';

export const robustIRR = (cashflows: CashFlow[]): string => {
  const cfSum = cashflows.reduce((carry, item) => {
    return carry + item.amount;
  }, 0);
  let guess = Math.sign(cfSum) * 0.5;
  let irr: number;
  let success = false;
  // first try with guess value depending on cf sum
  try {
    irr = xirr(cashflows, guess);
    success = true;
  } catch (err) {
    for (guess = -0.9999; guess <= 1; guess += 0.1) {
      try {
        irr = xirr(cashflows, guess);
        success = true;
        break;
      } catch {
        continue;
      }
    }
  }
  return success ? (irr * 100).toFixed(1) : '';
};

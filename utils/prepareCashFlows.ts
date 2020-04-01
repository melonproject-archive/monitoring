import BigNumber from 'bignumber.js';
import { formatBigNumber } from './formatBigNumber';

export const prepareCashFlows = (history, currentValue: string) => {
  const investmentCashFlows = history.map((item) => {
    let pre = '';
    if (item.action === 'Investment') {
      pre = '-';
    }
    const amount = new BigNumber(pre + item.amountInDenominationAsset);
    return {
      amount: parseFloat(formatBigNumber(amount.toString())),
      date: new Date(item.timestamp * 1000),
    };
  });
  const cashflows = [
    ...investmentCashFlows,
    {
      amount: parseFloat(formatBigNumber(currentValue.toString(), 18, 18)),
      date: new Date(),
    },
  ];
  return cashflows;
};

import BigNumber from 'bignumber.js';
import * as R from 'ramda';

export const sortBigNumber = (a: any, b: any, sortFields: string | string[]): number => {
  if (typeof sortFields === 'string') {
    sortFields = [sortFields];
  }
  return new BigNumber(R.path(sortFields, a)).isGreaterThan(new BigNumber(R.path(sortFields, b)))
    ? 1
    : new BigNumber(R.path(sortFields, b)).isGreaterThan(new BigNumber(R.path(sortFields, a)))
    ? -1
    : 0;
};

import React, { useContext } from 'react';
import { useQuery, QueryResult } from 'react-query';
import { fetchRates, Rates as RatesType } from '~/utils/fetchRates';

export type RatesContextValue = QueryResult<RatesType>;

export const Rates = React.createContext<RatesContextValue>({} as any);

export const RatesProvider: React.FC = (props) => {
  const rates = useQuery('rates', fetchRates);
  return <Rates.Provider value={rates}>{props.children}</Rates.Provider>;
};

export const RequiresRates: React.FC = (props) => {
  const rates = useContext(Rates);

  if (rates.data == null && rates.status === 'loading') {
    return <>Loading</>;
  }

  if (rates.data == null && rates.error) {
    // Let the error boundary handle this.
    throw new Error('Failed to fetch rates.');
  }

  return rates.data == null ? null : <>{props.children}</>;
};

export function useRates() {
  const rates = useContext(Rates);
  return rates.data;
}

export function useRatesOrThrow() {
  const rates = useRates();
  if (rates == null) {
    throw new Error('Missing rates data.');
  }

  return rates;
}

export function useTokenRates(token: string) {
  const symbol = token === 'WETH' ? 'ETH' : token;
  const rates = useRatesOrThrow();

  if (!rates[symbol]) {
    throw new Error('Missing rates data.');
  }

  return rates[symbol];
}

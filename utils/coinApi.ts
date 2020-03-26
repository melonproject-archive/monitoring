import axios from 'axios';

export interface SingleCoinApiRate {
  time?: string;
  asset_id_base?: string;
  asset_id_quote?: string;
  rate: number;
}

export interface CoinApiRates {
  [key: string]: SingleCoinApiRate;
}

export const fetchCoinApiRates = async (base: string = 'ETH') => {
  const result = await axios('https://coinapi.melon.network?base=' + base);

  const r = { WETH: { rate: 1, time: new Date().toDateString(), asset_id_quote: 'WETH' } };
  result.data.rates.map((rate) => {
    r[rate.asset_id_quote] = rate;
  });

  return r as CoinApiRates;
};

export const fetchSingleCoinApiRate = async (base: string = 'ETH', quote: string = 'USD') => {
  const result = await axios(`https://coinapi.melon.network?base=${base}&quote=${quote}`);
  return result.data as SingleCoinApiRate;
};

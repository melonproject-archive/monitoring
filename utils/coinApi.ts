import axios from 'axios';

export const fetchCoinApiRates = async (base: string = 'ETH') => {
  const result = await axios('https://coinapi.now.sh/?base=' + base);

  const r = { WETH: { rate: 1 } };
  result.data.rates.map(rate => {
    r[rate.asset_id_quote] = rate;
  });
  return r;
};

export const fetchSingleCoinApiRate = async (base: string = 'ETH', quote: string = 'USD') => {
  const result = await axios(`https://coinapi.now.sh/?base=${base}&quote=${quote}`);
  return result.data;
};

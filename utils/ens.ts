import axios from 'axios';

export const fetchEnsAddresses = async (base: string = 'ETH') => {
  const result = await axios('https://ens.melon.network/');
  return result.data;
};

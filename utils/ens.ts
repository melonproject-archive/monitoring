import axios from 'axios';

export const fetchEnsAddresses = async (base: string = 'ETH') => {
  const result = await axios('https://ens-server-git-new-domains.melon-project.now.sh/');
  return result.data;
};

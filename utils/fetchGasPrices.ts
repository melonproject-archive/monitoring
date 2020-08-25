export interface GasPrices {
  fast: number;
  low: number;
  average: number;
}

export async function fetchEthGasStation() {
  try {
    const result = await fetch('https://ethgasstation.info/json/ethgasAPI.json');
    const json = await result.json();

    return {
      fast: json.fast / 10,
      low: json.safeLow / 10,
      average: json.average / 10,
    };
  } catch (error) {
    return undefined;
  }
}

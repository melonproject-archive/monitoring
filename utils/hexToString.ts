export const hexToString = (hex: string): string => {
  let str = '';
  for (let i = 54; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str.trim();
};

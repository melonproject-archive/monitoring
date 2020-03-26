export const formatThousands = (input) => {
  try {
    return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  } catch (e) {
    return input;
  }
};

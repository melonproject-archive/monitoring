import moment from 'moment';

export const formatDate = (date: number | string) => {
  const value = parseInt(`${date}`, 10);
  return moment.unix(value).format('MM/DD/YYYY');
};

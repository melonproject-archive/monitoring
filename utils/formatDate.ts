import moment from 'moment';

export const formatDate = (date: number | string, inclTime?: boolean) => {
  const value = parseInt(`${date}`, 10);
  const timestring = inclTime ? ' HH:mm' : '';
  return moment.unix(value).format('MM/DD/YYYY' + timestring);
};

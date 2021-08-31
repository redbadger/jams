import moment from 'moment';

export const convertDate = (date) => {
  return moment(date * 1000).format('DD MMM hh:mm A');
};

export const timeSince = (date) => {
  const openedAt = moment(new Date(date * 1000));
  const now = moment();

  const hours = now.diff(openedAt, 'hours');
  const minutes = now.diff(openedAt, 'minutes') - hours * 60;

  return hours > 48
    ? Math.floor(hours / 24) + ' days'
    : hours + ':' + minutes;
};

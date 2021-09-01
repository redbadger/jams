import moment from 'moment';

export const convertDate = (date) => {
  return moment(date * 1000).format('DD MMM hh:mm A');
};

export const timeSince = (date) => {
  const openedAt = moment(new Date(date * 1000));
  const now = moment();

  const hours = now.diff(openedAt, 'hours');
  const minutes = now.diff(openedAt, 'minutes') - hours * 60;

  if (hours > 48) {
    return Math.floor(hours / 24) + ' days';
  } else if (hours < 1 && minutes < 59) {
    return minutes + ' minutes';
  } else {
    return hours + ':' + moment(minutes).format('mm');
  }
};

import dayjs from 'dayjs';
import dayjsUTC from 'dayjs-plugin-utc';

dayjs.extend(dayjsUTC);

const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getNormalDate = (isoDate) => dayjs(isoDate).format('YYYY-MM-DD');

const getShortDate = (isoDate) => dayjs(isoDate).format('MMM DD');

const getNormalDateWithTime = (isoDate) => dayjs(isoDate).format('YYYY-MM-DDTHH:mm');

const getTimeOnly = (isoDate) => dayjs(isoDate).format('HH:mm');

const getDiffTime = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

const getNormileDiffTime = (minute) => {
  const minutesInHour = 60;
  const hours = Math.floor(minute / minutesInHour);
  const remainingMinutes = minute - hours * minutesInHour;
  return `${hours}H ${remainingMinutes}M`;
};

export {
  getRandomInt,
  getNormalDate,
  getShortDate,
  getNormalDateWithTime,
  getTimeOnly,
  getDiffTime,
  getNormileDiffTime
};

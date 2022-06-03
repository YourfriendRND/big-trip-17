import dayjs from 'dayjs';
import dayjsUTC from 'dayjs-plugin-utc';
import duration from 'dayjs/plugin/duration';

dayjs.extend(dayjsUTC);
dayjs.extend(duration);

const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getNormalDate = (isoDate) => dayjs(isoDate).format('YYYY-MM-DD');

const getShortDate = (isoDate) => dayjs(isoDate).format('MMM DD');

const getNormalDateWithTime = (isoDate) => dayjs(isoDate).format('YYYY-MM-DDTHH:mm');

const getDateTimeForEdit = (isoDate) => dayjs(isoDate).format('DD/MM/YY HH:mm');

const getTimeOnly = (isoDate) => dayjs(isoDate).format('HH:mm');

const getDiffTime = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

const isSameMonth = (dateFrom, dateTo) => dayjs(dateFrom).format('MMM') === dayjs(dateTo).format('MMM');

const getNormileDiffTime = (minute) => {
  const MINUTES_PER_HOUR = 60;
  const MINUTES_PER_DAY = 1440;
  const isDay = minute >= MINUTES_PER_DAY;
  const outputFormat = minute > MINUTES_PER_HOUR ? 'HH[H] mm[M]' : 'mm[M]';
  return dayjs.duration(minute, 'minutes').format(isDay ? 'DD[D] HH[H] mm[M]': outputFormat);
};

const getFullRoute = (events) => {
  const destinationPoints = new Set();
  events.forEach((event) => destinationPoints.add(event.destination));
  return destinationPoints.size > 3
    ? `${events[0].destination} &mdash; ... &mdash; ${events[events.length - 1].destination}`
    : Array.from(destinationPoints).join('&mdash;');
};

const getRoutePeriod = (events) => {
  if (events.length === 1) {
    return getShortDate(events[0].dateFrom);
  }
  const start = events[0].dateFrom;
  const finish = events[events.length - 1].dateFrom;
  return !isSameMonth(start, finish)
    ? `${getShortDate(start)}&nbsp;&mdash;&nbsp;${getShortDate(finish)}`
    : `${getShortDate(start)}&nbsp;&mdash;&nbsp;${dayjs(finish).format('DD')}`;
};

const areThereFutureEvents = (events = []) => events.some((event) => dayjs().isBefore(dayjs(event.dateFrom)));

const areTherePastEvents = (events = []) => events.some((event) => dayjs().isAfter(dayjs(event.dateFrom)));

const updateElement = (elements, updatedElement) => {
  const index = elements.findIndex((element) => element.id === updatedElement.id);
  return index === -1 ? elements : [...elements.slice(0, index), updatedElement, ...elements.slice(index + 1)];
};

const compareEventsByPrice = (prevEvent, nextEvent) => nextEvent.basePrice - prevEvent.basePrice;

const compareEventsByDuration = (prevEvent, nextEvent) => {
  const prevEventDuration = dayjs(prevEvent.dateTo) - dayjs(prevEvent.dateFrom);
  const nextEventDuration = dayjs(nextEvent.dateTo) - dayjs(nextEvent.dateFrom);
  return nextEventDuration - prevEventDuration;
};

export {
  getRandomInt,
  getNormalDate,
  getShortDate,
  getNormalDateWithTime,
  getTimeOnly,
  getDiffTime,
  getNormileDiffTime,
  getDateTimeForEdit,
  getFullRoute,
  getRoutePeriod,
  areThereFutureEvents,
  areTherePastEvents,
  updateElement,
  compareEventsByPrice,
  compareEventsByDuration
};

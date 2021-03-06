import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {MINUTES_PER_DAY, MINUTES_PER_HOUR, FilterType} from './project-constants';
dayjs.extend(duration);

const getNormalDate = (isoDate) => dayjs(isoDate).format('YYYY-MM-DD');

const getShortDate = (isoDate) => dayjs(isoDate).format('MMM DD');

const getNormalDateWithTime = (isoDate) => dayjs(isoDate).format('YYYY-MM-DDTHH:mm');

const getDateTimeForEdit = (isoDate) => dayjs(isoDate).format('DD/MM/YY HH:mm');

const getTimeOnly = (isoDate) => dayjs(isoDate).format('HH:mm');

const getDiffTime = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

const isSameMonth = (dateFrom, dateTo) => dayjs(dateFrom).format('MMM') === dayjs(dateTo).format('MMM');

const areThereFutureEvents = (events = []) => events.some((event) => dayjs().isBefore(dayjs(event.dateFrom)));

const areTherePastEvents = (events = []) => events.some((event) => dayjs().isAfter(dayjs(event.dateFrom)));

const isEventBeforeNextEvent = (event, nextEvent) => dayjs(event.dateFrom).isBefore(dayjs(nextEvent.dateFrom));

const getNormileDiffTime = (minute) => {
  const isDay = minute >= MINUTES_PER_DAY;
  const outputFormat = minute > MINUTES_PER_HOUR ? 'HH[H] mm[M]' : 'mm[M]';
  return dayjs.duration(minute, 'minutes').format(isDay ? 'DD[D] HH[H] mm[M]': outputFormat);
};
const compareEventsByPrice = (prevEvent, nextEvent) => nextEvent.basePrice - prevEvent.basePrice;

const compareEventsByDuration = (prevEvent, nextEvent) => {
  const prevEventDuration = dayjs(prevEvent.dateTo) - dayjs(prevEvent.dateFrom);
  const nextEventDuration = dayjs(nextEvent.dateTo) - dayjs(nextEvent.dateFrom);
  return nextEventDuration - prevEventDuration;
};

const compareEventsByDay = (prevEvent, nextEvent) => isEventBeforeNextEvent(prevEvent, nextEvent) ? -1 : 1;

const getFullRoute = (events) => {
  if (!events.length) {
    return '';
  }
  const sortedDiestinationsByDay = [...events].sort(compareEventsByDay);
  const destinationPoints = new Set();
  sortedDiestinationsByDay.forEach((event) => destinationPoints.add(event.destination));
  return destinationPoints.size > 3
    ? `${sortedDiestinationsByDay[0].destination} &mdash; ... &mdash; ${sortedDiestinationsByDay[events.length - 1].destination}`
    : Array.from(destinationPoints).join('&mdash;');
};

const getRoutePeriod = (events) => {
  if (!events.length) {
    return '';
  }
  if (events.length === 1) {
    return getShortDate(events[0].dateFrom);
  }
  const sortedDiestinationsByDay = [...events].sort(compareEventsByDay);
  const start = sortedDiestinationsByDay[0].dateFrom;
  const finish = sortedDiestinationsByDay[sortedDiestinationsByDay.length - 1].dateFrom;
  return !isSameMonth(start, finish)
    ? `${getShortDate(start)}&nbsp;&mdash;&nbsp;${getShortDate(finish)}`
    : `${getShortDate(start)}&nbsp;&mdash;&nbsp;${dayjs(finish).format('DD')}`;
};

const updateElement = (elements, updatedElement) => {
  const index = elements.findIndex((element) => element.id === updatedElement.id);
  return index === -1 ? elements : [...elements.slice(0, index), updatedElement, ...elements.slice(index + 1)];
};

const getFutureEvents = (events) => events.filter((event) => dayjs().isBefore(dayjs(event.dateFrom)) || dayjs().isBefore(dayjs(event.dateTo)));

const getPastEvents = (events) => events.filter((event) => dayjs().isAfter(dayjs(event.dateFrom)));

const checkUnavailableFilter = (events) => {
  const futureEvents = getFutureEvents(events);
  const pastEvents = getPastEvents(events);
  return !futureEvents.length || !pastEvents.length;
};

const getFilteredEvents = (currentFilter, events = []) => {
  switch (currentFilter) {
    case FilterType.EVERYTHING: return events;
    case FilterType.FUTURE: return getFutureEvents(events);
    case FilterType.PAST: return getPastEvents(events);
    default: throw new Error('Unknown type of filter');
  }
};

// ???????????????? ?????????????????? ???? ?????????????????????????? ?? ?????????? ??????????
const isPositiveIntegerPrice = (price) => Number.isInteger(price) && price >= 0;

export {
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
  compareEventsByDuration,
  getFilteredEvents,
  checkUnavailableFilter,
  isEventBeforeNextEvent,
  compareEventsByDay,
  isPositiveIntegerPrice
};

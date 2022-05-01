// import dayjs from 'dayjs'
import { getRandomInt } from '../util';

const EVENT_TYPES = [
  'bus',
  'check-in',
  'drive',
  'flight',
  'restaurant',
  'ship',
  'sightseeing',
  'taxi',
  'train',
  'transport'
];

/**
 * Функция возвращает массив дат в которые происходят события
 * Первая дата случайная, последующие равномерно увеличиваются.
 * Время события также задается случайно
 * Длина получаемого массива задается параметром, по умолчанию - 10
 * @returns
 */
const getRandomEventsDate = (length = 10) => {
  const YEAR = 2022;
  const randomMonth = getRandomInt(4, 11);
  const randomDay = getRandomInt(1, 31);
  const randomHours = getRandomInt(10, 22);
  const randomMinutes = getRandomInt(0, 59);
  const firstDateRaw = new Date(`${YEAR}-${randomMonth}-${randomDay} ${randomHours}:${randomMinutes}`);
  return Array.from({ length: length }, (element, index) => {
    if (!index) {
      return firstDateRaw.toISOString(0);
    }
    const nextEventDateRow = new Date(firstDateRaw.setDate(firstDateRaw.getDate() + index)).setMinutes(firstDateRaw.getMinutes() + getRandomInt(10, 300));
    return new Date(nextEventDateRow).toISOString(0);
  });
};

const events = getRandomEventsDate(getRandomInt(3, 20)).map((eventDate, index) => {
  const startDateAndTime = new Date(eventDate);
  const finishDateAndTime = startDateAndTime.setMinutes(startDateAndTime.getMinutes() + getRandomInt(10, 300));
  return {
    id: index,
    basePrice: getRandomInt(100, 2500),
    dateFrom: eventDate,
    dateTo: new Date(finishDateAndTime).toISOString(0),
    destination: '',
    isFavorite: Math.random() > 0.5,
    offers: [],
    type: EVENT_TYPES[getRandomInt(0, EVENT_TYPES.length - 1)]
  };
});

export {
  events
};

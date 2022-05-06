import { getRandomInt } from '../util';
import { CITIES, OFFERS_TYPES, RANDOM_NUMBER_EVENT } from './constants';
/**
 * Функция возвращает массив дат в которые происходят события
 * Первая дата случайная, последующие равномерно увеличиваются.
 * Время события также задается случайно
 * Длина получаемого массива задается параметром, по умолчанию - 10
 * @returns
 */
const getRandomEventsDate = (eventQty) => {
  const YEAR = 2022;
  const randomMonth = getRandomInt(4, 11);
  const randomDay = getRandomInt(1, 31);
  const randomHours = getRandomInt(10, 22);
  const randomMinutes = getRandomInt(0, 59);
  const firstDateRaw = new Date(`${YEAR}-${randomMonth}-${randomDay} ${randomHours}:${randomMinutes}`);
  return Array.from({ length: eventQty }, (element, index) => {
    if (!index) {
      return firstDateRaw.toISOString(0);
    }
    const nextEventDateRow = new Date(firstDateRaw.setDate(firstDateRaw.getDate() + index)).setMinutes(firstDateRaw.getMinutes() + getRandomInt(10, 300));
    return new Date(nextEventDateRow).toISOString(0);
  });
};

const getEvents = (eventQty) => (getRandomEventsDate(eventQty).map((eventDate, index) => {
  const startDateAndTime = new Date(eventDate);
  const finishDateAndTime = startDateAndTime.setMinutes(startDateAndTime.getMinutes() + getRandomInt(10, 300));
  const randomOfferIds = Array.from({length: getRandomInt(0, 6)}, () => getRandomInt(0, 5));
  // Создаем коллекцию offers и добавляем элементы, каждый элемент коллекции будет уникальным из нее далее получаем массив уникальных значений
  const offerIdsCollection = new Set();
  randomOfferIds.forEach((element) => offerIdsCollection.add(element));
  return {
    id: index,
    basePrice: getRandomInt(100, 2500),
    dateFrom: eventDate,
    dateTo: new Date(finishDateAndTime).toISOString(0),
    destination: CITIES[getRandomInt(0, CITIES.length - 1)],
    isFavorite: Math.random() > 0.5,
    offers: Array.from(offerIdsCollection),
    type: OFFERS_TYPES[getRandomInt(0, OFFERS_TYPES.length - 1)]
  };
}));

export default getEvents(RANDOM_NUMBER_EVENT);

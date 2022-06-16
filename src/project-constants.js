import { getRandomInt } from './util';

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget,',
  'sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const CITIES = [
  'Chamonix',
  'Buenos Aires',
  'Tehran',
  'La Paz',
  'Rio de Janeiro',
  'Minsk',
  'Liverpool',
  'Kabul',
  'Miami',
  'Kingston',
  'Monaco',
  'Baku',
  'Mexico City',
  'Bern',
  'Zürich',
  'Rome',
  'Dubai',
  'Moscow'
];


const RANDOM_NUMBER_EVENT = getRandomInt(0, 5);

const SortType = {
  SORT_BY_DAY: {
    title: 'day',
    disabled: false,
  },
  SORT_BY_EVENT: {
    title: 'event',
    disabled: true
  },
  SORT_BY_TIME: {
    title: 'time',
    disabled: false,
  },
  SORT_BY_PRICE: {
    title: 'price',
    disabled: false,
  },
  SORT_BY_OFFER: {
    title: 'offer',
    disabled: true
  }
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const UpdateType = {
  DEFAULT: 'DEFAULT',
  FULL: 'FULL'
};

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 1440;

const EmptyListMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  FUTURE: 'There are no future events now'
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const DEFAULT_EVENT_TYPE = 'flight';

const EVENT_TYPES = [
  'bus',
  'check-in',
  'drive',
  'flight',
  'restaurant',
  'ship',
  'sightseeing',
  'taxi',
  'train'
];

export {
  SortType,
  FilterType,
  UpdateType,
  MINUTES_PER_HOUR,
  MINUTES_PER_DAY,
  EmptyListMessage,
  UserAction,
  EVENT_TYPES,
  RANDOM_NUMBER_EVENT,
  DESCRIPTIONS,
  CITIES,
  DEFAULT_EVENT_TYPE
};

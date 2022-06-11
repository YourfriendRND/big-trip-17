/*
  Контанты для всего проекта.
  в ./mock/contants.js - константы только для создания моков - будут удалены после отказа от моков
*/

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
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
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

export {
  SortType,
  FilterType,
  UpdateType,
  MINUTES_PER_HOUR,
  MINUTES_PER_DAY,
  EmptyListMessage,
  UserAction
};

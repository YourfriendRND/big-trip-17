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

export {
  SortType
};

const RestApiMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

const ServerEndpoin = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers'
};

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
  FULL: 'FULL',
  INIT: 'INIT'
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

const DownloadingStateType = {
  EVENTS: 'EVENTS',
  DESTINATIONS: 'DESTINATIONS',
  OFFERS: 'OFFERS'
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

const ApiConfig = {
  AUTHORIZATION: 'Basic ifdg7848dfg989fgrt888691254d1fds',
  END_POINT: 'https://17.ecmascript.pages.academy/big-trip'
};

const UiBlockerTimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {
  SortType,
  FilterType,
  UpdateType,
  MINUTES_PER_HOUR,
  MINUTES_PER_DAY,
  EmptyListMessage,
  UserAction,
  EVENT_TYPES,
  DEFAULT_EVENT_TYPE,
  RestApiMethods,
  ApiConfig,
  DownloadingStateType,
  ServerEndpoin,
  UiBlockerTimeLimit
};

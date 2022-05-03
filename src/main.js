import EventFilterForm from './view/filters-view';
import TripInfo from './view/trip-info-view';
import TripMapPresenter from './presenter/trip-map-presenter';
import { render } from './render';
import EventModel from './model/event-model';
import { getRandomInt } from './util';

const RANDOM_NUMBER_EVENT = getRandomInt(3, 25);

const tripMainBlock = document.querySelector('.trip-main');
const filterBlock = document.querySelector('.trip-controls__filters');
const tripEventsBlock = document.querySelector('.trip-events');

const eventModel = new EventModel(RANDOM_NUMBER_EVENT);
const tripMapPresenter = new TripMapPresenter();

render(new TripInfo(), tripMainBlock, 'afterbegin');
render(new EventFilterForm(), filterBlock);

tripMapPresenter.init(tripEventsBlock, eventModel);

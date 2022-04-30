import EventFilterForm from './view/filters-view';
import TripInfo from './view/trip-info-view';
import TripMapPresenter from './presenter/trip-map-presenter';
import { render } from './render';

const tripMainBlock = document.querySelector('.trip-main');
const filterBlock = document.querySelector('.trip-controls__filters');
const tripEventsBlock = document.querySelector('.trip-events');

const tripMapPresenter = new TripMapPresenter();

render(new TripInfo(), tripMainBlock, 'afterbegin');
render(new EventFilterForm(), filterBlock);

tripMapPresenter.init(tripEventsBlock);

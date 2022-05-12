import EventFilterFormView from './view/filters-view';
import TripInfoView from './view/trip-info-view';
import TripMapPresenter from './presenter/trip-map-presenter';
import { render } from './render';
import EventModel from './model/event-model';
import DestinationModel from './model/destination-model';
import OfferModel from './model/offer-model';
import destinationsMock from './mock/destination';
import eventsMock from './mock/event';
import offersMock from './mock/offers';
const tripMainBlock = document.querySelector('.trip-main');
const filterBlock = document.querySelector('.trip-controls__filters');
const tripEventsBlock = document.querySelector('.trip-events');

const destinationModel = new DestinationModel(destinationsMock);
const eventModel = new EventModel(eventsMock);
const offerModel = new OfferModel(offersMock);

const tripMapPresenter = new TripMapPresenter();

render(new TripInfoView(), tripMainBlock, 'afterbegin');
render(new EventFilterFormView(), filterBlock);

tripMapPresenter.init(tripEventsBlock, eventModel, destinationModel, offerModel);

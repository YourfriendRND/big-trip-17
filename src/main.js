import TripMapPresenter from './presenter/trip-map-presenter';
import TripHeaderPresenter from './presenter/trip-header-presenter';
import FilterPresenter from './presenter/filter-presenter';
import EventModel from './model/event-model';
import DestinationModel from './model/destination-model';
import OfferModel from './model/offer-model';
import FilterModel from './model/filter-model';
import destinationsMock from './mock/destination';
import eventsMock from './mock/event';
import offersMock from './mock/offers';

const tripMainBlock = document.querySelector('.trip-main');
const filterBlock = document.querySelector('.trip-controls__filters');
const tripEventsBlock = document.querySelector('.trip-events');

const destinationModel = new DestinationModel(destinationsMock);
const eventModel = new EventModel(eventsMock);
const offerModel = new OfferModel(offersMock);
const filterModel = new FilterModel();

const tripHeaderPresenter = new TripHeaderPresenter(tripMainBlock, eventModel);
const filterPresenter = new FilterPresenter(filterBlock, eventModel, filterModel);
const tripMapPresenter = new TripMapPresenter(tripEventsBlock, eventModel, destinationModel, offerModel, filterModel);

tripHeaderPresenter.init();
tripMapPresenter.init();
filterPresenter.init();

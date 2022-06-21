import TripMapPresenter from './presenter/trip-map-presenter';
import FilterPresenter from './presenter/filter-presenter';
import EventModel from './model/event-model';
import DestinationModel from './model/destination-model';
import OfferModel from './model/offer-model';
import FilterModel from './model/filter-model';
import EventApiService from './event-api-service';
import { ApiConfig } from './project-constants';

const api = new EventApiService(ApiConfig.END_POINT, ApiConfig.AUTHORIZATION);

const tripMainBlock = document.querySelector('.trip-main');
const filterBlock = document.querySelector('.trip-controls__filters');
const tripEventsBlock = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const eventModel = new EventModel(api);
const destinationModel = new DestinationModel(api);
const offerModel = new OfferModel(api);

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(tripMainBlock, filterBlock, eventModel, filterModel, offerModel);
const tripMapPresenter = new TripMapPresenter(tripEventsBlock, newEventButton, eventModel, destinationModel, offerModel, filterModel);
eventModel.init();
destinationModel.init();
offerModel.init();
tripMapPresenter.init();
filterPresenter.init();

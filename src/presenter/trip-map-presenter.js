import EventSortFormView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import EmptyListView from '../view/empty-list-view';
import EventPresenter from './event-presenter';
import { render, RenderPosition } from '../framework/render';
// import { updateElement, compareEventsByPrice, compareEventsByDuration } from '../util';
import { compareEventsByPrice, compareEventsByDuration, getPastEvents, getFutureEvents } from '../util';
import { SortType, FilterType } from '../project-constants';

export default class TripMapPresenter {
  #mapContainer = null;
  #eventModel = null;
  #destinationModel = null;
  #offerModel = null;
  #filterModel = null;
  #offers = [];
  #events = [];
  #destinations = [];
  // #sourcedEvents = [];
  #eventSortForm = new EventSortFormView();
  #eventList = new EventListView();

  #eventPresenter = new Map();

  constructor(mapContainer, eventModel, destinationModel, offerModel, filterModel) {
    this.#mapContainer = mapContainer;
    this.#eventModel = eventModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
    this.#filterModel = filterModel;
    // this.#eventModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events () {
    return this.#eventModel.events.map(this.#getAdaptEventToRender);
  }

  init = () => {
    this.#destinations = [...this.#destinationModel.destinations];
    this.#offers = [...this.#offerModel.offers];
    this.#events = this.#getFilteredEvents(this.#filterModel.filter);
    // this.#sourcedEvents = [...this.#events];

    if (!this.#events.length) {
      render(new EmptyListView(), this.#mapContainer);
      return;
    }

    render(this.#eventList, this.#mapContainer);
    this.#renderSort();
    this.#events.forEach(this.#renderEvent);
  };

  #handleModelEvent = () => {
    // Сбрасывать сортировку
    this.#clearEventsList();
    this.init();
  };

  #getFilteredEvents = (currentFilter) => {
    switch (currentFilter) {
      case FilterType.EVERYTHING: return this.events;
      case FilterType.FUTURE: return getFutureEvents(this.events);
      case FilterType.PAST: return getPastEvents(this.events);
      default: throw new Error('Unknown type of filter');
    }
  };

  #getAdaptEventToRender = (eventRow) => ({
    ...eventRow,
    offers: eventRow.offers.map((id) => {
      const sameOfferType = this.#offers.find((offerType) => offerType.type === eventRow.type);
      return sameOfferType.offers.find((offer) => offer.id === id);
    })
  });

  #getAdaptEventToModel = (eventRow) => ({
    ...eventRow,
    offers: eventRow.offers.map((offer) => offer.id)
  });

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventList, this.#handleEventChange, this.#handleModeEventChange);
    eventPresenter.init(event, this.#destinations, this.#offers);
    this.#eventPresenter.set(event.id, eventPresenter);
  };

  #clearEventsList = () => {
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();
  };

  #handleEventChange = (updatedEvent) => {
    // this.#events = updateElement(this.#events, updatedEvent);
    this.#eventModel.updateEvent(this.#getAdaptEventToModel(updatedEvent));
    // this.#sourcedEvents = updateElement(this.#sourcedEvents, updatedEvent);
    // this.#sourcedEvents = [...this.#eventModel.events];
    this.#events = [...this.events];
    this.#eventPresenter.get(updatedEvent.id).init(updatedEvent, this.#destinations, this.#offers);
  };

  #handleModeEventChange = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetDefaultView());
  };

  // Методы сортировки точек маршрута
  #renderSort = () => {
    render(this.#eventSortForm, this.#mapContainer, RenderPosition.AFTERBEGIN);
    this.#eventSortForm.setSortTypeChangeHandler(this.#handleSortEventsChange);
  };

  #sortEvents = (checkedSortType) => {
    switch(checkedSortType) {
      case SortType.SORT_BY_PRICE.title: {
        this.#events.sort(compareEventsByPrice);
        break;
      }
      case SortType.SORT_BY_TIME.title: {
        this.#events.sort(compareEventsByDuration);
        break;
      }
      default: this.#events = [...this.events];
    }
  };

  #handleSortEventsChange = (checkedSortType) => {
    this.#sortEvents(checkedSortType);
    this.#clearEventsList();
    this.#events.forEach(this.#renderEvent);
  };
}

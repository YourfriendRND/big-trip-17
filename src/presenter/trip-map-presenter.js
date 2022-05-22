import EventSortFormView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import EmptyListView from '../view/empty-list-view';
import EventPresenter from './event-presenter';
import { render, RenderPosition } from '../framework/render';
import { updateElement, compareEventsByPrice, compareEventsByDuration } from '../util';
import { SortType } from '../project-constants';

export default class TripMapPresenter {
  #mapContainer = null;
  #eventModel = null;
  #destinationModel = null;
  #offerModel = null;
  #offers = [];
  #events = [];
  #destinations = [];
  #currentSortType = SortType.DEFAULT;
  #sourcedEvents = [];
  #eventSortForm = new EventSortFormView();
  #eventList = new EventListView();

  #eventPresenter = new Map();

  constructor(mapContainer, eventModel, destinationModel, offerModel) {
    this.#mapContainer = mapContainer;
    this.#eventModel = eventModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
  }

  init = () => {
    this.#destinations = [...this.#destinationModel.destinations];
    this.#offers = [...this.#offerModel.offers];
    this.#events = this.#eventModel.events.map(this.#prepareEvent);
    this.#sourcedEvents = [...this.#events];

    if (!this.#events.length) {
      render(new EmptyListView(), this.#mapContainer);
      return;
    }

    render(this.#eventList, this.#mapContainer);
    this.#renderSort();
    this.#events.forEach(this.#renderEvent);
  };

  #prepareEvent = (eventRow) => ({
    ...eventRow,
    offers: eventRow.offers.map((id) => {
      const sameOfferType = this.#offers.find((offerType) => offerType.type === eventRow.type);
      return sameOfferType.offers.find((offer) => offer.id === id);
    })
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
    this.#events = updateElement(this.#events, updatedEvent);
    this.#sourcedEvents = updateElement(this.#sourcedEvents, updatedEvent);
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
      case SortType.SORT_BY_PRICE: {
        this.#events.sort(compareEventsByPrice);
        break;
      }
      case SortType.SORT_BY_TIME: {
        this.#events.sort(compareEventsByDuration);
        break;
      }
      default: this.#events = [...this.#sourcedEvents];
    }
    this.#currentSortType = checkedSortType;
  };

  #handleSortEventsChange = (checkedSortType) => {
    if (checkedSortType === this.#currentSortType) {
      return;
    }
    this.#sortEvents(checkedSortType);
    this.#clearEventsList();
    this.#events.forEach(this.#renderEvent);
  };
}

import EventSortFormView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import EmptyListView from '../view/empty-list-view';
import EventPresenter from './event-presenter';
import NewEventPresener from './new-event-presenter';
import { remove, render, RenderPosition } from '../framework/render';
import { compareEventsByPrice, compareEventsByDuration, getFilteredEvents } from '../util';
import { FilterType, SortType, UserAction, UpdateType } from '../project-constants';

export default class TripMapPresenter {
  #mapContainer = null;
  #eventModel = null;
  #destinationModel = null;
  #offerModel = null;
  #filterModel = null;
  #emptyListViewComponent = null;
  #newEventButton = null;
  #offers = [];
  #events = [];
  #destinations = [];
  #eventSortForm = new EventSortFormView();
  #eventList = new EventListView();
  #eventPresenter = new Map();
  #newEventPresenter = null;

  constructor(mapContainer, newEventButton, eventModel, destinationModel, offerModel, filterModel) {
    this.#mapContainer = mapContainer;
    this.#eventModel = eventModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
    this.#filterModel = filterModel;
    this.#newEventButton = newEventButton;
    this.#eventModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events () {
    return this.#eventModel.events.map(this.#getAdaptEventToRender);
  }

  init = () => {
    this.#destinations = [...this.#destinationModel.destinations];
    this.#offers = [...this.#offerModel.offers];
    this.#events = getFilteredEvents(this.#filterModel.filter, this.events);
    this.#newEventButton.addEventListener('click', this.#createNewEvent);
    this.#newEventPresenter = new NewEventPresener(this.#handleViewAction);
    render(this.#eventList, this.#mapContainer);
    if (!this.#events.length) {
      this.#emptyListViewComponent = new EmptyListView(this.#filterModel.filter);
      render(this.#emptyListViewComponent, this.#mapContainer);
      return;
    }

    this.#renderSort();
    this.#events.forEach(this.#renderEvent);
  };

  #clearMapContainer = () => {
    remove(this.#emptyListViewComponent);
    this.#clearEventsList();
  };

  #handleModelEvent = () => {
    this.#clearMapContainer();
    this.#resetSortType();
    this.init();
  };

  #handleViewAction = (userActionType, update) => {
    const adaptedEventToModel = this.#getAdaptEventToModel(update);
    switch (userActionType) {
      case UserAction.ADD_EVENT: {
        this.#eventModel.addEvent(adaptedEventToModel);
        break;
      }
      case UserAction.DELETE_EVENT: {
        this.#eventModel.deleteEvent(adaptedEventToModel);
        break;
      }
      case UserAction.UPDATE_EVENT: {
        this.#eventModel.updateEvent(adaptedEventToModel);
        break;
      }
      default: throw new Error('Unknown user action');
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
    const eventPresenter = new EventPresenter(this.#eventList, this.#handleViewAction, this.#handleModeEventChange);
    eventPresenter.init(event, this.#destinations, this.#offers);
    this.#eventPresenter.set(event.id, eventPresenter);
  };

  #clearEventsList = () => {
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();
  };

  #handleModeEventChange = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetDefaultView());
    this.#newEventPresenter.destroy();
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

  #resetSortType = () => {
    this.#eventSortForm.resetCurrentSortType();
    remove(this.#eventSortForm);
  };

  // Создание новой точки маршрута
  #createNewEvent = () => {
    this.#handleModeEventChange();
    this.#newEventPresenter.init(this.#eventList, this.#newEventButton, this.#destinations, this.#offers);
    this.#resetSortType();
    this.#filterModel.setFilterType(FilterType.EVERYTHING, UpdateType.FULL);
  };

}

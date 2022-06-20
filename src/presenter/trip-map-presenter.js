import EventSortFormView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import EmptyListView from '../view/empty-list-view';
import EventPresenter from './event-presenter';
import NewEventPresener from './new-event-presenter';
import LoadingView from '../view/loading-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { remove, render, RenderPosition } from '../framework/render';
import { compareEventsByPrice, compareEventsByDuration, getFilteredEvents, compareEventsByDay } from '../util';
import { FilterType, SortType, UserAction, UpdateType, EmptyListMessage, UiBlockerTimeLimit } from '../project-constants';

export default class TripMapPresenter {
  #listContainer = null;
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
  #preLoaderViewComponent = null;
  #isLoading = true;
  #downloadingState = {
    EVENTS: false,
    DESTINATIONS: false,
    OFFERS: false,
  };

  #uiBlocker = new UiBlocker(UiBlockerTimeLimit.LOWER_LIMIT, UiBlockerTimeLimit.UPPER_LIMIT);

  constructor(listContainer, newEventButton, eventModel, destinationModel, offerModel, filterModel) {
    this.#listContainer = listContainer;
    this.#eventModel = eventModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
    this.#filterModel = filterModel;
    this.#newEventButton = newEventButton;
    this.#eventModel.addObserver(this.#handleModelEvent);
    this.#destinationModel.addObserver(this.#handleModelEvent);
    this.#offerModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events () {
    return this.#eventModel.events.map(this.#getAdaptEventToRender);
  }

  init = () => {
    if (this.#isLoading) {
      this.#renderPreLoader();
      return;
    }

    this.#destinations = [...this.#destinationModel.destinations];
    this.#offers = [...this.#offerModel.offers];
    this.#events = getFilteredEvents(this.#filterModel.filter, this.events);
    this.#newEventButton.addEventListener('click', this.#createNewEvent);
    this.#newEventPresenter = new NewEventPresener(this.#events, this.#destinations, this.#offers, this.#eventList, this.#newEventButton, this.#handleViewAction, this.#getEmptyMessageByFilter);
    render(this.#eventList, this.#listContainer);
    if (!this.#events.length) {
      this.#emptyListViewComponent = new EmptyListView(this.#getEmptyMessageByFilter());
      render(this.#emptyListViewComponent, this.#listContainer);
      return;
    }
    this.#renderSort();
    this.#sortEvents();
    this.#renderEventTripBoard();
  };

  #renderEventTripBoard = () => {
    this.#events.forEach(this.#renderEvent);
  };

  #clearListContainer = () => {
    remove(this.#emptyListViewComponent);
    remove(this.#preLoaderViewComponent);
    this.#clearEventsList();
  };

  #handleModelEvent = (type, payload) => {
    switch (type) {
      case UpdateType.FULL: {
        this.#filterModel.setFilterType(FilterType.EVERYTHING);
        this.#clearListContainer();
        this.#resetSortType();
        this.#newEventPresenter.destroy();
        this.init();

        break;
      }
      case UpdateType.INIT: {
        this.#downloadingState[payload] = true;
        this.#isLoading = Object.values(this.#downloadingState).some((status) => !status);
        if (!this.#isLoading) {
          remove(this.#preLoaderViewComponent);
          this.init();
        }
        break;
      }
      default: {
        this.#clearListContainer();
        this.#events = getFilteredEvents(this.#filterModel.filter, this.events);
        this.#sortEvents(this.#eventSortForm.getCurrentSortType());
        this.#renderEventTripBoard();
      }
    }
  };

  #handleViewAction = async (userActionType, update) => {
    this.#uiBlocker.block();
    const adaptedEventToModel = this.#getAdaptEventToModel(update);
    switch (userActionType) {
      case UserAction.ADD_EVENT: {
        try {
          this.#newEventPresenter.setSaving();
          await this.#eventModel.addEvent(adaptedEventToModel);
        } catch (err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      }
      case UserAction.DELETE_EVENT: {
        try {
          this.#eventPresenter.get(update.id).setDelitingEditForm();
          await this.#eventModel.deleteEvent(adaptedEventToModel);
        } catch (err) {
          this.#eventPresenter.get(update.id).setAborting();
        }
        break;
      }
      case UserAction.UPDATE_EVENT: {
        try {
          this.#eventPresenter.get(update.id).setSavingEditForm();
          await this.#eventModel.updateEvent(adaptedEventToModel);
        } catch (err) {
          this.#eventPresenter.get(update.id).setAborting();
        }
        break;
      }
      default: throw new Error('Unknown user action');
    }
    this.#uiBlocker.unblock();
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
    destination: {...this.#destinations.find((destination) => destination.name === eventRow.destination)},
    offers: eventRow.offers.map((offer) => offer.id)
  });

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventList, this.#handleViewAction, this.#handleModeEventChange);
    eventPresenter.init(event, this.#destinations, this.#offers);
    this.#eventPresenter.set(event.id, eventPresenter);
  };

  #renderPreLoader = () => {
    this.#preLoaderViewComponent = new LoadingView();
    render(this.#preLoaderViewComponent, this.#listContainer);
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
    render(this.#eventSortForm, this.#listContainer, RenderPosition.AFTERBEGIN);
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
      default: this.#events.sort(compareEventsByDay);
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
    remove(this.#emptyListViewComponent);
    this.#newEventPresenter.destroyEmptyView();
    if (this.#events.length > 0) {
      this.#handleModeEventChange();
    }
    this.#newEventPresenter.init();
    this.#resetSortType();
  };

  #getEmptyMessageByFilter = () => {
    switch(this.#filterModel.filter) {
      case FilterType.EVERYTHING: return EmptyListMessage.EVERYTHING;
      case FilterType.FUTURE: return EmptyListMessage.FUTURE;
      case FilterType.PAST: return EmptyListMessage.PAST;
      default: throw new Error('Unknown filter type');
    }
  };

}

import EventFilterFormView from '../view/filters-view';
import TripInfoView from '../view/trip-info-view';
import { remove, render, RenderPosition } from '../framework/render';

export default class FilterPresenter {
  #eventModel = null;
  #filterModel = null;
  #filterContainer = null;
  #filterViewComponent = null;
  #headerViewComponent = null;
  #events = [];
  #headerContainer = null;

  constructor(headerContainer, filterContainer, eventModel, filterModel) {
    this.#headerContainer = headerContainer;
    this.#filterContainer = filterContainer;
    this.#eventModel = eventModel;
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#eventModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#events = this.#eventModel.events;
    if (!this.#events.length) {
      return;
    }
    this.#headerViewComponent = new TripInfoView(this.#events);
    this.#filterViewComponent = new EventFilterFormView(this.#events, this.#filterModel.filter);
    render(this.#headerViewComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
    render(this.#filterViewComponent, this.#filterContainer);
    this.#filterViewComponent.setChangeFilter(this.#setUpdateFilterType);
  };

  #setUpdateFilterType = (updatedType) => {
    this.#filterModel.setFilterType(updatedType);
  };

  #handleModelEvent = () => {
    this.#destroyHeader();
    this.#destroyFilter();
    this.init();
  };

  #destroyHeader = () => {
    remove(this.#headerViewComponent);
  };

  #destroyFilter = () => {
    remove(this.#filterViewComponent);
  };
}

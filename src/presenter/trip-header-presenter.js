import TripInfoView from '../view/trip-info-view';
// import EventFilterFormView from '../view/filters-view';
import { render, RenderPosition } from '../framework/render';

export default class TripHeaderPresenter {
  #headerContainer = null;
  // #filterContainer = null;
  #eventModel = null;
  #events = [];

  constructor(headerContainer, eventModel) {
    this.#headerContainer = headerContainer;
    // this.#filterContainer = filterContainer;
    this.#eventModel = eventModel;
    this.#events = [...this.#eventModel.events];
  }

  init = () => {
    // this.#events = [...this.#eventModel.events];
    // const eventFilter = new EventFilterFormView(this.#events);
    // render(eventFilter, this.#filterContainer);
    if (!this.#events.length) {
      return;
    }
    const tripHeader = new TripInfoView(this.#events);
    render(tripHeader, this.#headerContainer, RenderPosition.AFTERBEGIN);
  };
}

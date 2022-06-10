import EventFilterFormView from '../view/filters-view';
import { render } from '../framework/render';

export default class FilterPresenter {
  #eventModel = null;
  #filterModel = null;
  #filterContainer = null;
  #filterView = null;
  #events = [];

  constructor(filterContainer, eventModel, filterModel) {
    this.#filterContainer = filterContainer;
    this.#eventModel = eventModel;
    this.#filterModel = filterModel;
    this.#events = [...this.#eventModel.events];
  }

  init = () => {
    this.#filterView = new EventFilterFormView(this.#events);
    render(this.#filterView, this.#filterContainer);
    this.#filterView.setChangeFilter(this.#setUpdateFilterType);
  };

  #setUpdateFilterType = (updatedType) => {
    this.#filterModel.setFilterType(updatedType);
  };
}

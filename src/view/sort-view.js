import AbstractView from '../framework/view/abstract-view';
import { SortType } from '../project-constants';

const createEventSortFormTemplate = () => `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${Object.values(SortType).map((type) => `<div class="trip-sort__item  trip-sort__item--${type.title}">
      <input id="sort-${type.title}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type.title}"
      ${type.title === 'day' ? 'checked' : ''} ${type.disabled ? 'disabled' : ''} ${!type.disabled ? `data-sort-type="${type.title}"` : ''}>
      <label class="trip-sort__btn" for="sort-${type.title}">${type.title}</label>
    </div>`).join('')}
  </form>`;

export default class EventSortFormView extends AbstractView {
  #currentSortType = SortType.SORT_BY_DAY.title;
  constructor() {
    super();
  }

  get template() {
    return createEventSortFormTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#changeSortTypeHandler);
  };

  #changeSortTypeHandler = (evt) => {
    evt.preventDefault();
    const controlElement = evt.target.control;
    if (!evt.target.control.dataset.sortType || evt.target.control.dataset.sortType === this.#currentSortType) {
      return;
    }
    this.#currentSortType = evt.target.control.dataset.sortType;
    controlElement.checked = true;
    this._callback.sortTypeChange(evt.target.control.dataset.sortType);
  };

  resetCurrentSortType = () => {
    this.#currentSortType = SortType.SORT_BY_DAY.title;
  };

  getCurrentSortType = () => this.#currentSortType;
}

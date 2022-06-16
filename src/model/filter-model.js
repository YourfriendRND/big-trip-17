import Observable from '../framework/observable';
import { FilterType, UpdateType } from '../project-constants';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  set filter(updateTypeFilter) {
    this.#filter = updateTypeFilter;
  }

  /**
   * Устанавливает новый тип фильтра
   * @param {String} updatedType - Новый тип фиьтра
   * @param {String} eventType - Тип события
   */
  setFilterType(updatedType, eventType = UpdateType.DEFAULT) {
    this.#filter = updatedType;
    this._notify(eventType);
  }
}

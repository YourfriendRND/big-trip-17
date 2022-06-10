import Observable from '../framework/observable';
import { FilterType } from '../project-constants';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilterType(updatedType) {
    this.#filter = updatedType;
    this._notify();
    // this._notify(updatedType, filter);
  }
}

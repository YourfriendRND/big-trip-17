import AbstractView from '../framework/view/abstract-view.js';
import { areThereFutureEvents, areTherePastEvents } from '../util.js';
import { FilterType } from '../project-constants.js';

const createEventFilterFormTemplate = (events, filterType = FilterType.EVERYTHING) => `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${filterType === FilterType.EVERYTHING ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future"
      ${!events.length || !areThereFutureEvents(events) ? 'disabled' : ''} ${filterType === FilterType.FUTURE ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past"
      ${!events.length || !areTherePastEvents(events) ? 'disabled' : ''} ${filterType === FilterType.PAST ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class EventFilterFormView extends AbstractView {
  #events = null;
  #currentFilterType = null;
  constructor(events, currentFilterType) {
    super();
    this.#events = events;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createEventFilterFormTemplate(this.#events, this.#currentFilterType);
  }

  setChangeFilter = (callback) => {
    this._callback.changeType = callback;
    this.element.querySelectorAll('.trip-filters__filter-input').forEach((element) => element.addEventListener('change', this.#changeFilterTypeHandler));
  };

  #changeFilterTypeHandler = (evt) => {
    evt.preventDefault();
    this._callback.changeType(evt.target.value);
  };

}

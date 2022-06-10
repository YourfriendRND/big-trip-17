import AbstractView from '../framework/view/abstract-view.js';
import { areThereFutureEvents, areTherePastEvents } from '../util.js';

const createEventFilterFormTemplate = (events) => `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future"
      ${!events.length || !areThereFutureEvents(events) ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past"
      ${!events.length || !areTherePastEvents(events) ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class EventFilterFormView extends AbstractView {
  #events = null;
  constructor(events) {
    super();
    this.#events = events;
  }

  get template() {
    return createEventFilterFormTemplate(this.#events);
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


import AbstractView from '../framework/view/abstract-view';
import { getFullRoute, getRoutePeriod } from '../util';

const createTripInfoTemplate = (events) => `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${!events.length ? '' : getFullRoute(events)}</h1>

      <p class="trip-info__dates">${!events.length ? '' : getRoutePeriod(events)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${events.reduce((amount, event) => amount + event.basePrice, 0)}</span>
    </p>
  </section>`;

export default class TripInfoView extends AbstractView {
  #events = null;
  constructor (events) {
    super();
    this.#events = events;
  }

  get template() {
    return createTripInfoTemplate(this.#events);
  }

}

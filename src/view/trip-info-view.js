
import AbstractView from '../framework/view/abstract-view';
import { getFullRoute, getRoutePeriod } from '../util';

const createTripInfoTemplate = (events, totalPrice) => `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getFullRoute(events)}</h1>
      <p class="trip-info__dates">${getRoutePeriod(events)}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`;

export default class TripInfoView extends AbstractView {
  #events = null;
  #offers = null;
  #totalTripPrice = 0;

  constructor (events, offers) {
    super();
    this.#offers = [...offers];
    this.#events = [...events];
    this.#totalTripPrice = this.#events.reduce((amount, event) => amount + event.basePrice + this.#getEventOffersPrice(event), 0);
  }

  get template() {
    return createTripInfoTemplate(this.#events, this.#totalTripPrice);
  }

  #getEventOffersPrice = (event) => {
    const targetOffer = this.#offers.find((offer) => offer.type === event.type);
    const eventOferPrices = targetOffer ? event.offers.map((offerId) => targetOffer.offers.find((offer) => offerId === offer.id).price) : [];
    return eventOferPrices.reduce((amount, price) => amount + price, 0);
  };

}

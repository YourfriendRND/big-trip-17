import { createElement } from '../render';

const createOffersTemplate = (availableOffers, {type, offers}) => `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${availableOffers.find((offerType) => offerType.type === type).offers.map((offer) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="${offer.title}" ${offers.find((id)=> offer.id === id) ? 'checked' : ''}>
        <label class="event__offer-label" for="${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`)}
    </div>
  </section>`;

export default class Offers {
  constructor(availableOffers, event) {
    this.event = event;
    this.availableOffers = availableOffers;
  }

  getTemplate() {
    return createOffersTemplate(this.availableOffers, this.event);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

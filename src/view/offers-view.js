import { createElement } from '../render';

const createOffersTemplate = (availableOffers, { type, offers }) => `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${type
    ? availableOffers.find((offerType) => offerType.type === type).offers.map((offer) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="${offer.title}" ${offers.find((id) => offer.id === id) ? 'checked' : ''}>
        <label class="event__offer-label" for="${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join('')
    :
    ` <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">Add luggage</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">30</span>
      </label>
    </div>
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
      <label class="event__offer-label" for="event-offer-comfort-1">
        <span class="event__offer-title">Switch to comfort class</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">100</span>
      </label>
    </div>
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
      <label class="event__offer-label" for="event-offer-meal-1">
        <span class="event__offer-title">Add meal</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">15</span>
      </label>
    </div>
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
      <label class="event__offer-label" for="event-offer-seats-1">
        <span class="event__offer-title">Choose seats</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">5</span>
      </label>
    </div>
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
      <label class="event__offer-label" for="event-offer-train-1">
        <span class="event__offer-title">Travel by train</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">40</span>
      </label>
    </div>`}
    </div>
  </section>`;

export default class OffersView {
  constructor(availableOffers, event) {
    this.event = event ? event : {};
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

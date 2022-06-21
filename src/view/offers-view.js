import AbstractView from '../framework/view/abstract-view';
import { DEFAULT_EVENT_TYPE } from '../project-constants';

const createOffersTemplate = (availableOffers, { type = DEFAULT_EVENT_TYPE, offers = [] }, isDisabled) => `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${type
    ? availableOffers.find((offerType) => offerType.type === type).offers.map((currentOffer) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${currentOffer.id}" type="checkbox" name="${currentOffer.title}"
        ${offers.find((offer) => offer.id === currentOffer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="${currentOffer.id}">
          <span class="event__offer-title">${currentOffer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${currentOffer.price}</span>
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

export default class OffersView extends AbstractView {
  #isDisabled = false;
  #event = null;
  #availableOffers = [];
  constructor(availableOffers, event, isDisabledStatus) {
    super();
    this.#event = event ? event : {};
    this.#availableOffers = [...availableOffers];
    this.#isDisabled = isDisabledStatus;
  }

  get template() {
    return createOffersTemplate(this.#availableOffers, this.#event, this.#isDisabled);
  }

  /**
   * Получение всех выбранных доп.опций пользователем
   * @returns {Array} Массив id доп.опций
   */
  getCheckedOffers = () => Array.from(this.element.querySelectorAll('.event__offer-checkbox')).filter((element) => element.checked).map((element) => ({
    id: Number(element.id),
    type: this.#event.type
  }));
}

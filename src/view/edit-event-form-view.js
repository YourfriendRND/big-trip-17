import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { getDateTimeForEdit } from '../util';

import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';


const createEditEventFormTemplate = ({basePrice, type, dateFrom, dateTo, destination}, destinations) => `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${type === 'taxi' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type === 'bus' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type === 'train' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type === 'ship' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type === 'drive' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${type === 'flight' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type === 'check-in' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${type === 'sightseeing' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type === 'restaurant' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinations.map((item) => `<option value="${item.name}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTimeForEdit(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTimeForEdit(dateTo)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">

      </section>
    </form>
  </li>`;

export default class EditEventFormView extends AbstractStatefulView {
  #datepicker = null;
  #destinations = [];

  constructor (event, destinations) {
    super();
    this._state = this.#parseEventToState(event);
    this.#destinations = [...destinations];
    this.#setDatepicker();
  }

  get template() {
    return createEditEventFormTemplate(this._state, this.#destinations);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  _restoreHandlers = () => {
    this.setChangeTypeEventHandler(this._callback.changeType);
    this.setChangeDestinationHandler(this._callback.changeDest);
    this.setEditSubmitHandler(this._callback.submit);
    this.setCloseEditClickHandler(this._callback.click);
    this.#setDatepicker();
  };

  #parseEventToState = (event) => ({...event});

  #parseStateToEvent = (state) => ({...state});

  setChangeTypeEventHandler = (callback) => {
    this._callback.changeType = callback;
    const allEventTypeButtons = this.element.querySelectorAll('.event__type-input');
    allEventTypeButtons.forEach((element) => element.addEventListener('click', this.#changeTypeEvent));
  };

  setChangeDestinationHandler = (callback) => {
    this._callback.changeDest = callback;
    this.element.querySelector('.event__input').addEventListener('change', this.#changeDestinationHandler);
  };

  setEditSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.element.addEventListener('submit', this.#closeEditFormSubmitHandler);
  };

  setCloseEditClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditFormClickHandler);
  };

  reset = (event) => {
    this.updateElement(this.#parseEventToState(event));
  };

  #changeDestinationHandler = (evt) => {
    this.updateElement({
      destination: evt.target.value
    });
    this._callback.changeDest(this.#parseStateToEvent(this._state));
  };

  #closeEditFormSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(this.#parseStateToEvent(this._state));
  };

  #changeTypeEvent = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
    this._callback.changeType(this.#parseStateToEvent(this._state));
  };

  #closeEditFormClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  // методы для даты
  #setDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('.event__input--time'), {
        dateFormat: 'j F',
        defaultDate: this._state.dateFrom,
        onChange: this.#changeDate()
      });
  };

  #changeDate = () => {};
}

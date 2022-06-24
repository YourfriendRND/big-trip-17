import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { getDateTimeForEdit, isPositiveIntegerPrice } from '../util';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createEditEventFormTemplate = ({basePrice, type, dateFrom, dateTo, destination, isSaving, isDeliting, isDisabled}, destinations, eventTypes) => `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypes.map((eventType) => ` <div class="event__type-item">
              <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${type === eventType ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType.charAt(0).toUpperCase() + eventType.slice(1)}</label>
            </div>`).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
          value="${destination}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
            ${destinations.map((item) => `<option value="${item.name}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" ${isDisabled ? 'disabled' : ''} type="text" name="event-start-time" value="${getDateTimeForEdit(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" ${isDisabled ? 'disabled' : ''} type="text" name="event-end-time" value="${getDateTimeForEdit(dateTo)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" pattern="\\/[0-9]/" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeliting ? 'Deliting...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
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
  #eventTypes = null;

  constructor (event, destinations, offers) {
    super();
    this._state = this.#parseEventToState(event);
    this.#destinations = [...destinations];
    this.#eventTypes = offers.map((offer) => offer.type);

    this.#setDatepickerStartDate();
    this.#setDatePickerFinishDate();
  }

  get template() {
    return createEditEventFormTemplate(this._state, this.#destinations, this.#eventTypes);
  }

  _restoreHandlers = () => {
    this.setChangeTypeEventHandler(this._callback.changeType);
    this.setChangeDestinationHandler(this._callback.changeDest);
    this.setEditSubmitHandler(this._callback.submit);
    this.setCloseEditClickHandler(this._callback.click);
    this.#setDatepickerStartDate();
    this.#setDatePickerFinishDate();
    this.setChangePriceHandler(this._callback.changePrice);
    this.setDeleteEventClickHandler(this._callback.deleteEvent);
  };

  getCurrentState = () => (this.#parseStateToEvent(this._state));

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

  setDeleteEventClickHandler = (callback) => {
    this._callback.deleteEvent = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteEventHandler);
  };

  setChangePriceHandler = () => {
    this.element.querySelector('.event__input--price').addEventListener('change', this.#changePriceHandler);
  };

  reset = (event) => {
    this.updateElement(this.#parseEventToState(event));
  };

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  #parseEventToState = (event) => ({
    ...event,
    isDisabled: false,
    isSaving: false,
    isDeliting: false
  });

  #parseStateToEvent = (state) => {
    const event = {...state};

    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeliting;

    return event;
  };

  #deleteEventHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteEvent(this.#parseStateToEvent(this._state));
  };

  #isPriceAndDestinationFieldsInvalid = () => {
    const destinationField = this.element.querySelector('.event__input--destination');
    const priceField = this.element.querySelector('.event__input--price');
    return !!(!destinationField.validity.valid || !priceField.validity.valid);
  };

  #changeDestinationHandler = (evt) => {
    const validToggle = this.#isDestinationValid(evt.target.value);
    const submitBtn = this.element.querySelector('.event__save-btn');
    if (validToggle) {
      evt.target.setCustomValidity('');
      submitBtn.disabled = this.#isPriceAndDestinationFieldsInvalid();
      this._setState({
        destination: evt.target.value
      });
      this._callback.changeDest(this.#parseStateToEvent(this._state));
      return;
    }
    submitBtn.disabled = true;
    evt.target.setCustomValidity('incorrect destination point, please select a destination from the list of available');
  };

  #changePriceHandler = (evt) => {
    const price = Number(evt.target.value);
    const submitBtn = this.element.querySelector('.event__save-btn');
    if(isPositiveIntegerPrice(price)) {
      evt.target.setCustomValidity('');
      submitBtn.disabled = this.#isPriceAndDestinationFieldsInvalid();
      this._setState({
        basePrice: price
      });
      return;
    }
    submitBtn.disabled = true;
    evt.target.setCustomValidity('incorrect price, please input a positive and integer number');
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
  #setDatepickerStartDate = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('[name="event-start-time"]'), {
        enableTime: true,
        'time_24hr': true, // линтер ругается, что не camelCase
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onClose: this.#changeDateTime('dateFrom'), //Поставил onClose потому что onChange не реагирует на смену времени - только дата
        formatDate: () => getDateTimeForEdit(this._state.dateFrom)
      });
  };

  #setDatePickerFinishDate = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('[name="event-end-time"]'), {
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onClose: this.#changeDateTime('dateTo'), //Поставил onClose потому что onChange не реагирует на смену времени - только дата
        formatDate: () => getDateTimeForEdit(this._state.dateTo)
      }
    );
  };

  #changeDateTime = (dateType) => (([updatedDate]) => {
    this._setState({
      [dateType]:updatedDate.toISOString(0),
    });
    this.#setDatePickerFinishDate();
    this.#setDatepickerStartDate();
  });

  #isDestinationValid = (destinationValue) => this.#destinations.some((destination) => destination.name === destinationValue);
}

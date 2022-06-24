import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import { getDateTimeForEdit, isPositiveIntegerPrice } from '../util';
import 'flatpickr/dist/flatpickr.min.css';

const createNewEventFormTemplate = (destinations, eventTypes, event = null) => `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${event ? event.type : 'Flight'}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${event && event.isDisabled ? 'disabled' : ''}>

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${eventTypes.map((type) => ` <div class="event__type-item">
              <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}"
              ${event && event.type === type ? 'checked' : ''} ${event && event.isDisabled ? 'disabled' : ''}>
              <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
            </div>`).join('')}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${event ? event.type : 'Flight'}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
        value="${event ? event.destination : 'Geneva'}" list="destination-list-1" ${event && event.isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-1">
          ${destinations.map((item) => `<option value="${item.name}"></option>`).join('')}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00" ${event && event.isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00" ${event && event.isDisabled ? 'disabled' : ''}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" pattern="\\/[0-9]/" name="event-price"
        value="${event ? event.basePrice : ''}" ${event && event.isDisabled ? 'disabled' : ''}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${event && event.isDisabled ? 'disabled' : ''}>${event && event.isSaving ? 'Saving' : 'Save'}</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details"></section>
  </form>
  </li>`;

export default class NewEventFormView extends AbstractStatefulView {
  #destinations = [];
  #datepicker = null;
  #eventTypes = null;
  #getEscCloser = null;
  #onEcsKeyDown = null;

  constructor(destinations, offers, getEcsCloser, event = null) {
    super();
    this.#destinations = [...destinations];
    this.#eventTypes = offers.map((offer) => offer.type);
    this._state = event ? this.#parseEventToState(event) : this.#getNewEventData();
    this.#setDatepickerStartDate();
    this.#setDatePickerFinishDate();
    this.#getEscCloser = getEcsCloser;

  }

  get template() {
    return createNewEventFormTemplate(this.#destinations, this.#eventTypes, this._state);
  }

  _restoreHandlers = () => {
    this.setSubmitEventClickHandler(this._callback.submit);
    this.setCancelClickHandler(this._callback.cancel);
    this.setChangeTypeEventHandler(this._callback.changeType);
    this.setChangeDestinationHandler(this._callback.changeDest);
    this.setChangePriceHandler();
    this.#setDatepickerStartDate();
    this.#setDatePickerFinishDate();
    this.setCloseEcsHandler(this._callback.close);
  };

  getCurrentState = () => (this.#parseStateToEvent(this._state));

  setCancelClickHandler = (callback) => {
    this._callback.cancel = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);
  };

  setCloseEcsHandler = (callback) => {
    this._callback.close = callback;
    if (document.activeElement) {
      document.activeElement.blur();
    }
    this.#onEcsKeyDown = this.#getEscCloser([callback]);
    document.addEventListener('keydown', this.#onEcsKeyDown);
  };

  setChangeDestinationHandler = (callback) => {
    this._callback.changeDest = callback;
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestinationHandler);
  };

  setChangeTypeEventHandler = (callback) => {
    this._callback.changeType = callback;
    const allEventTypeButtons = this.element.querySelectorAll('.event__type-input');
    allEventTypeButtons.forEach((element) => element.addEventListener('click', this.#changeTypeEvent));
  };

  setChangePriceHandler = () => {
    this.element.querySelector('.event__input--price').addEventListener('change', this.#changePriceHandler);
  };

  setSubmitEventClickHandler = (callback) => {
    this._callback.submit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#submitEventClickHandler);
  };

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  #getNewEventData = () => ({
    basePrice: 0,
    dateFrom: new Date().toISOString(0),
    dateTo: new Date().toISOString(0),
    destination: 'Geneva',
    isFavorite: false,
    offers: [],
    type: 'flight',
    isDisabled: false,
    isSaving: false,
  });

  #parseStateToEvent = (state) => {
    const event = {...state};

    delete event.isDisabled;
    delete event.isSaving;

    return event;
  };

  #parseEventToState = (event) => ({
    ...event,
    isDisabled: false,
    isSaving: false,
  });

  #changeTypeEvent = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
    this._callback.changeType(this.#parseStateToEvent(this._state));
  };

  #cancelClickHandler = () => {
    this._callback.cancel();
    document.removeEventListener('keydown', this.#onEcsKeyDown);
    this._state = null;
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
    this._setState({[dateType]: updatedDate.toISOString(0)});
    this.#setDatePickerFinishDate();
    this.#setDatepickerStartDate();
  });

  #submitEventClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(this.#parseStateToEvent(this._state));
    this.state = null;
  };

  #isDestinationValid = (destinationValue) => this.#destinations.some((destination) => destination.name === destinationValue);
}

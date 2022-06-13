import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import { getDateTimeForEdit } from '../util';
import 'flatpickr/dist/flatpickr.min.css';

const createNewEventFormTemplate = (destinations, event = null) => `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${event ? event.type : 'Flight'}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            <div class="event__type-item">
            <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${event && event.type === 'taxi' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${event && event.type === 'bus' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${event && event.type === 'train' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${event && event.type === 'ship' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${event && event.type === 'drive' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${event && event.type === 'flight' ? 'checked' : ''} >
            <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${event && event.type === 'check-in' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${event && event.type === 'sightseeing' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${event && event.type === 'restaurant' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
          </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${event ? event.type : 'Flight'}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${event ? event.destination : 'Geneva'}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${destinations.map((item) => `<option value="${item.name}"></option>`).join('')}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" pattern="\\/[0-9]/" name="event-price" value="${event ? event.basePrice : ''}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details"></section>
  </form>
  </li>`;

export default class NewEventFormView extends AbstractStatefulView {
  #destinations = [];
  #datepicker = null;

  constructor(destinations, event = null) {
    super();
    this.#destinations = [...destinations];
    this._state = !event ? this.#getNewEventData() : this.#parseEventToState(event);
    this.#setDatepickerStartDate();
    this.#setDatePickerFinishDate();
  }

  get template() {
    return createNewEventFormTemplate(this.#destinations, this._state);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  _restoreHandlers = () => {
    this.setSubmitEventClickHandler(this._callback.submit);
    this.setCancelClickHandler(this._callback.cancel);
    this.setChangeTypeEventHandler(this._callback.changeType);
    this.setChangeDestinationHandler(this._callback.changeDest);
    this.setChangePriceHandler(this._callback.changePrice);
    this.#setDatepickerStartDate();
    this.#setDatePickerFinishDate();
    this.setCloseEcsHandler(this._callback.close);
  };

  #getNewEventData = () => ({
    basePrice: 0,
    dateFrom: new Date().toISOString(0),
    dateTo: new Date().toISOString(0),
    destination: 'Geneva',
    isFavorite: false,
    offers: [],
    type: 'flight',
  });

  #parseStateToEvent = (state) => ({...state});

  #parseEventToState = (event) => ({...event});

  setCancelClickHandler = (callback) => {
    this._callback.cancel = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);
  };

  setCloseEcsHandler = (callback) => {
    this._callback.close = callback;
    document.addEventListener('keydown', this.#onEcsKeyDown);
  };

  #cancelClickHandler = () => {
    this._callback.cancel();
    document.removeEventListener('keydown', this.#onEcsKeyDown);
    this._state = null;
  };

  setChangeTypeEventHandler = (callback) => {
    this._callback.changeType = callback;
    const allEventTypeButtons = this.element.querySelectorAll('.event__type-input');
    allEventTypeButtons.forEach((element) => element.addEventListener('click', this.#changeTypeEvent));
  };

  #changeTypeEvent = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
    this._callback.changeType(this.#parseStateToEvent(this._state));
  };

  setChangeDestinationHandler = (callback) => {
    this._callback.changeDest = callback;
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestinationHandler);
  };

  #changeDestinationHandler = (evt) => {
    const validToggle = this.#isDestinationValid(evt.target.value);
    const submitBtn = this.element.querySelector('.event__save-btn');
    if (!validToggle) {
      submitBtn.disabled = true;
      evt.target.setCustomValidity('incorrect destination point, please select a destination from the list of available');
      return;
    }
    this.updateElement({
      destination: evt.target.value
    });
    this._callback.changeDest(this.#parseStateToEvent(this._state));
  };

  // методы для даты
  setChangeDateTime = (callback) => {
    this._callback.changeDateTime = callback;
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
    this.updateElement({[dateType]: updatedDate.toISOString(0)});
    this._callback.changeDateTime(this.#parseStateToEvent(this._state));
  });


  setChangePriceHandler = (callback) => {
    this._callback.changePrice = callback;
    this.element.querySelector('.event__input--price').addEventListener('change', this.#changePriceHandler);
  };

  #changePriceHandler = (evt) => {
    this.updateElement({
      basePrice: Number(evt.target.value)
    });
    this._callback.changePrice(this.#parseStateToEvent(this._state));
  };

  setSubmitEventClickHandler = (callback) => {
    this._callback.submit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#submitEventClickHandler);
  };

  #submitEventClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(this.#parseStateToEvent(this._state));
    this.state = null;
  };

  #onEcsKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this._callback.close();
      document.removeEventListener('keydown', this.#onEcsKeyDown);
      this._state = null;
    }
  };

  #isDestinationValid = (destinationValue) => {
    const targetDestination = this.#destinations.find((destination) => destination.name === destinationValue);
    return !!targetDestination;
  };
}

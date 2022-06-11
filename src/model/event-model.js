import Observable from '../framework/observable';
import {isEventBeforeNextEvent} from '../util';

export default class EventModel extends Observable {
  #events;
  constructor(events) {
    super();
    this.#events = events;
  }

  get events () {
    return this.#events;
  }

  set events (events) {
    this.#events = [...events];
  }

  addEvent = (createdEvent) => {
    const index = this.#events.findIndex((event) => !isEventBeforeNextEvent(createdEvent, event));
    this.#events = index === -1
      ? [...this.#events, createdEvent]
      : [...this.#events.slice(0, index), createdEvent, ...this.#events.slice(index + 1)];
    this._notify();
  };

  updateEvent = (updatedEvent) => {
    const index = this.#events.findIndex((event) => event.id === updatedEvent.id);
    this.#events = index === -1
      ? this.#events
      : [...this.#events.slice(0, index), updatedEvent, ...this.#events.slice(index + 1)];
    this._notify();
  };

  deleteEvent = (deletedEvent) => {
    this.#events = this.#events.filter((event) => event.id !== deletedEvent.id);
    this._notify();
  };
}

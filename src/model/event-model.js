import Observable from '../framework/observable';

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

  updateEvent = (updatedEvent) => {
    const index = this.#events.findIndex((event) => event.id === updatedEvent.id);
    this.#events = index === -1 ? this.#events : [...this.#events.slice(0, index), updatedEvent, ...this.#events.slice(index + 1)];
  };

}

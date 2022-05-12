export default class EventModel {
  #events;
  constructor(events) {
    this.#events = events;
  }

  get events () {
    return this.#events;
  }
}

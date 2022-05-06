export default class EventModel {
  constructor(events) {
    this.events = events;
  }

  getEvents = () => this.events;
}

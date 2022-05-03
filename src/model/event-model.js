import { getEvents } from '../mock/event';

export default class EventModel {
  constructor(eventQty) {
    this.eventQty = eventQty;
    this.events = getEvents(this.eventQty);
  }


  getEvents = () => this.events;
}

import Destination from '../view/destination-view';
import EditEventForm from '../view/edit-event-form-view';
import EventItem from '../view/event-item-view';
import NewEventForm from '../view/new-event-form-view';
import EventSortForm from '../view/sort-view';
import EventList from '../view/event-list-view';
import Offers from '../view/offers-view';
import { render } from '../render';

export default class TripMapPresenter {
  init = (mapContainer, eventModel) => {
    this.mapContainer = mapContainer;
    this.eventList = new EventList();
    this.newEventForm = new NewEventForm();
    this.editEventForm = new EditEventForm();

    render(new EventSortForm(), this.mapContainer);
    render(this.eventList, this.mapContainer);
    render(this.newEventForm, this.eventList.getElement());
    render(new Offers(), this.newEventForm.getElement().querySelector('.event__details'));
    render(new Destination(), this.newEventForm.getElement().querySelector('.event__details'));
    (eventModel.getEvents()).forEach((event) => (render(new EventItem(event), this.eventList.getElement())));
    // (eventModel.getEvents()).forEach((event) => (console.log(event)));
    // Array.from({ length: 3 }, () => new EventItem()).forEach((component) => render(component, this.eventList.getElement()));
    render(this.editEventForm, this.eventList.getElement());
    render(new Offers(), this.editEventForm.getElement().querySelector('.event__details'));
    render(new Destination(), this.editEventForm.getElement().querySelector('.event__details'));
  };
}

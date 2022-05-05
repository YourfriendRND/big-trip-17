import Destination from '../view/destination-view';
import EditEventForm from '../view/edit-event-form-view';
import EventItem from '../view/event-item-view';
import NewEventForm from '../view/new-event-form-view';
import EventSortForm from '../view/sort-view';
import EventList from '../view/event-list-view';
import Offers from '../view/offers-view';
import { render } from '../render';

export default class TripMapPresenter {
  init = (mapContainer, eventModel, destinationModel, offerModel) => {
    this.mapContainer = mapContainer;
    this.eventList = new EventList();
    this.offers = offerModel.getOffers();
    this.events = eventModel.getEvents();
    this.newEventForm = new NewEventForm(this.events[0]);
    this.destinations = destinationModel.getDestinations();
    render(new EventSortForm(), this.mapContainer);
    render(this.eventList, this.mapContainer);
    render(this.newEventForm, this.eventList.getElement());
    render(new Offers(this.offers, this.events[0]), this.newEventForm.getElement().querySelector('.event__details'));
    render(new Destination(this.destinations.find((city) => city.name === this.events[0].destination)), this.newEventForm.getElement().querySelector('.event__details'));
    this.events.forEach((eventRow, index, array) => {
      // Первая точка для формы создания, последняя точка будет открыта в форме редактирования
      if (index > 0 && index !== array.length - 1) {
        const event = {
          ...eventRow,
          offers: eventRow.offers.map((id) => {
            const sameOfferType = this.offers.find((offerType) => offerType.type === eventRow.type);
            return sameOfferType.offers.find((offer) => offer.id === id);
          })
        };
        render(new EventItem(event), this.eventList.getElement());
      }
    });
    const lastEvent = this.events[this.events.length - 1];
    this.editEventForm = new EditEventForm(lastEvent);
    render(this.editEventForm, this.eventList.getElement());
    render(new Offers(this.offers, lastEvent), this.editEventForm.getElement().querySelector('.event__details'));
    render(new Destination(this.destinations.find((city) => city.name === lastEvent.destination)), this.editEventForm.getElement().querySelector('.event__details'));
  };
}

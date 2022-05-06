import DestinationView from '../view/destination-view';
import EditEventFormView from '../view/edit-event-form-view';
import EventItemView from '../view/event-item-view';
import NewEventFormView from '../view/new-event-form-view';
import EventSortFormView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import OffersView from '../view/offers-view';
import { render } from '../render';

export default class TripMapPresenter {
  init = (mapContainer, eventModel, destinationModel, offerModel) => {
    this.mapContainer = mapContainer;
    this.eventList = new EventListView();
    this.offers = offerModel.getOffers();
    this.events = eventModel.getEvents();
    this.destinations = destinationModel.getDestinations();
    this.newEventForm = new NewEventFormView(this.destinations);
    render(new EventSortFormView(), this.mapContainer);
    render(this.eventList, this.mapContainer);
    render(this.newEventForm, this.eventList.getElement());
    render(new OffersView(this.offers), this.newEventForm.getElement().querySelector('.event__details'));
    render(new DestinationView(), this.newEventForm.getElement().querySelector('.event__details'));
    this.events.slice(0, 1).forEach(this.renderEvent);
    const lastEvent = this.events[1];
    this.editEventForm = new EditEventFormView(lastEvent, this.destinations);
    render(this.editEventForm, this.eventList.getElement());
    render(new OffersView(this.offers, lastEvent), this.editEventForm.getElement().querySelector('.event__details'));
    render(new DestinationView(this.destinations.find((city) => city.name === lastEvent.destination)), this.editEventForm.getElement().querySelector('.event__details'));
    this.events.slice(2).forEach(this.renderEvent);
  };

  renderEvent = (eventRow) => {
    const event = {
      ...eventRow,
      offers: eventRow.offers.map((id) => {
        const sameOfferType = this.offers.find((offerType) => offerType.type === eventRow.type);
        return sameOfferType.offers.find((offer) => offer.id === id);
      })
    };
    render(new EventItemView(event), this.eventList.getElement());
  };
}

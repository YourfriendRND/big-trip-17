import DestinationView from '../view/destination-view';
import EditEventFormView from '../view/edit-event-form-view';
import EventItemView from '../view/event-item-view';
import EventSortFormView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import OffersView from '../view/offers-view';
import EmptyListView from '../view/empty-list-view';
import { render, replace } from '../framework/render';

export default class TripMapPresenter {
  #mapContainer = null;
  #eventModel = null;
  #destinationModel = null;
  #offerModel = null;
  #offers = [];
  #events = [];
  #destinations = [];
  #eventList = new EventListView();
  #eventSortForm = new EventSortFormView();

  constructor(mapContainer, eventModel, destinationModel, offerModel) {
    this.#mapContainer = mapContainer;
    this.#eventModel = eventModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
  }

  init = () => {
    this.#events = [...this.#eventModel.events];
    this.#destinations = [...this.#destinationModel.destinations];
    this.#offers = [...this.#offerModel.offers];

    if (!this.#events.length) {
      render(new EmptyListView(), this.#mapContainer);
      return;
    }

    render(this.#eventSortForm, this.#mapContainer);
    render(this.#eventList, this.#mapContainer);
    this.#events.forEach(this.#renderEvent);
  };

  #prepareEvent = (eventRow) => ({
    ...eventRow,
    offers: eventRow.offers.map((id) => {
      const sameOfferType = this.#offers.find((offerType) => offerType.type === eventRow.type);
      return sameOfferType.offers.find((offer) => offer.id === id);
    })
  });

  #renderEvent = (eventRow) => {
    const event = this.#prepareEvent(eventRow);
    const eventItemViewComponent = new EventItemView(event);
    const editEventFormComponent = new EditEventFormView(event, this.#destinations);
    const eventOffersComponent = new OffersView(this.#offers, event);
    const eventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === event.destination));

    const replaceEventItemToForm = () => {
      replace(editEventFormComponent, eventItemViewComponent);
      render(eventOffersComponent, editEventFormComponent.element.querySelector('.event__details'));
      render(eventDestinationDetailsComponent, editEventFormComponent.element.querySelector('.event__details'));
    };

    const replaceFormToEventItem = () => {
      replace(eventItemViewComponent, editEventFormComponent);
    };

    const onEcsKeyDown = (evt) => {
      if (evt.key === 'Esc' || evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToEventItem();
        document.removeEventListener('keydown', onEcsKeyDown);
      }
    };
    eventItemViewComponent.setEditClickHandler(() => {
      replaceEventItemToForm();
      document.addEventListener('keydown', onEcsKeyDown);
    });

    editEventFormComponent.setEditSubmitHandler(() => {
      replaceFormToEventItem();
      document.removeEventListener('keydown', onEcsKeyDown);
    });

    editEventFormComponent.setCloseEditClickHandler(() => {
      replaceFormToEventItem();
      document.removeEventListener('keydown', onEcsKeyDown);
    });

    render(eventItemViewComponent, this.#eventList.element);
  };
}

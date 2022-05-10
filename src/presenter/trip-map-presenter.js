import DestinationView from '../view/destination-view';
import EditEventFormView from '../view/edit-event-form-view';
import EventItemView from '../view/event-item-view';
import NewEventFormView from '../view/new-event-form-view';
import EventSortFormView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import OffersView from '../view/offers-view';
import { render } from '../render';

export default class TripMapPresenter {
  #mapContainer = null;
  #eventModel = null;
  #destinationModel = null;
  #offerModel = null;
  #newEventForm = null;

  #offers = [];
  #events = [];
  #destinations = [];

  #eventList = new EventListView();
  #eventSortForm = new EventSortFormView();

  init = (mapContainer, eventModel, destinationModel, offerModel) => {
    this.#mapContainer = mapContainer;
    this.#eventModel = eventModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;

    this.#events = [...eventModel.events];
    this.#destinations = [...destinationModel.destinations];
    this.#offers = [...offerModel.offers];

    this.#newEventForm = new NewEventFormView(this.#destinations);

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
      this.#eventList.element.replaceChild(editEventFormComponent.element, eventItemViewComponent.element);
      render(eventOffersComponent, editEventFormComponent.element.querySelector('.event__details'));
      render(eventDestinationDetailsComponent, editEventFormComponent.element.querySelector('.event__details'));
    };

    const replaceFormToEventItem = () => {
      this.#eventList.element.replaceChild(eventItemViewComponent.element, editEventFormComponent.element);
    };

    const onEcsKeyDown = (evt) => {
      if (evt.key === 'Esc' || evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToEventItem();
        document.removeEventListener('keydown', onEcsKeyDown);
      }
    };

    eventItemViewComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceEventItemToForm();
      document.addEventListener('keydown', onEcsKeyDown);
    });

    editEventFormComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToEventItem();
      document.removeEventListener('keydown', onEcsKeyDown);
    });

    editEventFormComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToEventItem();
      document.removeEventListener('keydown', onEcsKeyDown);
    });

    render(eventItemViewComponent, this.#eventList.element);
  };
}

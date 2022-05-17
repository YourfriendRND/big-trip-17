import EventSortFormView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import EmptyListView from '../view/empty-list-view';
import EventPresenter from './event-presenter';
import { render } from '../framework/render';

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
    const eventPresenter = new EventPresenter(event, this.#destinations, this.#offers, this.#eventList);
    eventPresenter.init();
  };
}

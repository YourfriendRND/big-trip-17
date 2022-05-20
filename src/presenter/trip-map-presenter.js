import EventSortFormView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import EmptyListView from '../view/empty-list-view';
import EventPresenter from './event-presenter';
import { render } from '../framework/render';
import { updateElement } from '../util';

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
  #eventPresenter = new Map();

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
    const eventPresenter = new EventPresenter(this.#eventList, this.#handleEventChange, this.#handleModeEventChange);
    eventPresenter.init(event, this.#destinations, this.#offers);
    this.#eventPresenter.set(event.id, eventPresenter);
  };

  #handleEventChange = (updatedEvent) => {
    this.#events = updateElement(this.#events, updatedEvent);
    this.#eventPresenter.get(updatedEvent.id).init(updatedEvent, this.#destinations, this.#offers);
  };

  #handleModeEventChange = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetDefaultView());
  };
}

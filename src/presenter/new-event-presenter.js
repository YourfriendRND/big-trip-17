import NewEventFormView from '../view/new-event-form-view';
import OffersView from '../view/offers-view';
import DestinationView from '../view/destination-view';
import { render, RenderPosition, remove } from '../framework/render';
import { UserAction } from '../project-constants';

export default class NewEventPresener {
  #newEventFormComponent = null;
  #eventList = null;
  #newEventOfferComponent = null;
  #newEventDestinationDetailsComponent = null;
  #destinations = [];
  #offers = [];
  #changeData = null;
  #newEventButton = null;

  constructor(changeHandler) {
    this.#changeData = changeHandler;
  }

  init = (eventListContainer, newEventButton, destinations, offers) => {
    this.#eventList = eventListContainer;
    this.#newEventButton = newEventButton;
    this.#destinations = [...destinations];
    this.#offers = [...offers];

    this.#newEventButton.disabled = true;
    this.#newEventFormComponent = new NewEventFormView(this.#destinations, this.#offers);
    render(this.#newEventFormComponent, this.#eventList.element, RenderPosition.AFTERBEGIN);
    this.#newEventOfferComponent = new OffersView(this.#offers);
    this.#newEventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === 'Geneva'));
    render(this.#newEventOfferComponent, this.#newEventFormComponent.element.querySelector('.event__details'));
    render(this.#newEventDestinationDetailsComponent, this.#newEventFormComponent.element.querySelector('.event__details'));

    this.#newEventFormComponent.setCancelClickHandler(this.destroy);
    this.#newEventFormComponent.setCloseEcsHandler(this.destroy);

    this.#newEventFormComponent.setChangeTypeEventHandler(this.#rerenderNewEventForm);

    this.#newEventFormComponent.setChangeDestinationHandler(this.#rerenderNewEventForm);

    this.#newEventFormComponent.setChangeDateTime(this.#rerenderNewEventForm);

    this.#newEventFormComponent.setChangePriceHandler(this.#rerenderNewEventForm);

    this.#newEventFormComponent.setSubmitEventClickHandler(this.#saveEvent);
  };

  #rerenderNewEventForm = (updatedEvent) => {
    this.#newEventOfferComponent = new OffersView(this.#offers, updatedEvent);
    this.#newEventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === updatedEvent.destination));
    render(this.#newEventOfferComponent, this.#newEventFormComponent.element.querySelector('.event__details'));
    render(this.#newEventDestinationDetailsComponent, this.#newEventFormComponent.element.querySelector('.event__details'));
  };

  #saveEvent = (createdEvent) => {
    createdEvent.offers = this.#newEventOfferComponent.getCheckedOffers();
    this.#changeData(UserAction.ADD_EVENT, createdEvent);
    this.destroy();
  };

  destroy = () => {
    remove(this.#newEventFormComponent);
    if (this.#newEventButton) {
      this.#newEventButton.disabled = false;
    }
  };

}

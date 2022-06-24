import NewEventFormView from '../view/new-event-form-view';
import EmptyListView from '../view/empty-list-view';
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
  #events = [];
  #changeData = null;
  #newEventButton = null;
  #getEmptyListMessage = null;
  #emptyListViewComponent = null;
  #getEscCloser = null;

  constructor(events, destinations, offers, eventListContainer, newEventButton, changeHandler, getMessage, getEscCloser) {
    this.#events = [...events];
    this.#destinations = [...destinations];
    this.#offers = [...offers];
    this.#changeData = changeHandler;
    this.#eventList = eventListContainer;
    this.#newEventButton = newEventButton;
    this.#getEmptyListMessage = getMessage;
    this.#getEscCloser = getEscCloser;
  }

  init = () => {
    this.#newEventButton.disabled = true;
    this.#newEventFormComponent = new NewEventFormView(this.#destinations, this.#offers, this.#getEscCloser);
    render(this.#newEventFormComponent, this.#eventList.element, RenderPosition.AFTERBEGIN);
    this.#newEventOfferComponent = new OffersView(this.#offers);
    this.#newEventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === 'Geneva'));
    render(this.#newEventOfferComponent, this.#newEventFormComponent.element.querySelector('.event__details'));
    render(this.#newEventDestinationDetailsComponent, this.#newEventFormComponent.element.querySelector('.event__details'));

    this.#newEventFormComponent.setCancelClickHandler(this.destroy);

    this.#newEventFormComponent.setCloseEcsHandler(this.destroy);

    this.#newEventFormComponent.setChangeTypeEventHandler(this.#rerenderNewEventForm);

    this.#newEventFormComponent.setChangeDestinationHandler(this.#rerenderDestinationBlock);

    this.#newEventFormComponent.setChangePriceHandler();

    this.#newEventFormComponent.setSubmitEventClickHandler(this.#saveEvent);
  };

  destroyEmptyView = () => {
    remove(this.#emptyListViewComponent);
  };

  setSaving = () => {
    const updatingEvent = this.#newEventFormComponent.getCurrentState();
    const offers = this.#newEventOfferComponent.getCheckedOffers();
    this.#newEventFormComponent.updateElement({
      ...updatingEvent,
      offers: offers,
      isDisabled: true,
      isSaving: true
    });
    this.#rerenderNewEventForm(updatingEvent, true);
  };

  setAborting = () => {
    const resetNewFormState = () => {
      const updatingEvent = this.#newEventFormComponent.getCurrentState();
      this.#newEventFormComponent.updateElement({
        ...updatingEvent,
        isDisabled: false,
        isSaving: false
      });
      this.#rerenderNewEventForm(updatingEvent);
    };

    this.#newEventFormComponent.shake(resetNewFormState);
  };

  destroy = () => {
    remove(this.#newEventFormComponent);
    if (this.#newEventButton) {
      this.#newEventButton.disabled = false;
    }
    if (!this.#events.length) {
      this.#emptyListViewComponent = new EmptyListView(this.#getEmptyListMessage());
      render(this.#emptyListViewComponent, this.#eventList.element);
    }
  };

  #rerenderNewEventForm = (updatedEvent, offerDisabled = false) => {
    this.#newEventOfferComponent = new OffersView(this.#offers, updatedEvent, offerDisabled);
    this.#newEventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === updatedEvent.destination));
    render(this.#newEventOfferComponent, this.#newEventFormComponent.element.querySelector('.event__details'));
    render(this.#newEventDestinationDetailsComponent, this.#newEventFormComponent.element.querySelector('.event__details'));
  };

  #rerenderDestinationBlock = (updatedEvent) => {
    remove(this.#newEventDestinationDetailsComponent);
    this.#newEventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === updatedEvent.destination));
    render(this.#newEventDestinationDetailsComponent, this.#newEventFormComponent.element.querySelector('.event__details'));
  };

  #saveEvent = (createdEvent) => {
    createdEvent.offers = this.#newEventOfferComponent.getCheckedOffers();
    this.#changeData(UserAction.ADD_EVENT, createdEvent);
  };
}

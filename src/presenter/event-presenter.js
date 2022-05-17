import EventItemView from '../view/event-item-view';
import EditEventFormView from '../view/edit-event-form-view';
import OffersView from '../view/offers-view';
import DestinationView from '../view/destination-view';
import { render, replace } from '../framework/render';

export default class EventPresenter {
  #event = null;
  #eventViewComponent = null;
  #editEventFormComponent = null;
  #eventOffersComponent = null;
  #eventDestinationDetailsComponent = null;
  #eventListContainer = null;

  #destinations = [];
  #offers = [];

  constructor(event, destinations, offers, eventListContainer) {
    this.#event = {...event};
    this.#destinations = [...destinations];
    this.#offers = [...offers];
    this.#eventListContainer = eventListContainer;
  }

  init = () => {
    this.#eventViewComponent = new EventItemView(this.#event);
    this.#editEventFormComponent = new EditEventFormView(this.#event, this.#destinations);
    this.#eventOffersComponent = new OffersView(this.#offers, this.#event);
    this.#eventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === this.#event.destination));

    this.#eventViewComponent.setEditClickHandler(() => {
      this.#replaceEventItemToForm();
      document.addEventListener('keydown', this.#onEcsKeyDown);
    });

    // Обработчик клика Favorite
    this.#eventViewComponent.setFavoriteClickHandler(() => {});

    this.#editEventFormComponent.setEditSubmitHandler(() => {
      this.#replaceFormToEventItem();
      document.removeEventListener('keydown', this.#onEcsKeyDown);
    });

    this.#editEventFormComponent.setCloseEditClickHandler(() => {
      this.#replaceFormToEventItem();
      document.removeEventListener('keydown', this.#onEcsKeyDown);
    });

    render(this.#eventViewComponent, this.#eventListContainer.element);
  };


  #replaceEventItemToForm = () => {
    replace(this.#editEventFormComponent, this.#eventViewComponent);
    render(this.#eventOffersComponent, this.#editEventFormComponent.element.querySelector('.event__details'));
    render(this.#eventDestinationDetailsComponent, this.#editEventFormComponent.element.querySelector('.event__details'));
  };

  #replaceFormToEventItem = () => {
    replace(this.#eventViewComponent, this.#editEventFormComponent);
  };

  #onEcsKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToEventItem();
      document.removeEventListener('keydown', this.#onEcsKeyDown);
    }
  };
}

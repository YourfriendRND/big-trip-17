import EventItemView from '../view/event-item-view';
import EditEventFormView from '../view/edit-event-form-view';
import OffersView from '../view/offers-view';
import DestinationView from '../view/destination-view';
import { render, replace, remove } from '../framework/render';

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
    // Для переиспользования сохранил предыдущие версии компонентов
    const prevComponentVersions = {
      event: this.#eventViewComponent,
      editForm: this.#editEventFormComponent,
      offers: this.#eventOffersComponent,
      destinations: this.#eventDestinationDetailsComponent
    }

    this.#eventViewComponent = new EventItemView(this.#event);
    this.#editEventFormComponent = new EditEventFormView(this.#event, this.#destinations);
    this.#eventOffersComponent = new OffersView(this.#offers, this.#event);
    this.#eventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === this.#event.destination));

    this.#eventViewComponent.setEditClickHandler(() => {
      this.#replaceEventItemToForm();
      document.addEventListener('keydown', this.#onEcsKeyDown);
    });

    // Обработчик клика Favorite
    this.#eventViewComponent.setFavoriteClickHandler(() => {
      console.log("click");
    });

    this.#editEventFormComponent.setEditSubmitHandler(() => {
      this.#replaceFormToEventItem();
      document.removeEventListener('keydown', this.#onEcsKeyDown);
    });

    this.#editEventFormComponent.setCloseEditClickHandler(() => {
      this.#replaceFormToEventItem();
      document.removeEventListener('keydown', this.#onEcsKeyDown);
    });

    if (Object.values(prevComponentVersions).every((component) => !component)) {
      render(this.#eventViewComponent, this.#eventListContainer.element);
      return;
    };

    Object.keys(prevComponentVersions).forEach((componentName) => {
      if (this.#eventListContainer.element.contains(prevComponentVersions[componentName].element)) {
        switch(componentName) {
          case "event": replace(this.#eventViewComponent, prevComponentVersions[componentName]); break;
          case "editForm": replace(this.#editEventFormComponent, prevComponentVersions[componentName]); break;
          case "offers": replace(this.#eventOffersComponent, prevComponentVersions[componentName]); break;
          case "destinations": replace(this.#eventDestinationDetailsComponent, prevComponentVersions[componentName]); break;
        }
      }
    });

    Object.keys(prevComponentVersions).forEach((componentName) => {
      remove(prevComponentVersions[componentName]);
    });
  };

  destroy = () => {
    remove(this.#eventViewComponent);
    remove(this.#editEventFormComponent);
    remove(this.#eventOffersComponent);
    remove(this.#eventDestinationDetailsComponent);
  };

  #tickAsFavoriteEvent = () => {
    this.#eventViewComponent
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

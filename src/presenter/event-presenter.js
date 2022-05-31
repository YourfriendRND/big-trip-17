import EventItemView from '../view/event-item-view';
import EditEventFormView from '../view/edit-event-form-view';
import OffersView from '../view/offers-view';
import DestinationView from '../view/destination-view';
import { render, replace, remove } from '../framework/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #event = null;
  #eventViewComponent = null;
  #editEventFormComponent = null;
  #eventOffersComponent = null;
  #eventDestinationDetailsComponent = null;
  #eventListContainer = null;
  #changeData = null;
  #changeMode = null;

  #destinations = [];
  #offers = [];
  #mode = Mode.DEFAULT;

  constructor(eventListContainer, changeData, changeMode) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (event, destinations, offers) => {
    this.#event = {...event};
    this.#destinations = [...destinations];
    this.#offers = [...offers];

    // Для переиспользования сохранил предыдущие версии компонентов
    const prevComponentVersions = {
      event: this.#eventViewComponent,
      editForm: this.#editEventFormComponent,
      offers: this.#eventOffersComponent,
      destinations: this.#eventDestinationDetailsComponent
    };

    this.#eventViewComponent = new EventItemView(this.#event);
    this.#editEventFormComponent = new EditEventFormView(this.#event, this.#destinations);
    this.#eventOffersComponent = new OffersView(this.#offers, this.#event);
    this.#eventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === this.#event.destination));

    this.#eventViewComponent.setEditClickHandler(() => {
      this.#replaceEventItemToForm();
      document.addEventListener('keydown', this.#onEcsKeyDown);
    });

    //Обработчик смены типа точки маршрута
    this.#editEventFormComponent.setChangeTypeEventHandler(this.#rerenderEditForm);

    //Обработчик смены точки назначения
    this.#editEventFormComponent.setChangeDestinationHandler(this.#rerenderEditForm);

    // Обработчик клика Favorite
    this.#eventViewComponent.setFavoriteClickHandler(this.#tickAsFavoriteEvent);

    this.#editEventFormComponent.setEditSubmitHandler((updatedEvent) => {
      this.#replaceFormToEventItem();
      this.#changeData(updatedEvent);
      document.removeEventListener('keydown', this.#onEcsKeyDown);
    });

    this.#editEventFormComponent.setCloseEditClickHandler(() => {
      this.#replaceFormToEventItem();
      document.removeEventListener('keydown', this.#onEcsKeyDown);
    });

    if (Object.values(prevComponentVersions).every((component) => !component)) {
      render(this.#eventViewComponent, this.#eventListContainer.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventViewComponent, prevComponentVersions.event);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editEventFormComponent, prevComponentVersions.editForm);
      replace(this.#eventOffersComponent, prevComponentVersions.offers);
      replace(this.#eventDestinationDetailsComponent, prevComponentVersions.destinations);
    }

    Object.keys(prevComponentVersions).forEach((componentName) => remove(prevComponentVersions[componentName]));
  };

  /**
   * Метод ререндерит форму редактирования в соответствии с обновлёнными данными точки маршрута
   * @param {Object} updatedEvent - объект с обновлёнными данными точки маршрута
   */
  #rerenderEditForm = (updatedEvent) => {
    this.#eventOffersComponent = new OffersView(this.#offers, updatedEvent);
    this.#eventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === updatedEvent.destination));
    render(this.#eventOffersComponent, this.#editEventFormComponent.element.querySelector('.event__details'));
    render(this.#eventDestinationDetailsComponent, this.#editEventFormComponent.element.querySelector('.event__details'));
  };

  destroy = () => {
    remove(this.#eventViewComponent);
    remove(this.#editEventFormComponent);
    remove(this.#eventOffersComponent);
    remove(this.#eventDestinationDetailsComponent);
  };

  resetDefaultView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToEventItem();
    }
  };

  #tickAsFavoriteEvent = () => {
    this.#changeData({...this.#event, isFavorite: !this.#event.isFavorite});
  };

  #replaceEventItemToForm = () => {
    replace(this.#editEventFormComponent, this.#eventViewComponent);
    render(this.#eventOffersComponent, this.#editEventFormComponent.element.querySelector('.event__details'));
    render(this.#eventDestinationDetailsComponent, this.#editEventFormComponent.element.querySelector('.event__details'));
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToEventItem = () => {
    replace(this.#eventViewComponent, this.#editEventFormComponent);
    this.#mode = Mode.DEFAULT;
  };

  #onEcsKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToEventItem();
      document.removeEventListener('keydown', this.#onEcsKeyDown);
    }
  };
}

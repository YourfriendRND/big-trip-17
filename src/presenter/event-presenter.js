import EventItemView from '../view/event-item-view';
import EditEventFormView from '../view/edit-event-form-view';
import OffersView from '../view/offers-view';
import DestinationView from '../view/destination-view';
import { render, replace, remove } from '../framework/render';
import { UserAction, Mode } from '../project-constants';

export default class EventPresenter {
  #event = null;
  #eventViewComponent = null;
  #editEventFormComponent = null;
  #eventOffersComponent = null;
  #eventDestinationDetailsComponent = null;
  #eventListContainer = null;
  #changeData = null;
  #changeMode = null;
  #getEscCloser = null;
  #onEcsKeyDown = null;

  #destinations = [];
  #offers = [];
  #mode = Mode.DEFAULT;

  constructor(eventListContainer, changeData, changeMode, getEscCloser) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#getEscCloser = getEscCloser;
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
    this.#editEventFormComponent = new EditEventFormView(this.#event, this.#destinations, this.#offers);
    this.#eventOffersComponent = new OffersView(this.#offers, this.#event);
    this.#eventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === this.#event.destination));
    this.#onEcsKeyDown = this.#getEscCloser([this.#resetEditFormView, this.#replaceFormToEventItem]);

    this.#eventViewComponent.setEditClickHandler(() => {
      this.#replaceEventItemToForm();
      document.addEventListener('keydown', this.#onEcsKeyDown);
    });

    //Обработчик смены типа точки маршрута
    this.#editEventFormComponent.setChangeTypeEventHandler(this.#rerenderEditForm);

    //Обработчик смены точки назначения
    this.#editEventFormComponent.setChangeDestinationHandler(this.#rerenderDistinationBlock);

    this.#editEventFormComponent.setChangePriceHandler();

    // Обработчик клика Favorite
    this.#eventViewComponent.setFavoriteClickHandler(this.#tickAsFavoriteEvent);

    // Обработчик кнопки save
    this.#editEventFormComponent.setEditSubmitHandler((updatedEvent) => {
      updatedEvent.offers = this.#eventOffersComponent.getCheckedOffers();
      this.#changeData(UserAction.UPDATE_EVENT, updatedEvent);
      document.removeEventListener('keydown', this.#onEcsKeyDown);
    });

    //Обработчик кнопки закрыть
    this.#editEventFormComponent.setCloseEditClickHandler(() => {
      this.#resetEditFormView();
      this.#replaceFormToEventItem();
      document.removeEventListener('keydown', this.#onEcsKeyDown);
    });

    // Обработчик кнопки удаления
    this.#editEventFormComponent.setDeleteEventClickHandler((deletedEvent) => {
      this.#changeData(UserAction.DELETE_EVENT, deletedEvent);
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

  destroy = () => {
    remove(this.#eventViewComponent);
    remove(this.#editEventFormComponent);
    remove(this.#eventOffersComponent);
    remove(this.#eventDestinationDetailsComponent);
  };

  resetDefaultView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#resetEditFormView();
      this.#replaceFormToEventItem();
    }
  };

  setSavingEditForm = () => {
    if (this.#mode === Mode.EDITING) {
      const updatingEvent = this.#editEventFormComponent.getCurrentState();

      this.#editEventFormComponent.updateElement({
        ...updatingEvent,
        isDisabled: true,
        isSaving: true
      });
      this.#rerenderEditForm(updatingEvent, true);
    }
  };

  setDelitingEditForm = () => {
    if (this.#mode === Mode.EDITING) {
      const updatingEvent = this.#editEventFormComponent.getCurrentState();

      this.#editEventFormComponent.updateElement({
        ...updatingEvent,
        isDisabled: true,
        isDeliting: true
      });
      this.#rerenderEditForm(updatingEvent, true);
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventViewComponent.shake();
      return;
    }
    const resetEditFormState = () => {
      const updatingEvent = this.#editEventFormComponent.getCurrentState();
      this.#editEventFormComponent.updateElement({
        ...updatingEvent,
        isDisabled: false,
        isDeliting: false,
        isSaving: false
      });
      this.#rerenderEditForm(updatingEvent);
    };

    this.#editEventFormComponent.shake(resetEditFormState);
  };

  /**
   * Метод ререндерит форму редактирования в соответствии с обновлёнными данными точки маршрута
   * @param {Object} updatedEvent - объект с обновлёнными данными точки маршрута
   */
  #rerenderEditForm = (updatedEvent, offerDisabled = false) => {
    this.#eventOffersComponent = new OffersView(this.#offers, updatedEvent, offerDisabled);
    this.#eventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === updatedEvent.destination));
    render(this.#eventOffersComponent, this.#editEventFormComponent.element.querySelector('.event__details'));
    render(this.#eventDestinationDetailsComponent, this.#editEventFormComponent.element.querySelector('.event__details'));
  };

  #rerenderDistinationBlock = (updatedEvent) => {
    remove(this.#eventDestinationDetailsComponent);
    const targetDestinationPlace = this.#destinations.find((city) => city.name === updatedEvent.destination);
    if (targetDestinationPlace) {
      this.#eventDestinationDetailsComponent = new DestinationView(this.#destinations.find((city) => city.name === updatedEvent.destination));
      render(this.#eventDestinationDetailsComponent, this.#editEventFormComponent.element.querySelector('.event__details'));
    }
  };

  /**
   * Метод возвращает форму редактирования в её исходное состояние;
   */
  #resetEditFormView = () => {
    this.#editEventFormComponent.reset(this.#event);
    this.#rerenderEditForm(this.#event);
  };

  #tickAsFavoriteEvent = () => {
    this.#changeData(UserAction.UPDATE_EVENT, {...this.#event, isFavorite: !this.#event.isFavorite});
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

}

import Observable from '../framework/observable';
import {isEventBeforeNextEvent, compareEventsByDay} from '../util';
import { UpdateType } from '../project-constants';

export default class EventModel extends Observable {
  #events;
  #eventsApi = null;
  constructor(api) {
    super();
    // this.#events = events;
    this.#eventsApi = api;
    this.#eventsApi.events.then((events) => {
      events.map((event) => this.#adaptToClient(event));
      //console.log(adaptedEvents);
    });
  }

  get events () {
    return this.#events;
  }

  #adaptToClient = (event) => {
    const adaptEvent = {
      ...event,
      basePrice: event['base_price'],
      dateFrom: event['date_from'],
      destination: event.destination.name,
      dateTo: event['date_to'],
      isFavorite: event['is_favorite'],
    };

    delete adaptEvent['base_price'];
    delete adaptEvent['date_from'];
    delete adaptEvent['date_to'];
    delete adaptEvent['is_favorite'];

    return adaptEvent;
  };

  /**
   * Добавляет точку маршрута в модель
   * @param {Object} createdEvent - Созданный объект с данными о новой точки маршрута
   */
  addPoint = (createdEvent) => {
    createdEvent.id = this.#events.length;
    const index = this.#events.findIndex((event) => isEventBeforeNextEvent(createdEvent, event));
    this.#events = index === -1
      ? [...this.#events, createdEvent]
      : [...this.#events.slice(0, index), createdEvent, ...this.#events.slice(index)];
    this._notify(UpdateType.FULL);
  };

  /**
   * Обновлет данные о точке маршрута в модели
   * @param {Object} updatedEvent - Объект с обновленными данными о точке маршрута
   */
  updatePoint = (updatedEvent) => {
    const index = this.#events.findIndex((event) => event.id === updatedEvent.id);
    this.#events = index === -1
      ? this.#events
      : [...this.#events.slice(0, index), updatedEvent, ...this.#events.slice(index + 1)].sort(compareEventsByDay); // Дополнительно нужно сортировать по дате в случае изменении даты
    this._notify(UpdateType.DEFAULT);
  };

  /**
   * Удаляет точку маршрута из модели
   * @param {Object} deletedEvent - Объект с данными точки маршрута, который необходимо удалить
   */
  deletePoint = (deletedEvent) => {
    this.#events = this.#events.filter((event) => event.id !== deletedEvent.id);
    if (!this.#events.length) {
      this._notify(UpdateType.FULL);
      return;
    }
    this._notify();
  };
}

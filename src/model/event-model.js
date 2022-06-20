import Observable from '../framework/observable';
import {isEventBeforeNextEvent} from '../util';
import { UpdateType, DownloadingStateType } from '../project-constants';

export default class EventModel extends Observable {
  #events = [];
  #eventsApi = null;
  constructor(api) {
    super();
    this.#eventsApi = api;
  }

  get events () {
    return this.#events;
  }

  init = async () => {
    try {
      const events = await this.#eventsApi.getEvents();
      this.#events = events.map(this.#adaptToClient);
    } catch (err) {
      this.#events = [];
    }
    this._notify(UpdateType.INIT, DownloadingStateType.EVENTS);
  };

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
  addEvent = async (createdEvent) => {
    try {
      const response = await this.#eventsApi.createEvent(createdEvent);
      const createdEventFromServer = this.#adaptToClient(response);
      const index = this.#events.findIndex((event) => isEventBeforeNextEvent(createdEvent, event));
      this.#events = index === -1
        ? [...this.#events, createdEventFromServer]
        : [...this.#events.slice(0, index), createdEventFromServer, ...this.#events.slice(index)];
      this._notify(UpdateType.FULL);
    } catch (err) {
      throw new Error('Can\'t create new event');
    }
  };

  /**
   * Обновлет данные о точке маршрута в модели
   * @param {Object} updatedEvent - Объект с обновленными данными о точке маршрута
   */
  updateEvent = async (updatedEvent) => {
    const index = this.#events.findIndex((event) => event.id === updatedEvent.id);
    try {
      const response = await this.#eventsApi.updateEvent(updatedEvent);
      const updatedEventFromServer = this.#adaptToClient(response);
      this.#events = index === -1
        ? this.#events
        : [...this.#events.slice(0, index), updatedEventFromServer, ...this.#events.slice(index + 1)];
      this._notify(UpdateType.DEFAULT);
    } catch (err) {
      throw new Error('Can\'t update event');
    }
  };

  /**
   * Удаляет точку маршрута из модели
   * @param {Object} deletedEvent - Объект с данными точки маршрута, который необходимо удалить
   */
  deleteEvent = async (deletedEvent) => {
    try {
      await this.#eventsApi.deleteEvent(deletedEvent);
      this.#events = this.#events.filter((event) => event.id !== deletedEvent.id);
      if (!this.#events.length) {
        this._notify(UpdateType.FULL);
        return;
      }
      this._notify();
    } catch (err) {
      throw new Error(`Can't delete event with id - ${deletedEvent.id}`);
    }
  };
}

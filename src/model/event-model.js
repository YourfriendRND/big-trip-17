import Observable from '../framework/observable';
import {isEventBeforeNextEvent} from '../util';
import { UpdateType } from '../project-constants';

export default class EventModel extends Observable {
  #events;
  constructor(events) {
    super();
    this.#events = events;
  }

  get events () {
    return this.#events;
  }

  /**
   * Добавляет точку маршрута в модель
   * @param {Object} createdEvent - Созданный объект с данными о новой точки маршрута
   */
  addEvent = (createdEvent) => {
    createdEvent.id = this.#events.length;
    const index = this.#events.findIndex((event) => isEventBeforeNextEvent(createdEvent, event));
    this.#events = index === -1
      ? [...this.#events, createdEvent]
      : [...this.#events.slice(0, index), createdEvent, ...this.#events.slice(index + 1)];
    this._notify(UpdateType.FULL);
  };

  /**
   * Обновлет данные о точке маршрута в модели
   * @param {Object} updatedEvent - Объект с обновленными данными о точке маршрута
   */
  updateEvent = (updatedEvent) => {
    const index = this.#events.findIndex((event) => event.id === updatedEvent.id);
    this.#events = index === -1
      ? this.#events
      : [...this.#events.slice(0, index), updatedEvent, ...this.#events.slice(index + 1)];
    this._notify(UpdateType.FULL);
  };

  /**
   * Удаляет точку маршрута из модели
   * @param {Object} deletedEvent - Объект с данными точки маршрута, который необходимо удалить
   */
  deleteEvent = (deletedEvent) => {
    this.#events = this.#events.filter((event) => event.id !== deletedEvent.id);
    if (!this.#events.length) {
      this._notify(UpdateType.FULL);
      return;
    }
    this._notify();
  };
}

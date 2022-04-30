import { createElement } from '../render';

const createEventListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class EventList {
  getTemplate() {
    return createEventListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

import AbstractView from '../framework/view/abstract-view';

const createEmptyListTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class EmptyListView extends AbstractView {
  #message = null;
  #setMessage = null;
  constructor(setMessage) {
    super();
    this.setMessage = setMessage;
    this.message = this.setMessage();
  }

  get template() {
    return createEmptyListTemplate(this.message);
  }

}

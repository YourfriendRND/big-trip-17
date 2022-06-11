import AbstractView from '../framework/view/abstract-view';
import { FilterType, EmptyListMessage } from '../project-constants';

const createEmptyListTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class EmptyListView extends AbstractView {
  #currentFilter = null;
  constructor(filter) {
    super();
    this.#currentFilter = filter;
  }

  get template() {
    return createEmptyListTemplate(this.#getMessage());
  }

  #getMessage = () => {
    switch(this.#currentFilter) {
      case FilterType.EVERYTHING: return EmptyListMessage.EVERYTHING;
      case FilterType.FUTURE: return EmptyListMessage.FUTURE;
      case FilterType.PAST: return EmptyListMessage.PAST;
      default: throw new Error('Unknown filter type');
    }
  };
}

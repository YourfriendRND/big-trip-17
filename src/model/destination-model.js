import Observable from '../framework/observable';
import { UpdateType, DownloadingStateType } from '../project-constants';
export default class DestinationModel extends Observable {
  #destinations = [];
  #eventsApi = null;

  constructor (api) {
    super();
    this.#eventsApi = api;
  }

  get destinations () {
    return this.#destinations;
  }

  init = async () => {
    try {
      this.#destinations = await this.#eventsApi.destinations;
    } catch (err) {
      this.#destinations = [];
    }
    this._notify(UpdateType.INIT, DownloadingStateType.DESTINATIONS);
  };
}

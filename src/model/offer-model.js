import Observable from '../framework/observable';
import { UpdateType, DownloadingStateType } from '../project-constants';

export default class OfferModel extends Observable {
  #offers = [];
  #eventsApi = null;
  constructor (api) {
    super();
    this.#eventsApi = api;
  }

  get offers () {
    return this.#offers;
  }

  init = async () => {
    try {
      this.#offers = await this.#eventsApi.offers;
    } catch (err) {
      this.offers = [];
    }
    this._notify(UpdateType.INIT, DownloadingStateType.OFFERS);
  };

}

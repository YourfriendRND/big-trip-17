export default class OfferModel {
  #offers;
  constructor (offers) {
    this.#offers = offers;
  }

  get offers () {
    return this.#offers;
  }

  set offers (offers) {
    this.#offers = offers;
  }
}

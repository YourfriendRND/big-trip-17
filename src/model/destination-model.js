export default class DestinationModel {
  #destinations;
  constructor (destinations) {
    this.#destinations = destinations;
  }

  get destinations () {
    return this.#destinations;
  }
}

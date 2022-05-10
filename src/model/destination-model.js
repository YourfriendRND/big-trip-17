export default class DestinationModel {
  #destinations;
  constructor (destinations) {
    // this.destinations = destinations;
    this.#destinations = destinations;
  }

  // getDestinations = () => this.destinations;

  get destinations () {
    return this.#destinations;
  }
}

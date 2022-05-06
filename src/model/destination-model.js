export default class DestinationModel {
  constructor (destinations) {
    this.destinations = destinations;
  }

  getDestinations = () => this.destinations;
}

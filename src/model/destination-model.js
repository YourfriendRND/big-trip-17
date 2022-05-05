import { getDestinationPoint } from '../mock/destination';

export default class DestinationModel {
  destination = getDestinationPoint();

  getDestinations = () => this.destination;
}

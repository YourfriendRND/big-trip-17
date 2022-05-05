import { generateOffers } from '../mock/offers';

export default class OfferModel {
  offers = generateOffers();

  getOffers = () => this.offers;
}

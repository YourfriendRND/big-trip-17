import { getRandomInt } from '../util';
import { OFFERS_TYPES, DESCRIPTIONS } from './constants';

const generateOffers = () => OFFERS_TYPES.map((type) => ({
  type,
  offers: Array.from({ length: 6 }, (element, index) => ({
    id: index + 1,
    title: DESCRIPTIONS[getRandomInt(0, DESCRIPTIONS.length - 1)],
    price: getRandomInt(15, 500)
  }))
}));

export default generateOffers();

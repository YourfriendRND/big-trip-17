import { getRandomInt } from '../util';
import { CITIES, DESCRIPTIONS } from '../project-constants';
/**
 * Функция возвращает объект с информацией о точке назначения:
 * Название, описание, фото
 * @returns
 */
const getDestinationPoint = () => CITIES.map((city) => ({
  name: city,
  description: Array.from({ length: 3 }, () => DESCRIPTIONS[getRandomInt(0, CITIES.length - 1)]).join(','),
  pictures: Array.from({ length: getRandomInt(1, 4) }, () => ({
    src: `http://picsum.photos/248/152?r=${getRandomInt(1, 100000)}`,
    description: DESCRIPTIONS[getRandomInt(0, DESCRIPTIONS.length - 1)]
  }))
}));

export default getDestinationPoint();

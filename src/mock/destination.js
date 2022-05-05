import { getRandomInt } from '../util';

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget,',
  'sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const CITIES = [
  'Chamonix',
  'Buenos Aires',
  'Tehran',
  'La Paz',
  'Rio de Janeiro',
  'Minsk',
  'Liverpool',
  'Kabul',
  'Miami',
  'Kingston',
  'Monaco',
  'Baku',
  'Mexico City',
  'Bern',
  'Zürich',
  'Rome',
  'Dubai',
  'Moscow'
];

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

export {
  getDestinationPoint
};

import { getRandomInt } from '../util';

// {
//   "description": "Chamonix, is a beautiful city, a true asian pearl, with crowded streets.",
//   "name": "Chamonix",
//   "pictures": [
//     {
//       "src": "http://picsum.photos/300/200?r=0.0762563005163317",
//       "description": "Chamonix parliament building"
//     }
//   ]
// }

const cities = [
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

const description = [
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


const getRandomPictures = () => {

};

const getDestinations = (eventQty) => Array.from({ length: eventQty }, () => {
  return {
    name: cities[getRandomInt(0, cities.length - 1)],
    description: Array.from({ length: 3 }, () => description[getRandomInt(0, cities.length - 1)]).join(','),
    pitures: [
      {
        src: "",
        description: ""
      }
    ]
  }
});

export {

}

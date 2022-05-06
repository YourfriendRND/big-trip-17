import { createElement } from '../render';

const createDestinationTemplate = ({ description, pictures }) => `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">
      ${description ? description : 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.'}
    </p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures
    ? pictures.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join('')
    : `<img class="event__photo" src="img/photos/1.jpg" alt="Event photo">
        <img class="event__photo" src="img/photos/2.jpg" alt="Event photo">
        <img class="event__photo" src="img/photos/3.jpg" alt="Event photo">
        <img class="event__photo" src="img/photos/4.jpg" alt="Event photo">
        <img class="event__photo" src="img/photos/5.jpg" alt="Event photo">`}
      </div>
    </div>
  </section>`;

export default class DestinationView {
  constructor(destination) {
    this.destination = destination ? destination : {};
  }

  getTemplate() {
    return createDestinationTemplate(this.destination);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

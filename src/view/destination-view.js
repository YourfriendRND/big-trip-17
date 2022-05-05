import { createElement } from '../render';

const createDestinationTemplate = ({name, description, pictures}) => `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${name} ${description}.</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`)}
      </div>
    </div>
  </section>`;

export default class Destination {
  constructor (destination) {
    this.destination = destination;
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

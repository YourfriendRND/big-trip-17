import ApiService from './framework/api-service';
import { RestApiMethods, ServerEndpoin } from './project-constants';
export default class EventApiService extends ApiService {

  getEvents = () => this._load({ url: ServerEndpoin.POINTS }).then(ApiService.parseResponse);

  getDestinations = () => this._load({url: ServerEndpoin.DESTINATIONS }).then(ApiService.parseResponse);

  getOffers = () => this._load({url: ServerEndpoin.OFFERS }).then(ApiService.parseResponse);

  updateEvent = async (event) => {
    const response = await this._load({
      url: `points/${event.id}`,
      method: RestApiMethods.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  createEvent = async (event) => {
    const response = await this._load({
      url: ServerEndpoin.POINTS,
      method: RestApiMethods.POST,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteEvent = async (event) => {
    const response = await this._load({
      url: `${ServerEndpoin.POINTS}/${event.id}`,
      method: RestApiMethods.DELETE,
    });
    return response;
  };

  #adaptToServer = (event) => {
    const adaptedEvent = {
      ...event,
      'base_price': event.basePrice,
      'date_from': event.dateFrom,
      'date_to': event.dateTo,
      'is_favorite': event.isFavorite,
    };
    delete adaptedEvent.basePrice;
    delete adaptedEvent.dateFrom;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  };
}

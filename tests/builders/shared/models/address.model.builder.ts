import { Address } from '@shared/domain/models';

export class AddressBuilder {
  #uid = 'any_uid';
  #street = 'any_street';
  #number = '123';
  #neighborhood = 'any_neigh';
  #city = 'any_city';
  #postCode = '11222333';
  #state = 'AN';
  #complement?: string;
  #latitude?: number;
  #longitude?: number;

  static init(): AddressBuilder {
    return new AddressBuilder();
  }

  builder(): Address {
    return {
      uid: this.#uid,
      street: this.#street,
      number: this.#number,
      complement: this.#complement,
      neighborhood: this.#neighborhood,
      city: this.#city,
      postCode: this.#postCode,
      state: this.#state,
      latitude: this.#latitude,
      longitude: this.#longitude,
    };
  }
}

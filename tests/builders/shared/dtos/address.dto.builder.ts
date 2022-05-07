import { AddressDTO } from '@shared/domain/dtos';

export class AddressDtoBuilder {
  #street = 'any_street';
  #number = '123';
  #neighborhood = 'any_neigh';
  #city = 'any_city';
  #postCode = '11222-333';
  #state = 'AN';
  #complement?: string;
  #latitude?: number;
  #longitude?: number;

  static init(): AddressDtoBuilder {
    return new AddressDtoBuilder();
  }

  invalidRequireds(): AddressDtoBuilder {
    this.#street = undefined as any;
    this.#number = undefined as any;
    this.#neighborhood = undefined as any;
    this.#city = undefined as any;
    this.#postCode = undefined as any;
    this.#state = undefined as any;
    return this;
  }

  builder(): AddressDTO {
    return {
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

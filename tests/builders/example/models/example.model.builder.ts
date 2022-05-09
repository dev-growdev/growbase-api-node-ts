import { Example } from '@example/domain/models';

export class ExampleBuilder {
  #uid = 'any_uid';
  #name = 'any_name';
  #description?: string;

  static init(): ExampleBuilder {
    return new ExampleBuilder();
  }

  withDescription(description: string): ExampleBuilder {
    this.#description = description;
    return this;
  }

  builder(): Example {
    return {
      uid: this.#uid,
      name: this.#name,
      description: this.#description,
    };
  }
}

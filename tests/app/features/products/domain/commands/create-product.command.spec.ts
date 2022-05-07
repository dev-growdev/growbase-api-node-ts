import { CreateProductCommand } from '@products/domain/commands';
import { ProductDtoBuilder } from '@builders/products';
import { AuthenticatedUserBuilder } from '@builders/shared';

describe('CreateProduct Command', () => {
  it('should be a valid command - only requireds', () => {
    const command = new CreateProductCommand(
      ProductDtoBuilder.init().builder(),
      AuthenticatedUserBuilder.init().builder(),
    );
    command.validate();

    expect(command.isValid).toBeTruthy();
  });

  it('should be a valid command - with price and description', () => {
    const command = new CreateProductCommand(
      ProductDtoBuilder.init().withPrice().withDescription().builder(),
      AuthenticatedUserBuilder.init().builder(),
    );

    command.validate();

    expect(command.isValid).toBeTruthy();
    expect(command.product.name).toBe('any_name');
    expect(command.product.description).toBe('any_description');
    expect(command.product.type).toBe('any_type');
    expect(command.product.price).toBe(1000);
    expect(command.authUser.uidUser).toBe('any_uid_user');
    expect(command.authUser.uidProfile).toBe('any_uid_profile');
  });

  it('should be a invalid command - only requireds', () => {
    const command = new CreateProductCommand(
      ProductDtoBuilder.init().invalidRequired().builder(),
      AuthenticatedUserBuilder.init().builder(),
    );

    command.validate();

    expect(command.isValid).toBeFalsy();
    expect(command.notifications).toHaveLength(3);
    expect(command.notifications).toEqual([
      { message: 'Este campo é obrigatório', property: 'name' },
      { message: 'Este campo é obrigatório', property: 'uidServiceProvider' },
      { message: 'Este campo é obrigatório', property: 'type' },
    ]);
  });
});

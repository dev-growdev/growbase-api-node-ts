import { Contract, Notification } from '@shared/notifications';
import { Command } from '@shared/domain/commands';
import { AuthenticatedUser } from '@shared/domain/models';
import { ProductDTO } from '../dtos';

export class CreateProductCommand extends Notification implements Command {
  authUser: AuthenticatedUser;
  product: ProductDTO;

  constructor(product: ProductDTO, authUser: AuthenticatedUser) {
    super();

    this.product = {
      name: product.name,
      uidServiceProvider: product.uidServiceProvider,
      description: product.description,
      type: product.type,
      price: product.price,
    };
    this.authUser = authUser;
  }

  validate(): void {
    this.addNotifications(
      new Contract()
        .isRequired(this.product.name, 'name')
        .isRequired(this.product.uidServiceProvider, 'uidServiceProvider')
        .isRequired(this.product.type, 'type'),
    );
  }
}

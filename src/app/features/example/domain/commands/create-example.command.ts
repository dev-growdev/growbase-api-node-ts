import { Command } from '@shared/domain/commands';
import { Contract, Notification } from '@shared/notifications';
import { ExampleDTO } from '../dtos';

export class CreateExampleCommand extends Notification implements Command {
  example: ExampleDTO;

  constructor(example: ExampleDTO) {
    super();
    this.example = {
      name: example.name,
      description: example.description,
    };
  }

  validate(): void {
    this.addNotifications(
      new Contract()
        .isRequired(this.example.name, 'name')
        .isMinLength(this.example.name, 3, 'name', 'Nome muito curto'),
    );
  }
}

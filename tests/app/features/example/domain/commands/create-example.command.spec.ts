import { ExampleDTOBuilder } from '@builders/example';
import { CreateExampleCommand } from '@example/domain/commands';

describe('CreateExample Command', () => {
  it('should be a valid command ', () => {
    const sut = new CreateExampleCommand(ExampleDTOBuilder.init().builder());

    sut.validate();

    expect(sut.isValid).toBeTruthy();
  });

  it('should be a invalid command ', () => {
    const sut = new CreateExampleCommand({ name: '', description: '' });

    sut.validate();

    expect(sut.isValid).toBeFalsy();
    expect(sut.notifications[0].property).toBe('name');
    expect(sut.notifications[0].message).toBe('Este campo é obrigatório');
    expect(sut.notifications[1].property).toBe('name');
    expect(sut.notifications[1].message).toBe('Nome muito curto');
  });
});

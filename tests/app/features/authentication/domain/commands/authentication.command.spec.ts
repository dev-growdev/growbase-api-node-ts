import { AuthenticationCommand } from '@authentication/domain/commands';

describe('Authentication Command', () => {
  it('should be a valid command', () => {
    const command = new AuthenticationCommand({
      login: 'any@login.com.br',
      password: 'any_password',
    });

    command.validate();

    expect(command.isValid).toBeTruthy();
  });

  it('should be a invalid command', () => {
    const command = new AuthenticationCommand({
      login: undefined as any,
      password: undefined as any,
    });

    command.validate();

    expect(command.isValid).toBeFalsy();
    expect(command.notifications).toHaveLength(3);
    expect(command.notifications).toEqual([
      { property: 'login', message: 'Este campo é obrigatório' },
      { property: 'login', message: 'E-mail inválido' },
      { property: 'password', message: 'Este campo é obrigatório' },
    ]);
  });

  it('should be a invalid command - only login', () => {
    const command = new AuthenticationCommand({
      login: 'any',
      password: 'any_password',
    });

    command.validate();

    expect(command.isValid).toBeFalsy();
    expect(command.notifications).toHaveLength(1);
    expect(command.notifications).toEqual([{ property: 'login', message: 'E-mail inválido' }]);
  });
});

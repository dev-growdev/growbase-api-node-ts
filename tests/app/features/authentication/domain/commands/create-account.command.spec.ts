import { CreateAccountCommand } from '@authentication/domain/commands';
import { AccountDtoBuilder } from '@builders/authentication';

describe('CreateAccount Command', () => {
  it('should be a valid command', () => {
    let command = new CreateAccountCommand(AccountDtoBuilder.init().builder());

    command.validate();

    expect(command.isValid).toBeTruthy();

    // verifica também o tratamento dos dados

    command = new CreateAccountCommand(
      AccountDtoBuilder.init().with({ document: '163.543.990-69' }).builder(),
    );

    command.validate();

    expect(command.isValid).toBeTruthy();
    expect(command.account.document).toBe('16354399069');
  });

  it('should be a invalid command', () => {
    const command = new CreateAccountCommand(AccountDtoBuilder.init().undefined().builder());

    command.validate();

    expect(command.isValid).toBeFalsy();
    expect(command.notifications).toHaveLength(8);
    expect(command.notifications).toEqual([
      { property: 'name', message: 'Este campo é obrigatório' },
      { property: 'email', message: 'Este campo é obrigatório' },
      { property: 'email', message: 'E-mail inválido' },
      { property: 'document', message: 'Este campo é obrigatório' },
      { property: 'document', message: 'Documento inválido' },
      { property: 'password', message: 'Este campo é obrigatório' },
      { property: 'password', message: 'Senha muito curta' },
      { property: 'companyName', message: 'Este campo é obrigatório' },
    ]);
  });
});

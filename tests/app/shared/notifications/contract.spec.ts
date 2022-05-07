import { Contract } from '@shared/notifications';

describe('Contract', () => {
  describe('isRequired', () => {
    it('should add a notification to the list', () => {
      const value = undefined;
      const contract = new Contract().isRequired(value, 'value');

      expect(contract.notifications).toHaveLength(1);
      expect(contract.notifications[0].message).toBe('Este campo é obrigatório');
      expect(contract.notifications[0].property).toBe('value');

      const contractWithMessage = new Contract().isRequired(value, 'value', 'TESTE_MENSAGEM');
      expect(contractWithMessage.notifications[0].message).toBe('TESTE_MENSAGEM');
    });

    it('should not add a notification to the list', () => {
      const value = 'Teste';
      const contract = new Contract().isRequired(value, 'value');

      expect(contract.notifications).toHaveLength(0);
    });
  });

  describe('isValidEmail', () => {
    it('should add a notification to the list', () => {
      const email = 'teste.com';
      const contract = new Contract().isValidEmail(email, 'email');
      expect(contract.notifications).toHaveLength(1);
      expect(contract.notifications[0].message).toBe('E-mail inválido');
      expect(contract.notifications[0].property).toBe('email');

      const contractWithMessage = new Contract().isValidEmail(email, 'email', 'TESTE_MENSAGEM');
      expect(contractWithMessage.notifications[0].message).toBe('TESTE_MENSAGEM');
    });

    it('should not add a notification to the list', () => {
      const email = 'teste@gmail.com';
      const contract = new Contract().isValidEmail(email, 'email');
      expect(contract.notifications).toHaveLength(0);
    });
  });

  describe('isValidCPFCNPJ', () => {
    it('should add a notification to the list', () => {
      const document = '12345678912';
      const contract = new Contract().isValidCPFCNPJ(document, 'document');
      expect(contract.notifications).toHaveLength(1);
      expect(contract.notifications[0].message).toBe('Documento inválido');
      expect(contract.notifications[0].property).toBe('document');

      const contractWithMessage = new Contract().isValidCPFCNPJ(
        document,
        'document',
        'TESTE_MENSAGEM',
      );
      expect(contractWithMessage.notifications[0].message).toBe('TESTE_MENSAGEM');
    });

    it('should not add a notification to the list', () => {
      const document = '72154632068';
      const contract = new Contract().isValidCPFCNPJ(document, 'document');
      expect(contract.notifications).toHaveLength(0);
    });
  });

  describe('isMinLength', () => {
    it('should add a notification to the list', () => {
      const text = 'teste';
      const contract = new Contract().isMinLength(text, 10, 'text', 'TEXTO_CURTO');

      expect(contract.notifications).toHaveLength(1);
      expect(contract.notifications[0].message).toBe('TEXTO_CURTO');
      expect(contract.notifications[0].property).toBe('text');

      const contractWithMessage = new Contract().isMinLength('', 10, 'text', 'SEM_VALOR');
      expect(contractWithMessage.notifications[0].message).toBe('SEM_VALOR');
    });

    it('should not add a notification to the list', () => {
      let text = 'Testando um texto com mais de 10 caracteres';
      let contract = new Contract().isMinLength(text, 10, 'text', 'TEXTO_CURTO');

      expect(contract.notifications).toHaveLength(0);

      text = '1234567890';
      contract = new Contract().isMinLength(text, 10, 'text', 'TEXTO_CURTO');

      expect(contract.notifications).toHaveLength(0);
    });
  });

  describe('isMaxLength', () => {
    it('should add a notification to the list', () => {
      const text = 'Testando um texto maior que 10';
      const contract = new Contract().isMaxLength(text, 10, 'text', 'TEXTO_LONGO');
      expect(contract.notifications).toHaveLength(1);
      expect(contract.notifications[0].message).toBe('TEXTO_LONGO');
      expect(contract.notifications[0].property).toBe('text');
    });

    it('should not add a notification to the list', () => {
      const text = 'Testando';
      const contract = new Contract().isMaxLength(text, 10, 'text', 'TEXTO_LONGO');
      expect(contract.notifications).toHaveLength(0);
    });
  });

  describe('isLengthEqual', () => {
    it('should add a notification to the list', () => {
      const text = 'Testando';
      const contract = new Contract().isLengthEqual(text, 5, 'text', 'VALOR_INVALIDO');

      expect(contract.notifications).toHaveLength(1);
      expect(contract.notifications[0].message).toBe('VALOR_INVALIDO');
      expect(contract.notifications[0].property).toBe('text');
    });

    it('should not add a notification to the list', () => {
      const text = 'Teste';
      const contract = new Contract().isLengthEqual(text, 5, 'texto', 'VALOR_INVALIDO');

      expect(contract.notifications).toHaveLength(0);
    });
  });

  describe('max', () => {
    it('should add a notification to the list', () => {
      const value = 10;
      const contract = new Contract().max(value, 5, 'value', 'VALOR_MUITO_ALTO');

      expect(contract.notifications).toHaveLength(1);
      expect(contract.notifications[0].message).toBe('VALOR_MUITO_ALTO');
      expect(contract.notifications[0].property).toBe('value');
    });

    it('should not add a notification to the list', () => {
      const value = 5;
      const contract = new Contract().max(value, 5, 'value', 'VALOR_MUITO_ALTO');

      expect(contract.notifications).toHaveLength(0);
    });
  });

  describe('min', () => {
    it('should add a notification to the list', () => {
      const value = 1;
      const contract = new Contract().min(value, 5, 'value', 'VALOR_MUITO_BAIXO');

      expect(contract.notifications).toHaveLength(1);
      expect(contract.notifications[0].message).toBe('VALOR_MUITO_BAIXO');
      expect(contract.notifications[0].property).toBe('value');
    });

    it('should not add a notification to the list', () => {
      const value = 6;
      const contract = new Contract().min(value, 5, 'value', 'VALOR_MUITO_BAIXO');

      expect(contract.notifications).toHaveLength(0);
    });
  });

  describe('custom', () => {
    it('should add a notification to the list', () => {
      const value = 3;
      const contract = new Contract().custom(() => value > 5, 'value');

      expect(contract.notifications).toHaveLength(1);
      expect(contract.notifications[0].message).toBe('Valor inválido');
      expect(contract.notifications[0].property).toBe('value');

      const contractWithMessage = new Contract().custom(() => value > 5, 'value', 'TESTE_MENSAGEM');
      expect(contractWithMessage.notifications[0].message).toBe('TESTE_MENSAGEM');
    });

    it('should not add a notification to the list', () => {
      const value = 6;
      const contract = new Contract().custom(() => value > 5, 'value', 'VALOR_INVALIDO');

      expect(contract.notifications).toHaveLength(0);
    });
  });
});

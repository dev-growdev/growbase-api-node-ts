import { isValidEmail } from '@shared/validators';

describe('Email Validator', () => {
  it('should return false', () => {
    let invalid = isValidEmail('13');
    expect(invalid).toBeFalsy();

    invalid = isValidEmail('email.com.br');
    expect(invalid).toBeFalsy();
  });

  it('should return true', () => {
    let valid = isValidEmail('email@teste.com.br');
    expect(valid).toBeTruthy();

    valid = isValidEmail('email@teste.com');
    expect(valid).toBeTruthy();
  });
});

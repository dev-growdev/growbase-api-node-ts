import { isValidDocument } from '@shared/validators';

describe('CPF CNPJ Validator', () => {
  it('should return false', () => {
    let result = isValidDocument('');
    expect(result).toBeFalsy();

    result = isValidDocument('21');
    expect(result).toBeFalsy();

    result = isValidDocument('12341232144');
    expect(result).toBeFalsy();

    result = isValidDocument('00000000000');
    expect(result).toBeFalsy();

    result = isValidDocument('12-341232144');
    expect(result).toBeFalsy();

    result = isValidDocument('815.675.440-96');
    expect(result).toBeFalsy();

    result = isValidDocument('123412321445124123');
    expect(result).toBeFalsy();

    result = isValidDocument('11111111111111');
    expect(result).toBeFalsy();

    result = isValidDocument('aaaaaaaaaaaaaa');
    expect(result).toBeFalsy();

    result = isValidDocument('89.756.198/0001-41');
    expect(result).toBeFalsy();
  });

  it('should return true', () => {
    let result = isValidDocument('59673839050');
    expect(result).toBeTruthy();

    result = isValidDocument('08754040060');
    expect(result).toBeTruthy();

    result = isValidDocument('51846950000172');
    expect(result).toBeTruthy();

    result = isValidDocument('31396355000175');
    expect(result).toBeTruthy();
  });
});

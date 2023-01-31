import { JwtAdapter } from '@shared/adapters';

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('jest', '5d');
};

describe('JwtAdapter Adapter', () => {
  it('should encrypt and decrypt a data', async () => {
    const sut = makeSut();
    const object = {
      uid: 'any_uid',
      name: 'any_name',
    };
    const token = await sut.encrypt(object);
    const objectDecrypted = await sut.decrypt(token);
    expect(token).toBeTruthy();
    expect(objectDecrypted.name).toBe('any_name');
    expect(objectDecrypted.uid).toBe('any_uid');
    expect(objectDecrypted.exp).toBeTruthy();
    expect(objectDecrypted.iat).toBeTruthy();
  });
});

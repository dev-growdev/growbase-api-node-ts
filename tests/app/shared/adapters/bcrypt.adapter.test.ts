import { BcryptAdapter } from '@shared/adapters';

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(12);
};

describe('BCrypt Adapter', () => {
  it('should create and compare a hash', async () => {
    const sut = makeSut();
    const hash = await sut.hash('texto puro');
    const isSame = await sut.compare('texto puro', hash);
    expect(isSame).toBeTruthy();
  });
});

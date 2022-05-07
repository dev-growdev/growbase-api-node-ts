import { HashCompareAdapter, HasherAdapter } from '@shared/adapters';
import { BcryptAdapter } from '@shared/infra/adapters';

const makeSut = (): HasherAdapter & HashCompareAdapter => {
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

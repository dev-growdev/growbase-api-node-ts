import '@shared/utils/extension-methods';

describe('Extenstion Methods', () => {
  it('removeSpecialCharacters', () => {
    expect('123.123.123-12'.removeSpecialCharacters()).toBe('12312312312');
  });
});

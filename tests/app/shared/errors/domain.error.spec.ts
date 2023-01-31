import { AppError } from '@shared/errors';

describe('Domain Error', () => {
  it('should be a valid error', () => {
    const domainError = new AppError('any_message');
    expect(domainError.name).toBe('AppError');
    expect(domainError.message).toBe('any_message');
  });
});

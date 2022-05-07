import { DomainError } from '@shared/domain/errors';

describe('Domain Error', () => {
  it('should be a valid error', () => {
    const domainError = new DomainError('any_message');
    expect(domainError.name).toBe('DomainError');
    expect(domainError.message).toBe('any_message');
  });
});

import { ApplicationError } from '@shared/utils';

describe('ApplicationError Model', () => {
  it('should be a valid model', () => {
    const applicationError = new ApplicationError('any', 'any_message', [
      { name: 'any_name', description: 'any_description' },
    ]);
    expect(applicationError.process).toBe('any');
    expect(applicationError.message).toBe('any_message');
    expect(applicationError.details).toEqual([
      { name: 'any_name', description: 'any_description' },
    ]);
  });
});

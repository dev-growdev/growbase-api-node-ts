import { base64 } from '@shared/utils';

describe('Encode and Decode Base64', () => {
  it('should encode and decode a string and be the same value after decoding', () => {
    const str = 'Esta é uma frase';
    const strEncode = base64.encode(str);
    const strDecoce = base64.decode(strEncode);
    expect(strDecoce).toBe(str);
  });
});

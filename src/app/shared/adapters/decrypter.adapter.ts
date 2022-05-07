export interface DecrypterAdapter {
  decrypt(cipherText: string): Promise<any>;
}

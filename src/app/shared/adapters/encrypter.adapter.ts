export interface EncrypterAdapter {
  encrypt(data: any): Promise<string>;
}

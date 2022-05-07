export interface HasherAdapter {
  hash(plainText: string): Promise<string>;
}

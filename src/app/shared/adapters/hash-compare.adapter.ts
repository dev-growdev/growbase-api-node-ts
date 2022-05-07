export interface HashCompareAdapter {
  compare(plainText: string, hashToCompare: string): Promise<boolean>;
}

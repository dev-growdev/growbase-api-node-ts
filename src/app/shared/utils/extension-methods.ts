// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface String {
  removeSpecialCharacters(): string;
}

String.prototype.removeSpecialCharacters = function (): string {
  return this.replace(/\W/g, '');
};

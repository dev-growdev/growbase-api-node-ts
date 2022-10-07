import { Contract, Notification } from '@shared/notifications';
import '@shared/utils/extension-methods';

export class CpfCnpjDTO extends Notification {
  #document: string;
  get value(): string {
    return this.#document;
  }

  constructor(document: string) {
    super();

    const docWithMask = document.removeSpecialCharacters();

    this.addNotifications(
      new Contract()
        .isRequired(docWithMask, 'Documento')
        .isValidCPFCNPJ(docWithMask.removeSpecialCharacters(), 'Documento'),
    );

    this.#document = docWithMask;
  }
}

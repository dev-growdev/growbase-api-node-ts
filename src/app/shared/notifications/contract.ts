import { NotificationDTO } from '.';
import { isValidEmail, isValidDocument } from '@shared/validators';

export class Contract {
  #notifications: NotificationDTO[] = [];

  public get notifications(): NotificationDTO[] {
    return [...this.#notifications];
  }

  public isRequired(value: any, property: string, message?: string): Contract {
    if (!value) {
      this.#notifications.push({
        property,
        message: message ?? 'Este campo é obrigatório',
      });
    }
    return this;
  }

  public isValidEmail(email: string, property: string, message?: string): Contract {
    if (!isValidEmail(email)) {
      this.#notifications.push({
        property,
        message: message ?? 'E-mail inválido',
      });
    }
    return this;
  }

  public isValidCPFCNPJ(document: string, property: string, message?: string): Contract {
    if (!isValidDocument(document)) {
      this.#notifications.push({
        property,
        message: message ?? 'Documento inválido',
      });
    }
    return this;
  }

  public isMinLength(value: string, length: number, property: string, message: string): Contract {
    if (!value || value.length < length) {
      this.#notifications.push({ property, message });
    }
    return this;
  }

  public isMaxLength(value: string, length: number, property: string, message: string): Contract {
    if (value && value.length > length) {
      this.#notifications.push({ property, message });
    }
    return this;
  }

  public isLengthEqual(value: string, length: number, property: string, message: string): Contract {
    if (!value || value.length !== length) {
      this.#notifications.push({ property, message });
    }
    return this;
  }

  public max(value: number, max: number, property: string, message: string): Contract {
    if (value > max) {
      this.#notifications.push({ property, message });
    }
    return this;
  }

  public min(value: number, min: number, property: string, message: string): Contract {
    if (value < min) {
      this.#notifications.push({ property, message });
    }
    return this;
  }

  public custom(rule: () => boolean, property: string, message?: string): Contract {
    if (!rule()) {
      this.#notifications.push({
        property,
        message: message ?? 'Valor inválido',
      });
    }
    return this;
  }
}

import { Contract } from '.';

export interface NotificationDTO {
  property: string;
  message: string;
}

export abstract class Notification {
  #notifications: NotificationDTO[] = [];

  public get notifications(): NotificationDTO[] {
    return [...this.#notifications];
  }

  public get isValid(): boolean {
    return this.#notifications.length === 0;
  }

  public addNotification(property: string, message: string): void {
    this.#notifications.push({ property, message });
  }

  public addNotifications(contract: Contract): void {
    this.#notifications.push(...contract.notifications);
  }
}

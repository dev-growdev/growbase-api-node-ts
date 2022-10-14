import { Contract } from '.';

export interface NotificationDTO {
  property: string;
  message: string;
}

export class Notification {
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

  public addNotifications(contract: Contract): void;
  public addNotifications(notifications: NotificationDTO[]): void;
  public addNotifications(parameter: any): void {
    if (parameter instanceof Contract) {
      this.#notifications.push(...parameter.notifications);
    } else {
      const notifications = parameter as NotificationDTO[];
      this.#notifications.push(...notifications);
    }
  }

  // public addNotifications(notifications: NotificationDTO[]) {
  //   this.#notifications.push(...notifications);
  // }
}

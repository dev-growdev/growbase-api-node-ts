import { Contract, Notification } from '@shared/notifications';

describe('Notification', () => {
  it('should be valid', () => {
    const notification = new Notification();

    expect(notification.notifications).toHaveLength(0);
    expect(notification.isValid).toBeTruthy();
  });

  it('should add a notification and should be invalid', () => {
    const notification = new Notification();

    notification.addNotification('teste', 'TESTE_ADD');

    expect(notification.notifications).toHaveLength(1);
    expect(notification.isValid).toBeFalsy();
  });

  it('should add two notifications and should be invalid', () => {
    const notification = new Notification();
    const notifications = new Contract()
      .isRequired(undefined, 'teste')
      .isRequired(undefined, 'teste2');

    notification.addNotifications(notifications);

    expect(notification.notifications).toHaveLength(2);
    expect(notification.isValid).toBeFalsy();
  });
});

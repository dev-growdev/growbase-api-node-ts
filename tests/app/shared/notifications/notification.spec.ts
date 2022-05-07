import { Contract, Notification } from '@shared/notifications';

class TestNotification extends Notification {}

describe('Notification', () => {
  it('should be valid', () => {
    const notification = new TestNotification();

    expect(notification.notifications).toHaveLength(0);
    expect(notification.isValid).toBeTruthy();
  });

  it('should add a notification and should be invalid', () => {
    const notification = new TestNotification();

    notification.addNotification('teste', 'TESTE_ADD');

    expect(notification.notifications).toHaveLength(1);
    expect(notification.isValid).toBeFalsy();
  });

  it('should add two notifications and should be invalid', () => {
    const notification = new TestNotification();
    const notifications = new Contract()
      .isRequired(undefined, 'teste')
      .isRequired(undefined, 'teste2');

    notification.addNotifications(notifications);

    expect(notification.notifications).toHaveLength(2);
    expect(notification.isValid).toBeFalsy();
  });
});

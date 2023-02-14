import { Contract, Notification } from '@shared/notifications';
import { ApplicationError, Result } from '@shared/utils';
import { NextFunction, Request, Response } from 'express';
import '@shared/utils/extension-methods';

export class UpdateProfileValidator {
  handle(request: Request, response: Response, next: NextFunction) {
    const { name, email, phone } = request.body;

    const notifications = new Notification();

    if (name) {
      notifications.addNotifications(new Contract().isRequired(name, 'name'));
    }

    if (email) {
      notifications.addNotifications(new Contract().isValidEmail(email, 'email'));
    }

    if (phone) {
      phone.removeSpecialCharacters();
    }

    if (!notifications.isValid) {
      return response.status(400).json(
        Result.error(
          400,
          new ApplicationError(
            'handle -> UpdateProfileValidator',
            'Requisição inválida',
            notifications.notifications.map((notification) => ({
              name: notification.property,
              description: notification.message,
            })),
          ),
        ),
      );
    }

    return next();
  }
}

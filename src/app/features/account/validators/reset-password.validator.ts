import { Contract, Notification } from '@shared/notifications';
import { ApplicationError, Result } from '@shared/utils';
import { NextFunction, Request, Response } from 'express';

export class ResetPasswordValidator {
  handle(request: Request, response: Response, next: NextFunction) {
    const { email } = request.body;

    const notifications = new Notification();

    notifications.addNotifications(
      new Contract().isRequired(email, 'E-mail').isValidEmail(email, 'E-mail'),
    );

    if (!notifications.isValid) {
      return response.status(400).json(
        Result.error(
          400,
          new ApplicationError(
            'handle -> ResetPasswordValidator',
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

import { Contract, Notification } from '@shared/notifications';
import { ApplicationError, Result } from '@shared/utils';
import { NextFunction, Request, Response } from 'express';

export class RecoveryPasswordValidator {
  handle(request: Request, response: Response, next: NextFunction) {
    const { password, link } = request.body;

    const notifications = new Notification();

    notifications.addNotifications(
      new Contract()
        .isRequired(password, 'E-mail')
        .isMinLength(password, 6, 'Senha', 'A senha deve possuir pelo menos 6 caracteres')
        .isRequired(link, 'Link de recuperação'),
    );

    if (!notifications.isValid) {
      return response.status(400).json(
        Result.error(
          400,
          new ApplicationError(
            'handle -> RecoveryPasswordValidator',
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

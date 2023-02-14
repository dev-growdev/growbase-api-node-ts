import { Contract, Notification } from '@shared/notifications';
import { ApplicationError, Result } from '@shared/utils';
import { NextFunction, Request, Response } from 'express';

export class VerifyAccountValidator {
  handle(request: Request, response: Response, next: NextFunction) {
    const { email, code } = request.body;

    const notifications = new Notification();

    notifications.addNotifications(
      new Contract()
        .isRequired(email, 'E-mail')
        .isValidEmail(email, 'E-mail')
        .isRequired(code, 'Código de ativação')
        .isMinLength(
          code,
          6,
          'Código de ativação',
          'Código de ativação deve ter no minímo 6 caracteres',
        ),
    );

    if (!notifications.isValid) {
      return response.status(400).json(
        Result.error(
          400,
          new ApplicationError(
            'handle -> VerifyAccountValidator',
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

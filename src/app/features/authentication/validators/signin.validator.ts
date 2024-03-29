import { Contract, Notification } from '@shared/notifications';
import { ApplicationError, Result } from '@shared/utils';
import { NextFunction, Request, Response } from 'express';

export class SignInValidator {
  handle(request: Request, response: Response, next: NextFunction) {
    const { login, password } = request.body;

    const notifications = new Notification();

    notifications.addNotifications(
      new Contract()
        .isRequired(login, 'Login')
        .isValidEmail(login, 'Login')
        .isRequired(password, 'Senha')
        .isMinLength(password, 6, 'Senha', 'Senha deve ter no minímo 6 caracteres'),
    );

    if (!notifications.isValid) {
      return response.status(400).json(
        Result.error(
          400,
          new ApplicationError(
            'handle -> SignInValidator',
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

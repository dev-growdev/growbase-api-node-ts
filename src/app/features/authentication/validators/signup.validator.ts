import { Contract, Notification } from '@shared/notifications';
import { ApplicationError, Result } from '@shared/utils';
import { NextFunction, Request, Response } from 'express';
import '@shared/utils/extension-methods';

export class SignUpValidator {
  handle(request: Request, response: Response, next: NextFunction) {
    const { name, email, password, document } = request.body;

    const notifications = new Notification();

    notifications.addNotifications(
      new Contract()
        .isRequired(name, 'name')
        .isRequired(email, 'email')
        .isValidEmail(email, 'email')
        .isRequired(password, 'password')
        .isMinLength(password, 6, 'password', 'Senha muito curta')
        .isRequired(document, 'Documento'),
    );

    if (document) {
      notifications.addNotifications(
        new Contract().isValidCPFCNPJ(document.removeSpecialCharacters(), 'Documento'),
      );
    }

    if (!notifications.isValid) {
      return response.status(400).json(
        Result.error(
          400,
          new ApplicationError(
            'handle -> SignUpValidator',
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

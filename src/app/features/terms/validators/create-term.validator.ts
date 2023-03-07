import { Contract, Notification } from '@shared/notifications';
import { ApplicationError, Result } from '@shared/utils';
import { NextFunction, Request, Response } from 'express';

export class CreateTermValidator {
  handle(request: Request, response: Response, next: NextFunction) {
    const { title, content, version, enable } = request.body;

    const notifications = new Notification();

    notifications.addNotifications(
      new Contract()
        .isRequired(title, 'Título')
        .custom(
          () => title == 'Term' || title == 'Policy',
          'Título',
          'Título inválido. Envie: Term ou Policy',
        )

        .isRequired(content, 'Conteúdo')
        .isRequired(version, 'Versão')
        .isMaxLength(version, 10, 'Versão', 'Versão do termo muito longa')
        .isRequired(enable, 'enable'),
    );

    if (!notifications.isValid) {
      return response.status(400).json(
        Result.error(
          400,
          new ApplicationError(
            'handle -> CreateTermValidator',
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

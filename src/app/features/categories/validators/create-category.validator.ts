import { Contract, Notification } from '@shared/notifications';
import { ApplicationError, Result } from '@shared/utils';
import { NextFunction, Request, Response } from 'express';

export class CreateCategoryValidator {
  handle(request: Request, response: Response, next: NextFunction) {
    const { name, description, image } = request.body;

    const notifications = new Notification();

    notifications.addNotifications(
      new Contract()
        .isRequired(name, 'Nome')
        .isMaxLength(name, 100, 'Nome', 'Tamanho máximo 100')
        .isRequired(image, 'Imagem'),
    );

    if (image) {
      notifications.addNotifications(new Contract().isRequired(image.url, 'Imagem'));
    }

    if (description) {
      notifications.addNotifications(
        new Contract().isMaxLength(description, 200, 'Descrição', 'Tamanho máximo 200'),
      );
    }

    if (!notifications.isValid) {
      return response.status(400).json(
        Result.error(
          400,
          new ApplicationError(
            'handle -> CreateCategoryValidator',
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

import { Contract, Notification } from '@shared/notifications';
import { ApplicationError, Result } from '@shared/utils';
import { NextFunction, Request, Response } from 'express';

export class CreateProductValidator {
  handle(request: Request, response: Response, next: NextFunction) {
    const { name, description, categories, images } = request.body;

    const notifications = new Notification();

    notifications.addNotifications(
      new Contract()
        .isRequired(name, 'Nome')
        .isMaxLength(name, 100, 'Nome', 'Tamanho máximo 100')
        .isRequired(description, 'Descrição')
        .isRequired(categories, 'Categorias')
        .isRequired(images, 'Imagens'),
    );

    if (categories) {
      notifications.addNotifications(
        new Contract().isMinLength(
          categories.length,
          1,
          'Categorias',
          'Pelo menos uma categoria deve ser informada',
        ),
      );
    }

    if (images) {
      notifications.addNotifications(
        new Contract().isMinLength(
          images.length,
          1,
          'Imagens',
          'Pelo menos uma imagem deve ser informada',
        ),
      );
    }

    if (!notifications.isValid) {
      return response.status(400).json(
        Result.error(
          400,
          new ApplicationError(
            'handle -> CreateProductValidator',
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

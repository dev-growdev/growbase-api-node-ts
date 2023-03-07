import { Contract, Notification } from '@shared/notifications';
import { ApplicationError, Result } from '@shared/utils';
import { NextFunction, Request, Response } from 'express';

export class FaqValidator {
  handle(request: Request, response: Response, next: NextFunction) {
    const { question, answer } = request.body;

    const notifications = new Notification();

    notifications.addNotifications(
      new Contract()
        .isRequired(question, 'Pergunta')
        .isMaxLength(question, 150, 'Pergunta', 'Tamanho máximo 150')
        .isRequired(answer, 'Resposta'),
    );

    if (!notifications.isValid) {
      return response.status(400).json(
        Result.error(
          400,
          new ApplicationError(
            'handle -> FaqValidator',
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

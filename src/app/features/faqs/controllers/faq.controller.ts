import { Request, Response } from 'express';
import { notFound, notOk, ok, serverError } from '@shared/utils';
import { CreateFaq, DeleteFaq, GetAllFaqs, GetFaqByUid, UpdateFaq } from '@faqs/usecases';
import { FaqRepository } from '@faqs/repositories';

export class FaqController {
  async getAllFaqs(request: Request, response: Response) {
    try {
      const usecase = new GetAllFaqs(new FaqRepository());

      const result = await usecase.execute();

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'getAllFaqs -> FaqController', error);
    }
  }

  async getFaqByUid(request: Request, response: Response) {
    try {
      const { uid } = request.params;

      const usecase = new GetFaqByUid(new FaqRepository());

      const result = await usecase.execute(uid);

      if (!result.success) return notOk(response, result);

      if (!result.data) return notFound(response, 'FAQ não encontrada');

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'getFaqByUid -> FaqController', error);
    }
  }

  async createFaq(request: Request, response: Response) {
    try {
      const { question, answer } = request.body;

      const usecase = new CreateFaq(new FaqRepository());

      const result = await usecase.execute({
        question,
        answer,
      });

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'createFaq -> FaqController', error);
    }
  }

  async updateFaq(request: Request, response: Response) {
    try {
      const { uid } = request.params;
      const { question, answer } = request.body;

      const usecase = new UpdateFaq(new FaqRepository());

      const result = await usecase.execute(uid, { question, answer });

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'updateFaq -> FaqController', error);
    }
  }

  async deleteFaq(request: Request, response: Response) {
    try {
      const { uid } = request.params;

      const usecase = new DeleteFaq(new FaqRepository());

      const result = await usecase.execute(uid);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'deleteFaq -> FaqController', error);
    }
  }
}

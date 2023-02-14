import { notFound, notOk, ok, serverError } from '@shared/utils';
import { Request, Response } from 'express';
import { TermRepository } from '../repositories';
import { CreateTerm, GetTerm } from '../usecases';

export class TermAndPolicyController {
  async getTerm(request: Request, response: Response) {
    try {
      const { title } = request.query;

      const getTerm = new GetTerm(new TermRepository());

      const result = await getTerm.execute(title as string);

      if (!result.success) return notOk(response, result);

      if (!result.data)
        return notFound(response, 'Termo ou política de privacidade não encontrado');

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'getTerm -> TermAndPolicyController', error);
    }
  }

  async createTerm(request: Request, response: Response) {
    try {
      const { title, content, version, enable } = request.body;

      const createTerm = new CreateTerm(new TermRepository());

      const result = await createTerm.execute({ title, content, version, enable });

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'createTerm -> TermAndPolicyController', error);
    }
  }
}

import { HttpRequest, HttpResponse } from '.';

export interface Middleware {
  handle(request: HttpRequest): Promise<HttpResponse>;
}

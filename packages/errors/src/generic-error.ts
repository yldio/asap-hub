import { HTTPError } from 'got';

export class GenericError extends Error {
  public httpResponseBody?: unknown;

  constructor(public cause: Error | unknown) {
    super();

    if (cause instanceof HTTPError) {
      this.httpResponseBody = cause.response?.body;
    }
  }
}

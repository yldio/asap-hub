import { HTTPError } from 'got';

export class GenericError extends Error {
  public httpResponseBody?: unknown;

  constructor(public cause?: Error | undefined, message?: string) {
    super();

    if (message) {
      this.message = message;
    }

    if (cause instanceof HTTPError) {
      this.httpResponseBody = cause.response?.body;
    }
  }
}

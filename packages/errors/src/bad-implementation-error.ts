import { ASAPError } from './asap-error';

export class BadImplementationError extends ASAPError {
  public constructor(
    message: string = 'Internal Server Error',
    public readonly data?: unknown,
  ) {
    super(
      'Internal Server Error',
      500,
      message,
      data
    );
  }
}

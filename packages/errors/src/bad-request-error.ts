import { ASAPError } from './asap-error';

export class BadRequestError extends ASAPError {
  public constructor(
    message: string = 'Bad Request',
    public readonly data?: unknown,
  ) {
    super(
      'Bad Request',
      400,
      message,
      data
    );
  }
}

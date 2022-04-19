import { ASAPError } from './asap-error';

export class ValidationError extends ASAPError {
  public constructor(
    message: string,
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

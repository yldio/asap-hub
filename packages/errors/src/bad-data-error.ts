import { ASAPError } from './asap-error';

export class BadDataError extends ASAPError {
  public constructor(
    message: string = 'Unprocessable Entity',
    public readonly data?: unknown,
  ) {
    super(
      'Unprocessable Entity',
      422,
      message,
      data
    );
  }
}

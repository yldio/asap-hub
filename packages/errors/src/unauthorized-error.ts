import { ASAPError } from './asap-error';

export class UnauthorizedError extends ASAPError {
  public constructor(
    message: string = 'Unauthorized',
    public readonly data?: unknown,
  ) {
    super(
      'Unauthorized',
      401,
      message,
      data
    );
  }
}

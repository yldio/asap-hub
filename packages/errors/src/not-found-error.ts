import { ASAPError } from './asap-error';

export class NotFoundError extends ASAPError {
  public constructor(
    message: string = 'Not Found',
    public readonly data?: unknown,
  ) {
    super(
      'Not Found',
      404,
      message,
      data
    );
  }
}

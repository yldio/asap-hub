import { ASAPError } from './asap-error';

export class EntityTooLargeError extends ASAPError {
  public constructor(
    message: string = 'Request Entity Too Large',
    public readonly data?: unknown,
  ) {
    super(
      'Request Entity Too Large',
      413,
      message,
      data
    );
  }
}

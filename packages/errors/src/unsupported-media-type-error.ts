import { ASAPError } from './asap-error';

export class UnsupportedMediaTypeError extends ASAPError {
  public constructor(
    message: string = 'Unsupported Media Type',
    public readonly data?: unknown,
  ) {
    super(
      'Unsupported Media Type',
      415,
      message,
      data
    );
  }
}

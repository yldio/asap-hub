import { CRNError } from './crn-error';

export class UnsupportedMediaTypeError extends CRNError {
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

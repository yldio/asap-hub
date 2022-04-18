import { CRNError } from './crn-error';

export class NotFoundError extends CRNError {
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

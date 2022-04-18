import { CRNError } from './crn-error';

export class BadImplementationError extends CRNError {
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

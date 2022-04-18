import { CRNError } from './crn-error';

export class BadDataError extends CRNError {
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

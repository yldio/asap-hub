import { CRNError } from './crn-error';

export class ValidationError extends CRNError {
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

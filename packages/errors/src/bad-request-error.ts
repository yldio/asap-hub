import { CRNError } from './crn-error';

export class BadRequestError extends CRNError {
  public constructor(
    message: string = 'Bad Request',
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

import { CRNError } from './crn-error';

export class UnauthorizedError extends CRNError {
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

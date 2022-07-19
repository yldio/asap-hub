import { GenericError } from './generic-error';

export class ValidationError extends GenericError {
  constructor(
    cause: Error | undefined,
    public details: string[] = [],
    message?: string,
  ) {
    super(cause, message);
  }
}

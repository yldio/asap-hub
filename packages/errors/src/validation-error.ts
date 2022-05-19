import { GenericError } from './generic-error';

export class ValidationError extends GenericError {
  constructor(cause: Error | unknown, public details: string[] = []) {
    super(cause);
  }
}

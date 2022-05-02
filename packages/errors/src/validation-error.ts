import { GenericError } from './asap-error';

export class ValidationError extends GenericError {
  constructor(cause: Error | unknown, public details: string[] = []) {
    super(cause);
  }
}

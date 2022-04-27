import { AsapError } from './asap-error';

export class ValidationError extends AsapError {
  constructor(cause: Error | unknown, public details: string[] = []) {
    super(cause);
  }
}

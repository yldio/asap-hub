export interface Alerts {
  error: (error: unknown) => void | Promise<void>;
}
import * as Sentry from '@sentry/serverless';

export class AlertsSentry implements Alerts {
  private captureExceptionSentry: typeof Sentry.captureException;

  constructor(captureException: typeof Sentry.captureException) {
    this.captureExceptionSentry = captureException;
  }

  error(error: unknown): void {
    this.captureExceptionSentry(error);
  }
}

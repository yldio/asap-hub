import * as Sentry from '@sentry/serverless';

export interface Alerts {
  error: (error: Error) => void | Promise<void>;
}

export class AlertsSentry implements Alerts {
  private captureExceptionSentry: typeof Sentry.captureException;

  constructor(captureException: typeof Sentry.captureException) {
    this.captureExceptionSentry = captureException;
  }

  error(error: Error): void {
    this.captureExceptionSentry(error);
  }
}

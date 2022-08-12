import * as Sentry from '@sentry/serverless';
import { Handler } from 'aws-lambda';

export interface SentryConfig {
  currentRevision: string;
  environment: string;
  sentryDsn: string;
  sentryTraceSampleRate: number;
}

export const sentryWrapperImpl = (
  handler: Handler,
  config: SentryConfig,
): Handler => {
  Sentry.AWSLambda.init({
    dsn: config.sentryDsn,
    tracesSampleRate: config.sentryTraceSampleRate,
    environment: config.environment,
    release: config.currentRevision,
  });

  return Sentry.AWSLambda.wrapHandler(handler);
};

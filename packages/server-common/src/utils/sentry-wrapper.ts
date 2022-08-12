import * as Sentry from '@sentry/serverless';
import { Handler } from 'aws-lambda';

export interface SentryConfig {
  currentRevision: string | undefined;
  environment: string | undefined;
  sentryDsn: string | undefined;
  sentryTraceSampleRate: number | undefined;
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

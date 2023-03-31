import * as Sentry from '@sentry/serverless';
import { Handler } from 'aws-lambda';

export interface SentryConfig {
  currentRevision: string | undefined;
  environment: string;
  sentryDsn: string | undefined;
  sentryTraceSampleRate: number | undefined;
}

export const sentryWrapperFactory =
  ({
    sentryDsn,
    sentryTraceSampleRate,
    environment,
    currentRevision,
  }: SentryConfig) =>
  (handler: Handler): Handler => {
    if (['dev', 'production'].includes(environment)) {
      Sentry.AWSLambda.init({
        dsn: sentryDsn,
        tracesSampleRate: sentryTraceSampleRate,
        environment,
        release: currentRevision,
      });

      return Sentry.AWSLambda.wrapHandler(handler);
    }
    return handler;
  };

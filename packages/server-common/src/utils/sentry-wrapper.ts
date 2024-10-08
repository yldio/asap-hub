import * as Sentry from '@sentry/serverless';
import { Handler } from 'aws-lambda';

export interface SentryConfig {
  currentRevision: string | undefined;
  environment: string | undefined;
  sentryDsn: string | undefined;
  sentryTraceSampleRate: number | undefined;
}

export const sentryWrapperFactory =
  (config: SentryConfig) =>
  (handler: Handler): Handler => {
    Sentry.AWSLambda.init({
      dsn: config.sentryDsn,
      // Is recommended adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: config.sentryTraceSampleRate,
      // Turn sampleRate on to reduce the amount of errors sent to Sentry
      sampleRate: 1.0, // 0.1 = 10% of error events will be sent
      environment: config.environment,
      release: config.currentRevision,
    });

    return Sentry.AWSLambda.wrapHandler(handler, { ignoreSentryErrors: true });
  };

import * as Sentry from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import { currentRevision, environment, sentryDsn, sentryTraceSampleRate, } from '../config';

export const sentryWrapper = (handler: Handler): Handler => {
  Sentry.AWSLambda.init({
    dsn: sentryDsn,
    tracesSampleRate: sentryTraceSampleRate,
    environment,
    release: currentRevision,
  });

  return Sentry.AWSLambda.wrapHandler(handler);
};

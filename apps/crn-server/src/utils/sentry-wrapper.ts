import {
  currentRevision,
  environment,
  sentryDsn,
  sentryTraceSampleRate,
} from '../config';
import { Handler } from 'aws-lambda';
import * as Sentry from '@sentry/serverless';

export const sentryWrapper = (handler: Handler): Handler => {
  Sentry.AWSLambda.init({
    dsn: sentryDsn,
    tracesSampleRate: sentryTraceSampleRate,
    environment,
    release: currentRevision,
  });

  return Sentry.AWSLambda.wrapHandler(handler);
};

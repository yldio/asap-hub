import * as Sentry from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import { sentryWrapper } from '../../src/utils/sentry-wrapper';
import {
  currentRevision,
  environment,
  sentryDsn,
  sentryTraceSampleRate,
} from '../../src/config';

describe('Sentry wrapper correctly calls functions', () => {
  test('should call the init & wrapHandler functions', () => {
    Sentry.AWSLambda.init = jest.fn((_) => true);
    Sentry.AWSLambda.wrapHandler = jest.fn((handler: Handler) => handler);

    const handler = async (event: unknown, _context: unknown) => {
      return event;
    };

    sentryWrapper(handler);

    expect(Sentry.AWSLambda.init).toHaveBeenCalledWith({
      dsn: sentryDsn,
      tracesSampleRate: sentryTraceSampleRate,
      environment,
      release: currentRevision,
    });
    expect(Sentry.AWSLambda.wrapHandler).toHaveBeenCalledWith(handler);
  });
});

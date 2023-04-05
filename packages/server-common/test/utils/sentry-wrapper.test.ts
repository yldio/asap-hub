import * as Sentry from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import { SentryConfig, sentryWrapperFactory } from '../../src/utils';

describe('Sentry wrapper correctly calls functions', () => {
  test('should call the init & wrapHandler functions', () => {
    Sentry.AWSLambda.init = jest.fn((_) => true);
    Sentry.AWSLambda.wrapHandler = jest.fn((handler: Handler) => handler);

    const handler = async (event: unknown, _context: unknown) => {
      return event;
    };

    const config: SentryConfig = {
      sentryDsn: 'DSN',
      sentryTraceSampleRate: 1.0,
      environment: 'TEST',
      currentRevision: 'NoIdea',
    };

    const sentryWrapper = sentryWrapperFactory(config);
    sentryWrapper(handler);

    expect(Sentry.AWSLambda.init).toHaveBeenCalledWith({
      dsn: config.sentryDsn,
      tracesSampleRate: config.sentryTraceSampleRate,
      environment: config.environment,
      release: config.currentRevision,
      sampleRate: 1,
    });
    expect(Sentry.AWSLambda.wrapHandler).toHaveBeenCalledWith(handler);
  });
});

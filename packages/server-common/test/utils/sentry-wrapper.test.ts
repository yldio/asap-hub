import * as Sentry from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import { SentryConfig, sentryWrapperFactory } from '../../src/utils';

describe('Sentry wrapper correctly calls functions', () => {
  test.each(['dev', 'Production'])(
    'for enviroment %s should call the init & wrapHandler functions',
    (environment) => {
      Sentry.AWSLambda.init = jest.fn((_) => true);
      Sentry.AWSLambda.wrapHandler = jest.fn((handler: Handler) => handler);

      const handler = async (event: unknown, _context: unknown) => {
        return event;
      };

      const config: SentryConfig = {
        sentryDsn: 'DSN',
        sentryTraceSampleRate: 1.0,
        environment,
        currentRevision: 'NoIdea',
      };

      const sentryWrapper = sentryWrapperFactory(config);
      sentryWrapper(handler);

      expect(Sentry.AWSLambda.init).toHaveBeenCalledWith({
        dsn: config.sentryDsn,
        tracesSampleRate: config.sentryTraceSampleRate,
        environment: config.environment,
        release: config.currentRevision,
      });
      expect(Sentry.AWSLambda.wrapHandler).toHaveBeenCalledWith(handler);
    },
  );
  test('an invalid enviroment should not call the init & wrapHandler functions', () => {
    Sentry.AWSLambda.init = jest.fn(() => true);
    Sentry.AWSLambda.wrapHandler = jest.fn();

    const handler = async (event: unknown, _context: unknown) => {
      return event;
    };

    const config: SentryConfig = {
      sentryDsn: 'DSN',
      sentryTraceSampleRate: 1.0,
      environment: 'invalid-environment',
      currentRevision: 'NoIdea',
    };

    const sentryWrapper = sentryWrapperFactory(config);
    sentryWrapper(handler);

    expect(Sentry.AWSLambda.init).not.toHaveBeenCalled();
    expect(Sentry.AWSLambda.wrapHandler).not.toHaveBeenCalled();
  });
});

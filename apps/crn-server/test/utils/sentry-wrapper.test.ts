import { Handler } from 'aws-lambda';
import { sentryWrapper } from '../../src/utils/sentry-wrapper';
import {
  currentRevision,
  environment,
  sentryDsn,
  sentryTraceSampleRate,
} from '../../src/config';

describe('Sentry wrapper correctly calls functions', () => {
  const mockSentryInit = jest.fn((_) => true);
  const mockSentryWrapHandler = jest.fn((handler: Handler) => handler);

  jest.mock('@sentry/serverless', () => {
    const sentryServerless = jest.requireActual('@sentry/serverless');

    return {
      ...sentryServerless,
      AWSLambda: {
        init: mockSentryInit,
        wrapHandler: mockSentryWrapHandler,
      },
    };
  });

  test('should call the init & wrapHandler functions', () => {
    const handler = async (event: unknown, _context: unknown) => {
      return event;
    };

    sentryWrapper(handler);

    expect(mockSentryInit).toHaveBeenCalledWith({
      dsn: sentryDsn,
      tracesSampleRate: sentryTraceSampleRate,
      environment,
      release: currentRevision,
    });
    expect(mockSentryWrapHandler).toHaveBeenCalledWith(handler);
  });
});

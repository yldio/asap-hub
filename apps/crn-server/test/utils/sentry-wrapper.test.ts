import { Handler } from 'aws-lambda';
import { sentryWrapper } from '../../src/utils/sentry-wrapper';
import {
  currentRevision,
  environment,
  sentryDsn,
  sentryTraceSampleRate,
} from '../../src/config';

describe('Sentry wrapper correctly calls functions', () => {
  const initMock = jest.fn((_) => true);
  const wrapHandlerMock = jest.fn((handler: Handler) => handler);

  jest.mock('@sentry/serverless', () => {
    const sentryServerless = jest.requireActual('@sentry/serverless');

    return {
      ...sentryServerless,
      AWSLambda: {
        init: initMock,
        wrapHandler: wrapHandlerMock,
      },
    };
  });

  test('should call the init & wrapHandler functions', () => {
    const handler = async (event: unknown, _context: unknown) => {
      return event;
    };

    sentryWrapper(handler);

    expect(initMock).toHaveBeenCalledWith({
      dsn: sentryDsn,
      tracesSampleRate: sentryTraceSampleRate,
      environment,
      release: currentRevision,
    });
    expect(wrapHandlerMock).toHaveBeenCalledWith(handler);
  });
});

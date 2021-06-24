import * as Sentry from '@sentry/serverless';
import { AlertsSentry } from '../../src/utils/alerts';

describe('Sentry Alerts', () => {
  const mockCaptureException: jest.MockedFunction<
    typeof Sentry.captureException
  > = jest.fn();
  const alerts = new AlertsSentry(mockCaptureException);

  test('Should call Sentry captureException with correct arguments', () => {
    const err = new Error();

    alerts.error(err);

    expect(mockCaptureException).toBeCalledWith(err);
  });
});

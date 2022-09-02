import { UserController } from '../../../src/controllers';
import { connectByCodeHandlerFactory } from '../../../src/handlers/webhooks/connect-by-code.handler';
import { Logger } from '../../../src/utils';
import { getConnectByCodeRequest } from '../../helpers/events';
const secret = 'secret';

describe('Connect by code handler', () => {
  const userController = {
    connectByCode: jest.fn(),
  } as unknown as jest.Mocked<UserController>;
  const logger = {
    debug: jest.fn(),
  } as unknown as jest.Mocked<Logger>;
  const handler = connectByCodeHandlerFactory(userController, secret, logger);
  describe('POST /webhook/users/connections - validations', () => {
    test('returns 400 when code is not defined', async () => {
      const event = getConnectByCodeRequest(
        {
          userId: 'userId',
        },
        {
          authorization: `Basic ${secret}`,
        },
      );
      expect(handler(event)).rejects.toThrowError('Validation error');
    });

    test('returns 400 when userId is not defined', async () => {
      const event = getConnectByCodeRequest(
        {
          code: 'asap|token',
        },

        {
          authorization: `Basic ${secret}`,
        },
      );
      expect(handler(event)).rejects.toThrowError('Validation error');
    });

    test('returns 400 when additional fields exist', async () => {
      const event = getConnectByCodeRequest(
        {
          userId: 'userId',
          code: 'asap|token',
          additionalField: 'some-field',
        },
        {
          authorization: `Basic ${secret}`,
        },
      );
      expect(handler(event)).rejects.toThrowError('Validation error');
    });

    test('returns 403 when secret doesnt match', async () => {
      const event = getConnectByCodeRequest(
        {
          userId: 'userId',
          code: 'asap|token',
        },
        {
          authorization: `Basic token`,
        },
      );
      expect(handler(event)).rejects.toThrowError('basic');
    });
  });

  describe('POST /webhook/users/connections - success', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    test('returns 202 for valid code and calls connectByCode', async () => {
      const userId = `google-oauth2|token`;
      const code = 'asapWelcomeCode';

      const event = getConnectByCodeRequest(
        {
          code,
          userId,
        },
        {
          authorization: `Basic ${secret}`,
        },
      );
      const response = await handler(event);
      expect(response.statusCode).toEqual(202);
      expect(userController.connectByCode).toHaveBeenCalledWith(code, userId);
    });
  });
});

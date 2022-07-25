import { RestUser } from '@asap-hub/squidex';
import { UserController } from '../../../src/controllers';
import { connectByCodeHandlerFactory } from '../../../src/handlers/webhooks/connect-by-code.handler';
import { getConnectByCodeRequest } from '../../helpers/events';
const secret = 'secret';

const user: RestUser = {
  id: 'userId',
  lastModified: '2020-09-25T11:06:27.164Z',
  version: 42,
  created: '2020-09-24T11:06:27.164Z',
  data: {
    role: {
      iv: 'Grantee',
    },
    lastModifiedDate: { iv: '2020-09-25T11:06:27.164Z' },
    email: { iv: 'me@example.com' },
    firstName: { iv: 'First' },
    lastName: { iv: 'Last' },
    jobTitle: { iv: 'Title' },
    institution: { iv: 'Institution' },
    connections: { iv: [] },
    biography: { iv: 'Biography' },
    avatar: { iv: [] },
    expertiseAndResourceTags: { iv: [] },
    questions: { iv: [] },
    teams: { iv: [] },
    onboarded: {
      iv: true,
    },
    labs: { iv: [] },
  },
};

describe('Connect by code handler', () => {
  const userController = {
    connectByCode: jest.fn(),
  } as unknown as jest.Mocked<UserController>;
  const handler = connectByCodeHandlerFactory(userController, secret);
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
    test('returns 202 for valid code and updates the user', async () => {
      const userId = `google-oauth2|token`;

      const event = getConnectByCodeRequest(
        {
          code: 'asapWelcomeCode',
          userId,
        },
        {
          authorization: `Basic ${secret}`,
        },
      );
      const response = await handler(event);
      expect(response.statusCode).toEqual(202);
    });
  });
});

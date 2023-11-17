import { Common } from 'googleapis';
import {
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
} from '../../../src';
import { GetJWTCredentials } from '../../../src/utils/aws-secret-manager';
import { googleApiAuthJWTCredentials } from '../../mocks/google-api.mock';
import { loggerMock as logger } from '../../mocks/logger.mock';

const mockGoogleAuth = jest.fn();
const mockWatch = jest.fn();
const mockStop = jest.fn();

jest.mock('googleapis', () => ({
  ...jest.requireActual('googleapis'),
  google: {
    auth: {
      GoogleAuth: jest.fn(),
    },
    calendar: () => ({
      events: {
        watch: mockWatch,
      },
      channels: {
        stop: mockStop,
      },
    }),
  },
  Auth: {
    GoogleAuth: jest
      .fn()
      .mockImplementation(() => ({ fromJSON: mockGoogleAuth })),
  },
}));

describe('Subscription', () => {
  const calendarId = 'calendar-id';
  const subscriptionId = '42';
  const getJWTCredentials: jest.MockedFunction<GetJWTCredentials> = jest.fn();
  const asapApiUrl = 'http://asap-api-url';
  const googleApiToken = 'google-api-token';
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];
  test('Should subscribe to the calendar events notifications and return the resourceId when cms is contentful', async () => {
    getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

    mockGoogleAuth.mockReturnValue({
      scopes,
    });
    const expiration = 1_617_196_357_000;

    mockWatch.mockResolvedValue({
      data: {
        resourceId: 'some-resource-id',
        expiration: `${expiration}`,
      },
    });
    const subscribeToEventChanges = subscribeToEventChangesFactory(
      getJWTCredentials,
      logger,
      { googleApiToken, asapApiUrl },
    );

    const result = await subscribeToEventChanges(calendarId, subscriptionId);

    expect(result).toEqual({
      resourceId: 'some-resource-id',
      expiration,
    });
    expect(mockWatch).toHaveBeenCalledWith({
      calendarId,
      requestBody: {
        id: subscriptionId,
        token: googleApiToken,
        type: 'web_hook',
        address: `${asapApiUrl}/webhook/events/contentful`,
        params: {
          ttl: '2592000',
        },
      },
    });
  });

  test('404 - should return empty resourceId', async () => {
    getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

    mockGoogleAuth.mockRejectedValueOnce(
      new Common.GaxiosError('Not Found', {}, {
        status: 404,
      } as unknown as Common.GaxiosResponse),
    );

    const subscribeToEventChanges = subscribeToEventChangesFactory(
      getJWTCredentials,
      logger,
      { googleApiToken, asapApiUrl },
    );

    const result = await subscribeToEventChanges(calendarId, subscriptionId);

    expect(result).toEqual({
      resourceId: null,
      expiration: null,
    });
  });
  test('500 - should throw', async () => {
    getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

    mockGoogleAuth.mockRejectedValueOnce(
      new Common.GaxiosError('Internal Server Error', {}, {
        status: 500,
      } as unknown as Common.GaxiosResponse),
    );

    const subscribeToEventChanges = subscribeToEventChangesFactory(
      getJWTCredentials,
      logger,
      { googleApiToken, asapApiUrl },
    );

    await expect(
      subscribeToEventChanges(calendarId, subscriptionId),
    ).rejects.toThrow();
  });
  test('Should throw when no resourceId', async () => {
    getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

    mockGoogleAuth.mockReturnValue({
      scopes,
    });

    mockWatch.mockResolvedValue({
      data: {
        resourceId: undefined,
        expiration: '1_617_196_357_000',
      },
    });
    const subscribeToEventChanges = subscribeToEventChangesFactory(
      getJWTCredentials,
      logger,
      { googleApiToken, asapApiUrl },
    );

    await expect(
      subscribeToEventChanges(calendarId, subscriptionId),
    ).rejects.toThrow();
  });
  test('Should throw when no expiration', async () => {
    getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

    mockGoogleAuth.mockReturnValue({
      scopes,
    });

    mockWatch.mockResolvedValue({
      data: {
        resourceId: 'some-resource-id',
        expiration: undefined,
      },
    });
    const subscribeToEventChanges = subscribeToEventChangesFactory(
      getJWTCredentials,
      logger,
      { googleApiToken, asapApiUrl },
    );

    await expect(
      subscribeToEventChanges(calendarId, subscriptionId),
    ).rejects.toThrow();
  });
});

describe('Unsubscribing', () => {
  const resourceId = 'resource-id';
  const channelId = 'channel-id';
  const getJWTCredentials: jest.MockedFunction<GetJWTCredentials> = jest.fn();
  const unsubscribeFromEventChanges = unsubscribeFromEventChangesFactory(
    getJWTCredentials,
    logger,
  );

  test('Should unsubscribe from the calendar events notifications', async () => {
    getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

    await unsubscribeFromEventChanges(resourceId, channelId);

    expect(mockStop).toHaveBeenCalledWith({
      requestBody: {
        id: channelId,
        resourceId,
      },
    });
  });
});

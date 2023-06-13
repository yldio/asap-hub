import { Environment } from 'contentful-management';
import { SquidexGraphqlClient } from '@asap-hub/squidex';
import { CalendarDataProvider } from '@asap-hub/model';
import { Logger } from '@asap-hub/server-common';
import { syncCalendars } from '../../src/calendars/sync-all';
import { calendarEntry } from '../fixtures';
import { getContentfulClient, fetchContentfulEntries } from '../../src/utils';
import { getContentfulEnvironmentMock } from '../mocks/contentful.mocks';
import { getDataProviderMock } from '../../../../apps/crn-server/test/mocks/data-provider.mock';
import { loggerMock } from '../../../../apps/crn-server/test/mocks/logger.mock';

jest.mock('../../src/utils/setup');
jest.mock('../../src/utils/entries');

describe('Sync All Calendars', () => {
  let contenfulEnv: Environment;
  let squidexGraphqlClientMock: jest.Mocked<SquidexGraphqlClient>;
  let dataProvider: CalendarDataProvider;
  let logger: Logger;

  beforeEach(() => {
    contenfulEnv = getContentfulEnvironmentMock();
    squidexGraphqlClientMock = {
      request: jest.fn(),
    };
    dataProvider = getDataProviderMock();

    logger = loggerMock;

    (getContentfulClient as jest.Mock).mockResolvedValueOnce({
      contentfulEnvironment: contenfulEnv,
      squidexGraphqlClient: squidexGraphqlClientMock,
    });

    jest
      .spyOn(calendarEntry, 'publish')
      .mockImplementationOnce(() => Promise.resolve(calendarEntry));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates googleApiMetadata property to empty object', async () => {
    (fetchContentfulEntries as jest.Mock).mockResolvedValue([calendarEntry]);

    await syncCalendars({ dataProvider, logger });

    expect(dataProvider.update).toHaveBeenCalledTimes(1);
    expect(dataProvider.update).toHaveBeenCalledWith(calendarEntry.sys.id, {
      googleApiMetadata: {},
    });
  });

  it('logs if there are no calendar to sync', async () => {
    (fetchContentfulEntries as jest.Mock).mockResolvedValue([]);

    await syncCalendars({ dataProvider, logger });

    expect(dataProvider.update).not.toHaveBeenCalled();
  });

  it('logs if an error is thrown during update', async () => {
    const err = new Error('error');
    (fetchContentfulEntries as jest.Mock).mockResolvedValue([calendarEntry]);
    dataProvider.update = jest.fn().mockRejectedValue(err);

    await expect(syncCalendars({ dataProvider, logger })).rejects.toThrow(
      'Calendar Syncing Error',
    );

    expect(logger.error).toBeCalledWith(
      err,
      `Failed to sync calendar: ${calendarEntry.sys.id}`,
    );
  });
});

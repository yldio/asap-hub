import nock from 'nock';
import { handler } from '../../../src/handlers/webhooks/cronjob-sync-orcid';
import * as fixtures from './cronjob-sync-orcid.fixtures';
import orcidWorksResponse from './fetch-orcid-works.fixtures.json';

const mockFetchWithOrcidSorted = jest
  .fn()
  .mockResolvedValue(fixtures.fetchUsersResponse);
const mockUpdateOrcidWorks = jest
  .fn()
  .mockResolvedValue(fixtures.fetchUsersResponse[0]);

jest.mock('../../../src/cms/users', () => {
  return jest.fn(() => ({
    fetchWithOrcidSorted: mockFetchWithOrcidSorted,
    updateOrcidWorks: mockUpdateOrcidWorks,
  }));
});

describe('Cronjob - Sync Users ORCID', () => {
  const orcid = '0000-0001-9884-1913';

  beforeAll(() => {
    // Add recently synced user
    fixtures.fetchUsersResponse[1]!.data.orcidLastSyncDate!.iv = new Date().toISOString();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('should fetch ORCID works for users with orcid and lastSyncDate 1 month away', async () => {
    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, orcidWorksResponse);

    await handler();
    const [receivedUser, , receivedWorks] = mockUpdateOrcidWorks.mock.calls[0];
    expect(receivedUser.id).toBeDefined();
    expect(receivedWorks.length).toBe(10);
    expect(receivedWorks).toStrictEqual(
      fixtures.ORCIDWorksDeserialisedExpectation,
    );
  });
});

import nock from 'nock';
import { handler } from '../../../src/handlers/webhooks/cronjob-sync-orcid';
import fetchUsersResponse from '../../fixtures/users.fetch-with-orcid-sorted.json';
import orcidWorksResponse from '../../fixtures/fetch-orcid-works-0000-0002-9079-593X.json';
import orcidWorksDeserialised from '../../fixtures/users.orcid-works-deserialised.json';

const mockFetchWithOrcidSorted = jest
  .fn()
  .mockResolvedValue(fetchUsersResponse);
const mockUpdateOrcidWorks = jest.fn().mockResolvedValue(fetchUsersResponse[0]);

jest.mock('../../../src/cms/users', () => {
  return jest.fn(() => ({
    fetchWithOrcidSorted: mockFetchWithOrcidSorted,
    updateOrcidWorks: mockUpdateOrcidWorks,
  }));
});

describe('Cronjob - Sync Users ORCID', () => {
  const orcid = '0000-0002-9079-593X';

  beforeAll(() => {
    // Add recently synced user
    fetchUsersResponse[1]!.data.orcidLastSyncDate!.iv = new Date().toISOString();
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
    expect(receivedWorks).toStrictEqual(orcidWorksDeserialised);
  });
});

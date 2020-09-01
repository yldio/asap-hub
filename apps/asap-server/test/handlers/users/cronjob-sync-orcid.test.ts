import nock from 'nock';
import cronjob from '../../../src/handlers/users/cronjob-sync-orcid';
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

  test('finds users without orcid last modified date', async () => {
    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, orcidWorksResponse);

    await cronjob();
    const [receivedUser, , receivedWorks] = mockUpdateOrcidWorks.mock.calls[0];
    expect(receivedUser.id).toBeDefined();
    expect(receivedWorks).toStrictEqual(orcidWorksDeserialised);
  });
});

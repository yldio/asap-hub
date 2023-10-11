import nock from 'nock';
import {
  fetchOrcidProfile,
  isValidOrcidResponse,
  ORCIDWorksResponse,
  transformOrcidWorks,
} from '../../src/utils/fetch-orcid';
import {
  orcidWorksDeserialisedExpectation,
  orcidWorksResponse,
} from '../fixtures/users.fixtures';

describe('Fetch ORCID utils', () => {
  const orcid = '363-98-9330';

  describe('fetchOrcidProfile util function', () => {
    test('Should return the data from ORCID API as JSON', async () => {
      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidWorksResponse);

      expect(await fetchOrcidProfile(orcid)).toEqual(orcidWorksResponse);
    });
  });

  describe('transformOrcidWorks util function', () => {
    test('Should transform the ORCID works data', async () => {
      expect(
        await transformOrcidWorks(
          orcidWorksResponse as {
            [K in keyof ORCIDWorksResponse]: NonNullable<ORCIDWorksResponse[K]>;
          },
        ),
      ).toEqual({
        lastModifiedDate: '1594690575911',
        works: orcidWorksDeserialisedExpectation,
      });
    });
  });

  describe('isValidOrcidResponse type guard', () => {
    test('Should recognise a non-nullable ORCID works response', () => {
      expect(isValidOrcidResponse(orcidWorksResponse)).toBe(true);
    });
  });
});

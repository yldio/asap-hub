import nock from 'nock';
import {
  fetchOrcidProfile,
  isValidOrcidResponse,
  ORCIDWorksResponse,
  transformOrcidWorks,
} from '../../src/utils/fetch-orcid';
import {
  orcidWorksDeserialisedExpectation,
  getOrcidWorksResponse,
} from '../fixtures/users.fixtures';

describe('Fetch ORCID utils', () => {
  const orcid = '363-98-9330';

  describe('fetchOrcidProfile util function', () => {
    test('Should return the data from ORCID API as JSON', async () => {
      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, getOrcidWorksResponse());

      expect(await fetchOrcidProfile(orcid)).toEqual(getOrcidWorksResponse());
    });
  });

  describe('transformOrcidWorks util function', () => {
    test('Should transform the ORCID works data', async () => {
      expect(
        await transformOrcidWorks(
          getOrcidWorksResponse() as {
            [K in keyof ORCIDWorksResponse]: NonNullable<ORCIDWorksResponse[K]>;
          },
        ),
      ).toEqual({
        lastModifiedDate: '1594690575911',
        works: orcidWorksDeserialisedExpectation,
      });
    });

    test('Should handle null publication date', async () => {
      const orcidWorksResponseNoPublicationDate = getOrcidWorksResponse();
      orcidWorksResponseNoPublicationDate.group[0]['work-summary'][0][
        'publication-date'
      ] = null;

      const result = await transformOrcidWorks(
        orcidWorksResponseNoPublicationDate as {
          [K in keyof ORCIDWorksResponse]: NonNullable<ORCIDWorksResponse[K]>;
        },
      );
      expect(result.works[0].publicationDate).toEqual({});
    });
  });

  describe('isValidOrcidResponse type guard', () => {
    test('Should recognise a non-nullable ORCID works response', () => {
      expect(isValidOrcidResponse(getOrcidWorksResponse())).toBe(true);
    });
  });
});

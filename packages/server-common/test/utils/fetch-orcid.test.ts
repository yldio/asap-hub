import nock from 'nock';
import {
  fetchOrcidProfile,
  isValidOrcidFormat,
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

  describe('isValidOrcidFormat', () => {
    test('Should return true for valid ORCID with numeric checksum', () => {
      expect(isValidOrcidFormat('0000-0000-0000-0000')).toBe(true);
      expect(isValidOrcidFormat('1234-5678-9012-3456')).toBe(true);
    });

    test('Should return true for valid ORCID with X checksum', () => {
      expect(isValidOrcidFormat('0000-0000-0000-000X')).toBe(true);
      expect(isValidOrcidFormat('1234-5678-9012-345X')).toBe(true);
    });

    test('Should return false for invalid ORCID formats', () => {
      expect(isValidOrcidFormat(undefined)).toBe(false);
      expect(isValidOrcidFormat('')).toBe(false);
      expect(isValidOrcidFormat('-')).toBe(false);
      expect(isValidOrcidFormat('0000-0000-0000-000')).toBe(false); // too short
      expect(isValidOrcidFormat('0000-0000-0000-00000')).toBe(false); // too long
      expect(isValidOrcidFormat('0000-0000-0000-000x')).toBe(false); // lowercase x
      expect(isValidOrcidFormat('0000-0000-000-0000')).toBe(false); // wrong group size
      expect(isValidOrcidFormat('0000-0000-0000-00XX')).toBe(false); // multiple X
      expect(isValidOrcidFormat('0000-0000-0000-X000')).toBe(false); // X in wrong position
    });
  });

  describe('isValidOrcidResponse type guard', () => {
    test('Should recognise a non-nullable ORCID works response', () => {
      expect(isValidOrcidResponse(getOrcidWorksResponse())).toBe(true);
    });
  });
});

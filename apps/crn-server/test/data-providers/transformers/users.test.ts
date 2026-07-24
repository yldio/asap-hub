import {
  OrcidWorkCMS,
  parseAwardsCollection,
  parseOrcidWorkFromCMS,
} from '../../../src/data-providers/transformers';

describe('parseOrcidWorkFromCMS', () => {
  const getOrcidWorks = (): OrcidWorkCMS => ({
    doi: 'test-doi',
    id: '123-456-789',
    lastModifiedDate: '2020-10-26T15:33:18Z',
    publicationDate: {
      day: '1',
      month: '1',
      year: '2020',
    },
    type: 'ANNOTATION',
    title: 'orcid work title',
  });
  test('Should parse ORCID data from CMS', () => {
    expect(parseOrcidWorkFromCMS(getOrcidWorks())).toEqual({
      doi: 'test-doi',
      id: '123-456-789',
      lastModifiedDate: '2020-10-26T15:33:18Z',
      publicationDate: { day: '1', month: '1', year: '2020' },
      title: 'orcid work title',
      type: 'ANNOTATION',
    });
  });

  test('Should parse ORCID data from CMS when publication date is missing', () => {
    const orcidWorks = getOrcidWorks();
    delete orcidWorks.publicationDate;
    expect(parseOrcidWorkFromCMS(orcidWorks).publicationDate).toEqual({});
  });

  test('Should parse ORCID data from CMS when title is missing', () => {
    const orcidWorks = getOrcidWorks();
    delete orcidWorks.title;
    expect(parseOrcidWorkFromCMS(orcidWorks).title).toBeUndefined();
  });
});

describe('parseAwardsCollection', () => {
  it('maps award entries to name, date and icon url', () => {
    expect(
      parseAwardsCollection({
        awardsCollection: {
          items: [
            {
              date: '2024-01-01',
              awardType: {
                name: 'Open Science Champion',
                icon: { url: 'https://example.com/badge.png' },
              },
            },
          ],
        },
      }),
    ).toEqual([
      {
        name: 'Open Science Champion',
        date: '2024-01-01',
        iconUrl: 'https://example.com/badge.png',
      },
    ]);
  });

  it('maps award entries to name, date and small icon url', () => {
    expect(
      parseAwardsCollection({
        awardsCollection: {
          items: [
            {
              date: '2024-01-01',
              awardType: {
                name: 'Open Science Champion',
                smallIcon: { url: 'https://example.com/small-badge.png' },
              },
            },
          ],
        },
      }),
    ).toEqual([
      {
        name: 'Open Science Champion',
        date: '2024-01-01',
        smallIconUrl: 'https://example.com/small-badge.png',
      },
    ]);
  });

  it('maps icon and smallIcon independently when both are present', () => {
    expect(
      parseAwardsCollection({
        awardsCollection: {
          items: [
            {
              date: '2024-01-01',
              awardType: {
                name: 'Open Science Champion',
                icon: { url: 'https://example.com/badge.png' },
                smallIcon: { url: 'https://example.com/small-badge.png' },
              },
            },
          ],
        },
      }),
    ).toEqual([
      {
        name: 'Open Science Champion',
        date: '2024-01-01',
        iconUrl: 'https://example.com/badge.png',
        smallIconUrl: 'https://example.com/small-badge.png',
      },
    ]);
  });

  it('returns an empty array when there is no awards collection', () => {
    expect(parseAwardsCollection({})).toEqual([]);
  });

  it('skips awards missing an award type name or a date', () => {
    expect(
      parseAwardsCollection({
        awardsCollection: {
          items: [
            null,
            { date: '2024-01-01', awardType: null },
            { date: null, awardType: { name: 'Open Science Champion' } },
            {
              date: '2024-02-01',
              awardType: { name: 'Open Science Champion', icon: null },
            },
          ],
        },
      }),
    ).toEqual([
      {
        name: 'Open Science Champion',
        date: '2024-02-01',
        iconUrl: undefined,
      },
    ]);
  });
});

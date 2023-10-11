import {
  OrcidWorkCMS,
  parseOrcidWorkFromCMS,
} from '../../../src/data-providers/transformers/users';

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

  test('Should parse ORCID data from CMS when type is unknown', () => {
    const orcidWorks = getOrcidWorks();
    orcidWorks.type = 'some-type';
    expect(parseOrcidWorkFromCMS(orcidWorks).type).toBe('UNDEFINED');
  });

  test('Should parse ORCID data from CMS when the publicationDate is not defined', () => {
    const orcidWorks = getOrcidWorks();
    orcidWorks.publicationDate = undefined;
    expect(parseOrcidWorkFromCMS(orcidWorks).publicationDate).toEqual({});
  });
});

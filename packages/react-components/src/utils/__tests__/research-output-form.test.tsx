import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  researchOutputDocumentTypes,
  ResearchOutputIdentifierType,
} from '@asap-hub/model';
import {
  getDecision,
  getIdentifierType,
  getPublishDate,
  getPayload,
  ResearchOutputPayload,
} from '../research-output-form';

describe('getPublishDate', () => {
  const dateString = new Date().toString();
  it('returns a new date if date string exists', () => {
    expect(getPublishDate(dateString)).toBeInstanceOf(Date);
  });
  it('returns undefined if no date string is present', () => {
    expect(getPublishDate()).toBeUndefined();
  });
});

describe('getDecision', () => {
  it('returns yes for true', () => {
    expect(getDecision(true)).toEqual('Yes');
  });
  it('returns no for false', () => {
    expect(getDecision(false)).toEqual('No');
  });
  it('returns not sure for undefined', () => {
    expect(getDecision()).toEqual('Not Sure');
  });
});

describe('getIdentifierType', () => {
  it('returns DOI when doi is present', () => {
    expect(
      getIdentifierType({
        ...createResearchOutputResponse(),
        doi: 'abc',
      }),
    ).toEqual('DOI');
  });
  it('returns RRID when rrid is present', () => {
    expect(
      getIdentifierType({
        ...createResearchOutputResponse(),
        rrid: 'abc',
      }),
    ).toEqual('RRID');
  });
  it('returns Accession Number when accession is present', () => {
    expect(
      getIdentifierType({
        ...createResearchOutputResponse(),
        accession: 'abc',
      }),
    ).toEqual('Accession Number');
  });
  it('returns empty for create mode', () => {
    expect(getIdentifierType()).toEqual(ResearchOutputIdentifierType.Empty);
  });
  it('return none for edit mode', () => {
    expect(
      getIdentifierType({
        ...createResearchOutputResponse(),
        accession: '',
        rrid: '',
        doi: '',
      }),
    ).toEqual(ResearchOutputIdentifierType.None);
  });
});
describe('getResearchOutputPayload', () => {
  it('returns the correct modified value', () => {
    const currentPayload: ResearchOutputPayload = {
      identifierType: ResearchOutputIdentifierType.Empty,
      identifier: '',
      documentType: researchOutputDocumentTypes[6],
      tags: [],
      link: 'https://www.google.com',
      description: 'description',
      title: 'title',
      type: 'Preprint',
      authors: [{ value: 'a111', label: 'a111' }],
      labs: [{ value: 'l99', label: 'l99' }],
      teams: [{ value: 't99', label: 't99' }],
      usageNotes: 'usage notes',
      asapFunded: getDecision(true),
      usedInPublication: getDecision(true),
      sharingStatus: 'Public',
      publishDate: new Date('2020-01-01'),
      labCatalogNumber: undefined,
      methods: [],
      organisms: [],
      environments: [],
      keywords: [],
      relatedResearch: [
        {
          value: 'r99',
          label: 'r99',
          type: '3D Printing',
          documentType: 'Grant Document',
        },
      ],
      subtype: 'Preclinical',
    };
    expect(
      getPayload({
        ...currentPayload,
      }),
    ).toEqual({
      ...currentPayload,
      workingGroups: [],
      teams: ['t99'],
      labs: ['l99'],
      authors: [{ externalAuthorName: 'a111' }],
      asapFunded: true,
      usedInPublication: true,
      publishDate: new Date('2020-01-01').toISOString(),
      identifierType: undefined,
      identifier: undefined,
      relatedResearch: ['r99'],
    });
  });
});

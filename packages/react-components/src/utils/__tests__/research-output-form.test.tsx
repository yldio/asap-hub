import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  researchOutputDocumentTypes,
  ResearchOutputIdentifierType,
  ResearchOutputResponse,
} from '@asap-hub/model';
import {
  getDecision,
  getIdentifierType,
  getOwnRelatedResearchLinks,
  getPayload,
  getPostAuthors,
  getPublishDate,
  ResearchOutputPayload,
  transformResearchOutputResponseToRequest,
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
      link: 'https://www.google.com',
      description: 'description',
      descriptionMD: 'description MD',
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
      relatedEvents: [],
      relatedResearch: [
        {
          value: 'r99',
          label: 'r99',
          type: '3D Printing',
          documentType: 'Grant Document',
        },
      ],
      subtype: 'Preclinical',
      published: true,
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
describe('getOwnRelatedResearchLinks', () => {
  it('returns empty array', () => {
    expect(getOwnRelatedResearchLinks([])).toEqual([]);
  });
  it('returns own related research links', () => {
    expect(
      getOwnRelatedResearchLinks([
        {
          id: 'r1',
          title: 'r1',
          type: '3D Printing',
          documentType: 'Grant Document',
          teams: [],
          isOwnRelatedResearchLink: true,
        },
        {
          id: 'r2',
          title: 'r2',
          type: '3D Printing',
          documentType: 'Grant Document',
          teams: [],
          isOwnRelatedResearchLink: false,
        },
      ]),
    ).toEqual([
      {
        label: 'r1',
        value: 'r1',
        type: '3D Printing',
        documentType: 'Grant Document',
      },
    ]);
  });
});

describe('transformResearchOutputResponseToRequest', () => {
  it('transforms a research output response to a research output put request', () => {
    const researchOutputResponse: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      usageNotes: 'usage notes',
      link: 'https://www.google.com',
      asapFunded: true,
      id: 'tavi',
      usedInPublication: true,
      publishDate: new Date('2020-01-01').toISOString(),
      labCatalogNumber: '123',
      labs: [{ id: 'l99', name: 'l99' }],
      reviewRequestedBy: { id: 'u99', firstName: 'u99', lastName: 'uu99' },
      relatedResearch: [
        {
          id: 'r99',
          title: 'r99',
          type: '3D Printing',
          documentType: 'Grant Document',
          teams: [],
        },
      ],
      relatedEvents: [
        {
          endDate: new Date('2020-01-01').toISOString(),
          id: 'e99',
          title: 'title e999',
        },
      ],
    };
    expect(
      transformResearchOutputResponseToRequest(researchOutputResponse),
    ).toEqual({
      documentType: researchOutputResponse.documentType,
      link: researchOutputResponse.link,
      description: researchOutputResponse.description,
      title: researchOutputResponse.title,
      type: researchOutputResponse.type,
      usageNotes: researchOutputResponse.usageNotes,
      asapFunded: researchOutputResponse.asapFunded,
      usedInPublication: researchOutputResponse.usedInPublication,
      sharingStatus: researchOutputResponse.sharingStatus,
      publishDate: researchOutputResponse.publishDate,
      labCatalogNumber: researchOutputResponse.labCatalogNumber,
      methods: researchOutputResponse.methods,
      organisms: researchOutputResponse.organisms,
      environments: researchOutputResponse.environments,
      subtype: researchOutputResponse.subtype,
      keywords: researchOutputResponse.keywords,
      published: researchOutputResponse.published,
      authors: getPostAuthors(
        researchOutputResponse.authors.map((author) => ({
          author,
          value: author.id,
          label: author.displayName,
        })),
      ),
      descriptionMD: researchOutputResponse.descriptionMD || '',
      labs: researchOutputResponse.labs.map(({ id }) => id),
      teams: researchOutputResponse.teams.map((team) => team.id),
      workingGroups: researchOutputResponse.workingGroups
        ? researchOutputResponse.workingGroups.map((wg) => wg.id)
        : [],
      relatedResearch: researchOutputResponse.relatedResearch.map(
        (research) => research.id,
      ),
      relatedEvents: researchOutputResponse.relatedEvents.map(
        (event) => event.id,
      ),
      reviewRequestedById: researchOutputResponse.reviewRequestedBy
        ? researchOutputResponse.reviewRequestedBy.id
        : undefined,
    });
  });
});

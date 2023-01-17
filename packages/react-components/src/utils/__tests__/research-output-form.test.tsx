import {
  createResearchOutputResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import {
  researchOutputDocumentTypes,
  ResearchOutputIdentifierType,
} from '@asap-hub/model';
import {
  getDecision,
  getIdentifierType,
  getPublishDate,
  getPayload,
  getTeamsState,
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

describe('getTeamsState', () => {
  it('returns the default team for a publishing entity of type team without RO data', () => {
    const team = { ...createTeamResponse(), displayName: 'team-1' };
    expect(
      getTeamsState({
        team,
        publishingEntity: 'Team',
        researchOutputData: undefined,
      }),
    ).toEqual([
      {
        label: team.displayName,
        value: team.id,
        isFixed: true,
      },
    ]);
  });
  it('returns an empty array for a publishing entity of type working group', () => {
    expect(
      getTeamsState({
        team: createTeamResponse(),
        publishingEntity: 'Working Group',
        researchOutputData: undefined,
      }),
    ).toEqual([]);
  });
  it('returns an array of teams when there is research output data', () => {
    const team1 = { ...createTeamResponse(), displayName: 'team1' };
    const team2 = { ...createTeamResponse(), displayName: 'team2' };
    expect(
      getTeamsState({
        team: createTeamResponse(),
        publishingEntity: 'Team',
        researchOutputData: {
          ...createResearchOutputResponse(),
          teams: [team1, team2],
        },
      }),
    ).toEqual([
      {
        label: team1.displayName,
        value: team1.id,
        isFixed: true,
      },
      {
        label: team2.displayName,
        value: team2.id,
        isFixed: true,
      },
    ]);
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
      subtype: 'Preclinical',
      publishingEntity: 'Team',
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
    });
  });
});

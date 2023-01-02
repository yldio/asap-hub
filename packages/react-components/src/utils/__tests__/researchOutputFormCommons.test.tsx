import {
  createResearchOutputResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import {
  researchOutputDocumentTypes,
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
} from '@asap-hub/model';
import {
  getDecision,
  getIdentifierType,
  getPublishDate,
  getResearchOutputState,
  getTeamsState,
  isDirty,
  isIdentifierModified,
  ResearchOutputTeamState,
} from '../researchOutputFormCommons';

describe('isDirty', () => {
  const researchOutputResponse: ResearchOutputResponse = {
    ...createResearchOutputResponse(),
    labs: [{ id: '1', name: 'Lab 1' }],
  };

  const initialState: ResearchOutputPostRequest = {
    documentType: 'Article',
    title: researchOutputResponse.title,
    description: researchOutputResponse.description,
    link: researchOutputResponse.link,
    type: researchOutputResponse.type!,
    tags: researchOutputResponse.tags,
    methods: researchOutputResponse.methods,
    organisms: researchOutputResponse.organisms,
    environments: researchOutputResponse.environments,
    teams: ['Team-0', 'Team-1'],
    labs: ['Lab-0', 'Lab-1'],
    authors: [{ userId: 'User-0' }],
    subtype: researchOutputResponse.subtype,
    labCatalogNumber: researchOutputResponse.labCatalogNumber,
    publishDate: researchOutputResponse.publishDate,
    asapFunded: researchOutputResponse.asapFunded,
    usedInPublication: researchOutputResponse.usedInPublication,
    sharingStatus: 'Network Only',
    publishingEntity: 'Team',
  };

  const currentState = { ...initialState };

  it('returns true for edit mode when teams are in diff order', () => {
    expect(
      isDirty(
        {
          ...initialState,
          teams: ['Team-0', 'Team-1'],
        },
        {
          ...initialState,
          teams: ['Team-1', 'Team-0'],
        },
      ),
    ).toBeTruthy();
  });

  it('returns false when values are not changed', () => {
    expect(isDirty(initialState, initialState)).toBeFalsy();
  });

  it('returns true when the initial values are changed', () => {
    expect(
      isDirty(initialState, {
        ...initialState,
        title: 'changed',
      }),
    ).toBeTruthy();
  });

  it('returns false when the identifier is absent', () => {
    expect(isIdentifierModified(researchOutputResponse)).toBeFalsy();
  });

  it('returns false when the identifier is equal to initial identifier', () => {
    expect(
      isIdentifierModified(
        { ...researchOutputResponse, doi: '12.1234' },
        '12.1234',
      ),
    ).toBeFalsy();
  });

  it('returns true when the identifier is not equal to initial identifier', () => {
    expect(
      isIdentifierModified(
        { ...researchOutputResponse, doi: '12.1234' },
        '12.5555',
      ),
    ).toBeTruthy();
  });

  it.each`
    key                   | value
    ${'title'}            | ${'Output 1 changed'}
    ${'description'}      | ${'new changed description'}
    ${'link'}             | ${'https://changed.com'}
    ${'type'}             | ${'Data set'}
    ${'tags'}             | ${['changed tag']}
    ${'methods'}          | ${['Activity Assay']}
    ${'organisms'}        | ${['Rat']}
    ${'teams'}            | ${['In Vivo']}
    ${'environments'}     | ${[{ label: 'team1', value: 't99' }]}
    ${'authors'}          | ${[{ label: 'author1', value: 'a111' }]}
    ${'subtype'}          | ${'Postmortem'}
    ${'labCatalogNumber'} | ${'1'}
    ${'labs'}             | ${['Asap Lab']}
    ${'identifierType'}   | ${'RRID'}
    ${'rrid'}             | ${'101994'}
  `(
    'Return true when $key is changed to $value and differs from the initial one',
    async ({
      key,
      value,
    }: {
      key: keyof ResearchOutputPostRequest;
      value: never;
    }) => {
      currentState[key] = value;
      expect(isDirty(initialState, currentState)).toBeTruthy();
    },
  );
});

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

describe('getResearchOutputState', () => {
  it('returns the correct modified value', () => {
    const currentState: ResearchOutputTeamState = {
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
      getResearchOutputState({
        ...currentState,
      }),
    ).toEqual({
      ...currentState,
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

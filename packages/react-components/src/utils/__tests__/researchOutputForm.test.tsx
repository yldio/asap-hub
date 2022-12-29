import {
  createResearchOutputResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import {
  ResearchOutputIdentifierType,
  ResearchOutputResponse,
} from '@asap-hub/model';
import {
  getDecision,
  getIdentifierType,
  getInitialState,
  getPublishDate,
  getTeamsState,
  isDirty,
  isIdentifierModified,
  ResearchOutputState,
} from '../researchOutputForm';

describe('isDirty', () => {
  const researchOutputResponse: ResearchOutputResponse = {
    ...createResearchOutputResponse(),
    labs: [{ id: '1', name: 'Lab 1' }],
  };
  const researchOutputState: ResearchOutputState = {
    title: researchOutputResponse.title,
    description: researchOutputResponse.description,
    link: researchOutputResponse.link,
    type: researchOutputResponse.type!,
    tags: researchOutputResponse.tags,
    methods: researchOutputResponse.methods,
    organisms: researchOutputResponse.organisms,
    environments: researchOutputResponse.environments,
    teams: researchOutputResponse?.teams.map((element, index) => ({
      label: element.displayName,
      value: element.id,
      isFixed: index === 0,
    })),
    labs: researchOutputResponse?.labs.map((lab) => ({
      value: lab.id,
      label: lab.name,
    })),
    authors: researchOutputResponse?.authors.map((author) => ({
      value: author.id,
      label: author.displayName,
      user: author,
    })),
    subtype: researchOutputResponse.subtype,
    labCatalogNumber: researchOutputResponse.labCatalogNumber,
    identifierType: ResearchOutputIdentifierType.Empty,
    publishDate: getPublishDate(researchOutputResponse.publishDate),
    asapFunded: getDecision(researchOutputResponse.asapFunded),
    usedInPublication: getDecision(researchOutputResponse.usedInPublication),
  };

  const initialState = { ...researchOutputState };

  it('returns true for edit mode when teams are in diff order', () => {
    expect(
      isDirty(
        {
          ...researchOutputState,
          teams: [
            { value: 't0', label: 'team-0' },
            { value: 't1', label: 'team-1' },
          ],
        },
        {
          ...researchOutputState,
          teams: [
            { value: 't1', label: 'team-1' },
            { value: 't0', label: 'team-0' },
          ],
        },
      ),
    ).toBeTruthy();
  });

  it('returns false for edit mode when values equal the initial ones', () => {
    expect(
      isDirty(
        getInitialState(
          researchOutputResponse,
          createTeamResponse(),
          'Team',
          true,
        ),
        {
          ...researchOutputState,
          identifierType: ResearchOutputIdentifierType.None,
        },
      ),
    ).toBeFalsy();
  });

  it('returns true when the initial values are changed', () => {
    expect(
      isDirty(researchOutputState, {
        ...researchOutputState,
        title: 'changed',
      }),
    ).toBeTruthy();
  });

  it('returns false when the initial values are unchanged for publishing entity team', () => {
    expect(isDirty(researchOutputState, researchOutputState)).toBeFalsy();
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
    async ({ key, value }) => {
      const payloadKey: keyof typeof researchOutputState = key;
      // @ts-ignore
      researchOutputState[payloadKey] = value;
      expect(isDirty(initialState, researchOutputState)).toBeTruthy();
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
      getIdentifierType(true, {
        ...createResearchOutputResponse(),
        doi: 'abc',
      }),
    ).toEqual('DOI');
  });
  it('returns RRID when rrid is present', () => {
    expect(
      getIdentifierType(true, {
        ...createResearchOutputResponse(),
        rrid: 'abc',
      }),
    ).toEqual('RRID');
  });
  it('returns Accession Number when accession is present', () => {
    expect(
      getIdentifierType(true, {
        ...createResearchOutputResponse(),
        accession: 'abc',
      }),
    ).toEqual('Accession Number');
  });
  it.each`
    isEditMode | description | expected
    ${false}   | ${'empty'}  | ${ResearchOutputIdentifierType.Empty}
    ${true}    | ${'none'}   | ${ResearchOutputIdentifierType.None}
  `(
    'returns $description when there is no identifier present',
    ({ isEditMode, expected }) => {
      expect(
        getIdentifierType(isEditMode, {
          ...createResearchOutputResponse(),
          accession: '',
          rrid: '',
          doi: '',
        }),
      ).toEqual(expected);
    },
  );
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

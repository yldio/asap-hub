import {
  Author,
  checkDifferentTeams,
  checkSameTeamDifferentLab,
  EntityWithId,
  findMatchingAuthors,
  getCollaborationCounts,
} from '../../../src/utils/analytics/collaboration';

describe('checkDifferentTeams', () => {
  const referenceTeam = {
    sys: { id: 'referenceTeam' },
  };

  it('returns true if no team is the same as the reference team', () => {
    const testTeams = [{ sys: { id: 'team-a' } }, { sys: { id: 'team-b' } }];
    expect(checkDifferentTeams(referenceTeam, testTeams)).toBe(true);
  });

  it('returns false if at least one team is the same as the reference team', () => {
    const testTeams = [
      { sys: { id: 'team-a' } },
      { sys: { id: 'team-b' } },
      referenceTeam,
    ];
    expect(checkDifferentTeams(referenceTeam, testTeams)).toBe(false);
  });
});

describe('checkSameTeamDifferentLab', () => {
  const referenceTeam = {
    sys: { id: 'referenceTeam' },
  };

  const referenceLabs = [
    {
      sys: { id: 'lab-1' },
    },
    {
      sys: { id: 'lab-2' },
    },
  ];

  it('returns false if no team is the same as the reference team', () => {
    const testAuthor = {
      id: 'id',
      teams: [{ sys: { id: 'team-a' } }, { sys: { id: 'team-b' } }],
      labs: [],
    };
    expect(checkSameTeamDifferentLab(referenceTeam, [], testAuthor)).toBe(
      false,
    );
  });

  it('returns false if one team is the same but at least one lab is the same', () => {
    const testAuthor = {
      id: 'id',
      teams: [referenceTeam, { sys: { id: 'team-b' } }],
      labs: [
        {
          sys: { id: 'lab-2' },
        },
      ],
    };
    expect(
      checkSameTeamDifferentLab(referenceTeam, referenceLabs, testAuthor),
    ).toBe(false);
  });

  it('returns true if one team is the same and no lab is the same', () => {
    const testAuthor = {
      id: 'id',
      teams: [referenceTeam, { sys: { id: 'team-b' } }],
      labs: [
        {
          sys: { id: 'lab-3' },
        },
      ],
    };
    expect(
      checkSameTeamDifferentLab(referenceTeam, referenceLabs, testAuthor),
    ).toBe(true);
  });
});

describe('findMatchingAuthors', () => {
  const referenceId = 'reference-id';
  const referenceLabs: EntityWithId[] = [];
  const referenceTeam = { sys: { id: 'reference-team' } };
  const referenceLab = { sys: { id: 'reference-lab' } };
  const authorList: Author[] = [];

  const defaultData = {
    referenceId,
    referenceLabs,
    referenceTeam,
    authorList,
  };

  it('returns correct flags when there is no authors', () => {
    expect(findMatchingAuthors(defaultData)).toEqual({
      differentTeamFlag: false,
      sameTeamDifferentLabFlag: false,
    });
  });

  it('returns correct flags when no matching author is found', () => {
    const data = {
      ...defaultData,
      referenceLabs: [referenceLab],
      authorList: [
        {
          id: 'id',
          teams: [referenceTeam, { sys: { id: 'team-b' } }],
          labs: [referenceLab],
        },
      ],
    };

    expect(findMatchingAuthors(data)).toEqual({
      differentTeamFlag: false,
      sameTeamDifferentLabFlag: false,
    });
  });

  it('returns differentTeamFlag true when appropriate author is found', () => {
    const data = {
      ...defaultData,
      referenceLabs: [referenceLab],
      authorList: [
        {
          id: 'id',
          teams: [{ sys: { id: 'team-b' } }],
          labs: [referenceLab],
        },
      ],
    };

    expect(findMatchingAuthors(data)).toEqual({
      differentTeamFlag: true,
      sameTeamDifferentLabFlag: false,
    });
  });

  it('returns sameTeamDifferentLabFlag true when appropriate author is found', () => {
    const data = {
      ...defaultData,
      referenceLabs: [referenceLab],
      authorList: [
        {
          id: 'id',
          teams: [referenceTeam, { sys: { id: 'team-b' } }],
          labs: [{ sys: { id: 'lab-b' } }],
        },
      ],
    };

    expect(findMatchingAuthors(data)).toEqual({
      differentTeamFlag: false,
      sameTeamDifferentLabFlag: true,
    });
  });
});

describe('getCollaborationCounts', () => {
  const flags = (
    differentTeamFlag: boolean,
    sameTeamDifferentLabFlag: boolean,
  ) => ({
    differentTeamFlag,
    sameTeamDifferentLabFlag,
  });

  it('sums each collaboration count properly', () => {
    const data = [flags(false, false), flags(true, false), flags(false, true)];
    expect(getCollaborationCounts(data)).toEqual({
      acrossTeamCount: 1,
      withinTeamCount: 1,
    });
  });
});

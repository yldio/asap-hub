import { FetchUserCoproductionQuery } from '@asap-hub/contentful';
import {
  Author,
  checkDifferentTeams,
  checkSameTeamDifferentLab,
  EntityWithId,
  findMatchingAuthors,
  getCollaborationCounts,
  getUserCoProductionItems,
} from '../../../src/utils/analytics/collaboration';

describe('checkDifferentTeams', () => {
  const referenceTeams = [
    {
      sys: { id: 'referenceTeam' },
    },
  ];

  it('returns true if no team is the same as the reference team', () => {
    const testTeams = [{ sys: { id: 'team-a' } }, { sys: { id: 'team-b' } }];
    expect(checkDifferentTeams(referenceTeams, testTeams)).toBe(true);
  });

  it('returns false if at least one team is the same as the reference team', () => {
    const testTeams = [
      { sys: { id: 'team-a' } },
      { sys: { id: 'team-b' } },
      { sys: { id: 'referenceTeam' } },
    ];
    expect(checkDifferentTeams(referenceTeams, testTeams)).toBe(false);
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
  const referenceTeams = [referenceTeam];
  const referenceLab = { sys: { id: 'reference-lab' } };

  const referenceAuthor: Author = {
    id: referenceId,
    labs: [referenceLab],
    teams: referenceTeams,
  };

  const authorList: Author[] = [referenceAuthor];

  const defaultData = {
    referenceId,
    referenceLabs,
    referenceTeam,
    referenceTeams,
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
        ...authorList,
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
        ...authorList,
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
        ...authorList,
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

  it('returns both flag false if refence author is not an actual author', () => {
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
      sameTeamDifferentLabFlag: false,
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

describe('getUserCoProductionItems ', () => {
  it('skips external authors', () => {
    const data: FetchUserCoproductionQuery['usersCollection'] = {
      items: [
        {
          sys: { id: '1' },
          firstName: 'John',
          lastName: 'Foo',
          teamsCollection: {
            items: [{ team: { sys: { id: '1' } } }],
          },
          linkedFrom: {
            researchOutputsCollection: {
              items: [
                {
                  authorsCollection: {
                    items: [{ __typename: 'ExternalAuthors' }],
                  },
                },
              ],
            },
          },
        },
      ],
      total: 0,
    };

    expect(getUserCoProductionItems(data)[0]?.teams[0]).toEqual(
      expect.objectContaining({
        outputsCoAuthoredAcrossTeams: 0,
        outputsCoAuthoredWithinTeam: 0,
      }),
    );
  });
  describe('across teams', () => {
    it('if authors do not share a single team, this should count as 1', () => {
      const data: FetchUserCoproductionQuery['usersCollection'] = {
        items: [
          {
            sys: { id: 'user-A' },
            firstName: 'User',
            lastName: 'A',
            teamsCollection: {
              items: [{ team: { sys: { id: 'team-1' } } }],
            },
            linkedFrom: {
              researchOutputsCollection: {
                items: [
                  {
                    authorsCollection: {
                      items: [
                        {
                          __typename: 'Users',
                          sys: { id: 'user-B' },
                          teamsCollection: {
                            items: [{ sys: { id: 'team-2' } }],
                          },
                        },
                        {
                          __typename: 'Users',
                          sys: { id: 'user-A' },
                          teamsCollection: {
                            items: [{ sys: { id: 'team-1' } }],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        ],
        total: 0,
      };

      expect(getUserCoProductionItems(data)[0]?.teams[0]).toEqual(
        expect.objectContaining({
          outputsCoAuthoredAcrossTeams: 1,
          outputsCoAuthoredWithinTeam: 0,
        }),
      );
    });

    it('if authors belong to the same team this should not count', () => {
      const data: FetchUserCoproductionQuery['usersCollection'] = {
        items: [
          {
            sys: { id: 'user-A' },
            firstName: 'User',
            lastName: 'A',
            teamsCollection: {
              items: [{ team: { sys: { id: 'team-1' } } }],
            },
            labsCollection: {
              items: [{ sys: { id: 'lab-1' } }],
            },
            linkedFrom: {
              researchOutputsCollection: {
                items: [
                  {
                    authorsCollection: {
                      items: [
                        {
                          __typename: 'Users',
                          sys: { id: 'user-B' },
                          teamsCollection: {
                            items: [{ sys: { id: 'team-1' } }],
                          },
                          labsCollection: {
                            items: [{ sys: { id: 'lab-1' } }],
                          },
                        },
                        {
                          __typename: 'Users',
                          sys: { id: 'user-A' },
                          teamsCollection: {
                            items: [{ sys: { id: 'team-1' } }],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        ],
        total: 0,
      };

      expect(getUserCoProductionItems(data)[0]?.teams[0]).toEqual(
        expect.objectContaining({
          outputsCoAuthoredAcrossTeams: 0,
          outputsCoAuthoredWithinTeam: 0,
        }),
      );
    });
  });
  describe('within teams', () => {
    it('if authors are in the same team but do not share lab, this should count as 1', () => {
      const data: FetchUserCoproductionQuery['usersCollection'] = {
        items: [
          {
            sys: { id: 'user-A' },
            firstName: 'User',
            lastName: 'A',
            teamsCollection: {
              items: [{ team: { sys: { id: 'team-1' } } }],
            },
            labsCollection: {
              items: [{ sys: { id: 'lab-1' } }],
            },
            linkedFrom: {
              researchOutputsCollection: {
                items: [
                  {
                    authorsCollection: {
                      items: [
                        {
                          __typename: 'Users',
                          sys: { id: 'user-B' },
                          teamsCollection: {
                            items: [{ sys: { id: 'team-1' } }],
                          },
                          labsCollection: {
                            items: [{ sys: { id: 'lab-2' } }],
                          },
                        },
                        {
                          __typename: 'Users',
                          sys: { id: 'user-A' },
                          teamsCollection: {
                            items: [{ sys: { id: 'team-1' } }],
                          },
                          labsCollection: {
                            items: [{ sys: { id: 'lab-1' } }],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        ],
        total: 0,
      };

      expect(getUserCoProductionItems(data)[0]?.teams[0]).toEqual(
        expect.objectContaining({
          outputsCoAuthoredAcrossTeams: 0,
          outputsCoAuthoredWithinTeam: 1,
        }),
      );
    });

    it('if authors belong to the same team and share a lab this should not count', () => {
      const data: FetchUserCoproductionQuery['usersCollection'] = {
        items: [
          {
            sys: { id: 'user-A' },
            firstName: 'User',
            lastName: 'A',
            teamsCollection: {
              items: [{ team: { sys: { id: 'team-1' } } }],
            },
            labsCollection: {
              items: [{ sys: { id: 'lab-1' } }],
            },
            linkedFrom: {
              researchOutputsCollection: {
                items: [
                  {
                    authorsCollection: {
                      items: [
                        {
                          __typename: 'Users',
                          sys: { id: 'user-B' },
                          teamsCollection: {
                            items: [{ sys: { id: 'team-1' } }],
                          },
                          labsCollection: {
                            items: [{ sys: { id: 'lab-1' } }],
                          },
                        },
                        {
                          __typename: 'Users',
                          sys: { id: 'user-A' },
                          teamsCollection: {
                            items: [{ sys: { id: 'team-1' } }],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        ],
        total: 0,
      };

      expect(getUserCoProductionItems(data)[0]?.teams[0]).toEqual(
        expect.objectContaining({
          outputsCoAuthoredAcrossTeams: 0,
          outputsCoAuthoredWithinTeam: 0,
        }),
      );
    });
  });
});

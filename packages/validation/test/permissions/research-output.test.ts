import {
  hasCreateUpdateResearchOutputPermissions,
  hasWorkingGroupsCreateUpdateResearchOutputPermissions,
  isUserProjectManagerOfTeams,
  isUserProjectManagerOfWorkingGroups,
  getUserPermissions,
  noPermissions,
} from '../../src/permissions/research-output';
import {
  createResearchOutputResponse,
  createUserResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';

describe('hasCreateUpdateResearchOutputPermissions', () => {
  test('Should not have permissions when there are no teams assigned to the user', () => {
    expect(
      hasCreateUpdateResearchOutputPermissions(
        {
          ...createUserResponse(),
          teams: [],
        },
        ['team-1', 'team-2'],
      ),
    ).toEqual(false);
  });

  test('Should have the permission when the user has a Project Manager role inside the team that this resource belongs to', () => {
    expect(
      hasCreateUpdateResearchOutputPermissions(
        {
          ...createUserResponse(),
          teams: [
            {
              id: 'team-1',
              role: 'Lead PI (Core Leadership)',
              displayName: 'Team A',
              proposal: 'proposalId1',
            },
          ],
        },
        ['team-1', 'team-2'],
      ),
    ).toEqual(false);
  });

  test('Should have the permission when the user has a Project Manager role inside the team that this resource belongs to', () => {
    expect(
      hasCreateUpdateResearchOutputPermissions(
        {
          ...createUserResponse(),
          teams: [
            {
              id: 'team-1',
              role: 'Project Manager',
              displayName: 'Team A',
              proposal: 'proposalId1',
            },
          ],
        },
        ['team-1', 'team-2'],
      ),
    ).toEqual(true);
  });

  test('Should have the permissions when the user has a Staff role in any team', () => {
    expect(
      hasCreateUpdateResearchOutputPermissions(
        {
          ...createUserResponse(),
          teams: [
            {
              id: 'team-id-3',
              role: 'ASAP Staff',
              displayName: 'Team A',
              proposal: 'proposalId1',
            },
          ],
        },
        ['team-1', 'team-2'],
      ),
    ).toEqual(true);
  });
});

describe('hasWorkingGroupsCreateUpdateResearchOutputPermissions', () => {
  test('Should not have permissions when there is no working group', () => {
    expect(
      hasWorkingGroupsCreateUpdateResearchOutputPermissions(
        {
          ...createUserResponse(),
          teams: [],
        },
        undefined,
      ),
    ).toEqual(false);
  });

  test('Should have the permission when the user has a Project Manager role inside the working group', () => {
    expect(
      hasWorkingGroupsCreateUpdateResearchOutputPermissions(
        {
          ...createUserResponse(),
          id: 'leader-1',
        },
        {
          ...createWorkingGroupResponse({}),
          leaders: [
            {
              user: {
                ...createUserResponse(),
                id: 'leader-1',
              },
              role: 'Project Manager',
              workstreamRole: 'Project Manager',
            },
          ],
        },
      ),
    ).toEqual(true);
  });

  test('Should not have the permission when the user has a role that differs from Project Manager', () => {
    expect(
      hasWorkingGroupsCreateUpdateResearchOutputPermissions(
        {
          ...createUserResponse(),
          id: 'leader-1',
        },
        {
          ...createWorkingGroupResponse({}),
          leaders: [
            {
              user: {
                ...createUserResponse(),
                id: 'not-leader-1',
              },
              role: 'Chair',
              workstreamRole: 'not a project manager',
            },
          ],
        },
      ),
    ).toEqual(false);
  });
});

describe('getUserPermissions', () => {
  test('Should not have permissions when there is no user data', () => {
    expect(getUserPermissions(null, createResearchOutputResponse())).toEqual(
      noPermissions,
    );
  });
  test('Should not have permissions when there is no research output data', () => {
    expect(getUserPermissions(createUserResponse(), undefined)).toEqual(
      noPermissions,
    );
  });
  test('Should not have permission if the user is not a project manager or asap staff', () => {
    expect(
      getUserPermissions(
        {
          ...createUserResponse(),
          teams: [
            {
              id: 'team-id-3',
              role: 'Project Manager',
              displayName: 'Team A',
              proposal: 'proposalId1',
            },
          ],
          workingGroups: [
            {
              id: 'wg-1',
              role: 'Member',
              active: true,
              name: 'wg A',
            },
          ],
        },
        {
          ...createResearchOutputResponse(),
          teams: [{ id: 'team-id-3', displayName: 'Team A' }],
          workingGroups: [{ id: 'wg-1', title: 'wg A' }],
        },
      ),
    ).toEqual(noPermissions);
  });
  test('Should have permission if the user is a project manager on a team', () => {
    expect(
      getUserPermissions(
        {
          ...createUserResponse(),
          teams: [
            {
              id: 'team-id-3',
              role: 'Project Manager',
              displayName: 'Team A',
              proposal: 'proposalId1',
            },
          ],
        },
        {
          ...createResearchOutputResponse(),
          teams: [{ id: 'team-id-3', displayName: 'Team A' }],
          workingGroups: undefined,
        },
      ),
    ).toEqual({
      createDraft: true,
      editDraft: true,
      publishDraft: true,
      editPublished: true,
    });
  });
  test('Should have permission if the user is a project manager on a working groups', () => {
    expect(
      getUserPermissions(
        {
          ...createUserResponse(),
          workingGroups: [
            {
              id: 'wg-1',
              role: 'Project Manager',
              active: true,
              name: 'wg A',
            },
          ],
        },
        {
          ...createResearchOutputResponse(),
          workingGroups: [{ id: 'wg-1', title: 'wg A' }],
        },
      ),
    ).toEqual({
      createDraft: true,
      editDraft: true,
      publishDraft: true,
      editPublished: true,
    });
  });
  test('Should have permission if the user is asap staff', () => {
    expect(
      getUserPermissions(
        {
          ...createUserResponse(),
          role: 'Staff',
          teams: [
            {
              id: 'team-id-3',
              role: 'Key Personnel',
              displayName: 'Team A',
              proposal: 'proposalId1',
            },
          ],
        },
        {
          ...createResearchOutputResponse(),
          teams: [{ id: 'team-id-3', displayName: 'Team A' }],
        },
      ),
    ).toEqual({
      createDraft: true,
      editDraft: true,
      publishDraft: true,
      editPublished: true,
    });
  });
});

describe('isUserProjectManagerOfTeams', () => {
  test('Should not have permissions when there are no teams assigned to the user', () => {
    expect(
      isUserProjectManagerOfTeams(
        {
          ...createUserResponse(),
          teams: [],
        },
        [
          {
            id: 'team-1',
            displayName: 'Team A',
          },
        ],
      ),
    ).toEqual(false);
  });
  test('Should not have permissions when the user is not a PM', () => {
    expect(
      isUserProjectManagerOfTeams(
        {
          ...createUserResponse(),
          teams: [
            {
              id: 'team-1',
              role: 'Key Personnel',
              displayName: 'Team A',
              proposal: 'proposalId1',
            },
          ],
        },
        [
          {
            id: 'team-1',
            displayName: 'Team A',
          },
        ],
      ),
    ).toEqual(false);
  });
  test('Should have the permission when the user has a Project Manager role inside the team', () => {
    expect(
      isUserProjectManagerOfTeams(
        {
          ...createUserResponse(),
          teams: [
            {
              id: 'team-1',
              role: 'Project Manager',
              displayName: 'Team A',
              proposal: 'proposalId1',
            },
          ],
        },
        [
          {
            id: 'team-1',
            displayName: 'Team A',
          },
        ],
      ),
    ).toEqual(true);
  });
});

describe('isUserProjectManagerOfWorkingGroups', () => {
  test('Should not have permissions when there are no working groups assigned to the user', () => {
    expect(
      isUserProjectManagerOfWorkingGroups(
        {
          ...createUserResponse(),
          workingGroups: [],
        },
        [
          {
            id: 'WG-1',
            title: 'WG A',
          },
        ],
      ),
    ).toEqual(false);
  });
  test('Should not have permissions when the user is not a PM', () => {
    expect(
      isUserProjectManagerOfWorkingGroups(
        {
          ...createUserResponse(),
          workingGroups: [
            {
              id: 'wg-1',
              role: 'Member',
              active: true,
              name: 'wg A',
            },
          ],
        },
        [
          {
            id: 'wg-1',
            title: 'wg A',
          },
        ],
      ),
    ).toEqual(false);
  });
  test('Should have the permission when the user has a Project Manager role inside the working group', () => {
    expect(
      isUserProjectManagerOfWorkingGroups(
        {
          ...createUserResponse(),
          workingGroups: [
            {
              id: 'wg-1',
              role: 'Project Manager',
              name: 'wg A',
              active: true,
            },
          ],
        },
        [
          {
            id: 'wg-1',
            title: 'wg A',
          },
        ],
      ),
    ).toEqual(true);
  });
});

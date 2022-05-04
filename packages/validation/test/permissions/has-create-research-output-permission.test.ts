import { hasCreateResearchOutputPermissions } from '../../src/permissions/has-create-research-output-permission';
import { createUserResponse } from '@asap-hub/fixtures';

describe('hasCreateResearchOutputPermission', () => {
  test('Should not have permissions when there are no teams assigned to the user', () => {
    expect(
      hasCreateResearchOutputPermissions(
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
      hasCreateResearchOutputPermissions(
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
      hasCreateResearchOutputPermissions(
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
      hasCreateResearchOutputPermissions(
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

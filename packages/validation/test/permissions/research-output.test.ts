import { hasCreateUpdateResearchOutputPermissions } from '../../src/permissions/research-output';
import { createUserResponse } from '@asap-hub/fixtures';

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

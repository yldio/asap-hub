import { hasCreateResearchOutputPermissions } from '../../src/permissions/has-create-research-output-permission';
import { createUserResponse } from '@asap-hub/fixtures';

describe('hasCreateResearchOutputPermission', () => {
  test('Should not has permission when there is no teams assigned to user', () => {
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

  test('Should not has permission when the user is not Project Manager in particular team', () => {
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

  test('Should has permission when the user is Project Manager in particular team', () => {
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

  test('Should has permission when the user is Staff in any team', () => {
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

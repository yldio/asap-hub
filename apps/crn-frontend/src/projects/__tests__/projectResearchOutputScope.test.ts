import { getProjectResearchOutputListScope } from '../projectResearchOutputScope';

describe('getProjectResearchOutputListScope', () => {
  it('filters by projectId for user-based projects', () => {
    expect(
      getProjectResearchOutputListScope({ projectId: 'project-1' }),
    ).toEqual({ projectId: 'project-1' });
  });

  it('filters by teamId for team-based projects', () => {
    expect(
      getProjectResearchOutputListScope({
        projectId: 'project-1',
        teamId: 'team-1',
      }),
    ).toEqual({ teamId: 'team-1' });
  });
});

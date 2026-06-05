import { createResearchOutputResponse } from '@asap-hub/fixtures';

import { researchOutputToProjectOutput } from '../researchOutputToProjectOutput';

describe('researchOutputToProjectOutput', () => {
  it('maps research output fields to project output shape', () => {
    const output = {
      ...createResearchOutputResponse(1),
      teams: [
        {
          id: 'team-1',
          displayName: 'Team 1',
          teamType: 'Discovery Team' as const,
        },
      ],
      project: {
        id: 'project-1',
        title: 'Discovery Project',
        projectType: 'Discovery Project' as const,
      },
      lastUpdatedPartial: '2024-01-02T00:00:00.000Z',
    };

    expect(researchOutputToProjectOutput(output)).toEqual(
      expect.objectContaining({
        id: output.id,
        title: output.title,
        lastModifiedDate: '2024-01-02T00:00:00.000Z',
        source: 'project',
        project: expect.objectContaining({
          id: 'project-1',
          href: expect.stringContaining('project-1'),
        }),
      }),
    );
  });

  it('uses team source when the output has no project link', () => {
    const output = {
      ...createResearchOutputResponse(2),
      teams: [{ id: 'team-1', displayName: 'Team 1' }],
      workingGroups: undefined,
      project: undefined,
    };

    expect(researchOutputToProjectOutput(output).source).toBe('team');
  });
});

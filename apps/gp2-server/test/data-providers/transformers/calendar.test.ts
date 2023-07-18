import { parseContentfulWorkingGroupsProjects } from '../../../src/data-providers/transformers';

describe('parseContentfulWorkingGroupsProjects', () => {
  test('should parse working groups and projects', () => {
    const calendar = {
      linkedFrom: {
        workingGroupsCollection: {
          items: [
            {
              sys: { id: 'working-group-id' },
              title: 'working group title',
            },
          ],
        },
        projectsCollection: {
          items: [
            {
              sys: { id: 'project-id' },
              title: 'project title',
            },
          ],
        },
      },
    };

    expect(parseContentfulWorkingGroupsProjects(calendar)).toEqual({
      workingGroups: [
        {
          id: 'working-group-id',
          title: 'working group title',
        },
      ],
      projects: [
        {
          id: 'project-id',
          title: 'project title',
        },
      ],
    });
  });

  test('should return empty arrays for working groups and projects if calendar is undefined', () => {
    expect(parseContentfulWorkingGroupsProjects()).toEqual({
      workingGroups: [],
      projects: [],
    });
  });
});

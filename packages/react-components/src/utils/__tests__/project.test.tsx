import { render, screen } from '@testing-library/react';
import { getProjectConfig, getProjectIcon, getProjectRoute } from '../project';

describe('project utils', () => {
  it('returns the correct route for each project type', () => {
    expect(
      getProjectRoute({
        projectId: 'discovery-id',
        projectType: 'Discovery Project',
      }),
    ).toEqual('/projects/discovery/discovery-id');
    expect(
      getProjectRoute({
        projectId: 'resource-id',
        projectType: 'Resource Project',
      }),
    ).toEqual('/projects/resource/resource-id');
    expect(
      getProjectRoute({
        projectId: 'trainee-id',
        projectType: 'Trainee Project',
      }),
    ).toEqual('/projects/trainee/trainee-id');
  });

  it.each`
    projectType            | iconTitle
    ${'Discovery Project'} | ${'Discovery Project'}
    ${'Resource Project'}  | ${'Resource Project'}
    ${'Trainee Project'}   | ${'Trainee Project'}
  `('returns the $projectType icon', ({ projectType, iconTitle }) => {
    render(<>{getProjectIcon(projectType)}</>);

    expect(screen.getByTitle(iconTitle)).toBeInTheDocument();
  });

  it('throws for an unsupported project type at runtime', () => {
    expect(() =>
      getProjectIcon('Unsupported Project Type' as unknown as never),
    ).toThrow('Unsupported project type: Unsupported Project Type');
  });

  it('returns undefined route for an unsupported project type at runtime', () => {
    expect(
      getProjectRoute({
        projectId: 'project-id',
        projectType: 'Unsupported Project Type' as unknown as never,
      }),
    ).toBeUndefined();
  });

  it('returns both route and icon from getProjectConfig', () => {
    const config = getProjectConfig({
      projectId: 'project-id',
      projectType: 'Discovery Project',
    });

    render(<>{config.icon}</>);

    expect(config.href).toEqual('/projects/discovery/project-id');
    expect(screen.getByTitle('Discovery Project')).toBeInTheDocument();
  });
});

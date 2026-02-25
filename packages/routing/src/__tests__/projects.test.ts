import projects from '../projects';

describe('projects routes', () => {
  it('generates discovery project workspace route', () => {
    const path = projects({})
      .discoveryProjects({})
      .discoveryProject({ projectId: 'p1' })
      .workspace({}).$;
    expect(path).toBe('/projects/discovery/p1/workspace');
  });

  it('generates discovery project create manuscript route', () => {
    const path = projects({})
      .discoveryProjects({})
      .discoveryProject({ projectId: 'p1' })
      .workspace({})
      .createManuscript({}).$;
    expect(path).toBe('/projects/discovery/p1/workspace/create-manuscript');
  });

  it('generates discovery project edit manuscript route', () => {
    const path = projects({})
      .discoveryProjects({})
      .discoveryProject({ projectId: 'p1' })
      .workspace({})
      .editManuscript({ manuscriptId: 'm1' }).$;
    expect(path).toBe('/projects/discovery/p1/workspace/edit-manuscript/m1');
  });

  it('generates discovery project resubmit manuscript route', () => {
    const path = projects({})
      .discoveryProjects({})
      .discoveryProject({ projectId: 'p1' })
      .workspace({})
      .resubmitManuscript({ manuscriptId: 'm1' }).$;
    expect(path).toBe(
      '/projects/discovery/p1/workspace/resubmit-manuscript/m1',
    );
  });

  it('generates resource project workspace route', () => {
    const path = projects({})
      .resourceProjects({})
      .resourceProject({ projectId: 'p2' })
      .workspace({}).$;
    expect(path).toBe('/projects/resource/p2/workspace');
  });

  it('generates resource project create manuscript route', () => {
    const path = projects({})
      .resourceProjects({})
      .resourceProject({ projectId: 'p2' })
      .workspace({})
      .createManuscript({}).$;
    expect(path).toBe('/projects/resource/p2/workspace/create-manuscript');
  });

  it('generates resource project edit manuscript route', () => {
    const path = projects({})
      .resourceProjects({})
      .resourceProject({ projectId: 'p2' })
      .workspace({})
      .editManuscript({ manuscriptId: 'm1' }).$;
    expect(path).toBe('/projects/resource/p2/workspace/edit-manuscript/m1');
  });

  it('generates resource project resubmit manuscript route', () => {
    const path = projects({})
      .resourceProjects({})
      .resourceProject({ projectId: 'p2' })
      .workspace({})
      .resubmitManuscript({ manuscriptId: 'm1' }).$;
    expect(path).toBe('/projects/resource/p2/workspace/resubmit-manuscript/m1');
  });

  it('generates trainee project workspace route', () => {
    const path = projects({})
      .traineeProjects({})
      .traineeProject({ projectId: 'p3' })
      .workspace({}).$;
    expect(path).toBe('/projects/trainee/p3/workspace');
  });

  it('generates trainee project create manuscript route', () => {
    const path = projects({})
      .traineeProjects({})
      .traineeProject({ projectId: 'p3' })
      .workspace({})
      .createManuscript({}).$;
    expect(path).toBe('/projects/trainee/p3/workspace/create-manuscript');
  });

  it('generates trainee project edit manuscript route', () => {
    const path = projects({})
      .traineeProjects({})
      .traineeProject({ projectId: 'p3' })
      .workspace({})
      .editManuscript({ manuscriptId: 'm1' }).$;
    expect(path).toBe('/projects/trainee/p3/workspace/edit-manuscript/m1');
  });

  it('generates trainee project resubmit manuscript route', () => {
    const path = projects({})
      .traineeProjects({})
      .traineeProject({ projectId: 'p3' })
      .workspace({})
      .resubmitManuscript({ manuscriptId: 'm1' }).$;
    expect(path).toBe('/projects/trainee/p3/workspace/resubmit-manuscript/m1');
  });
});

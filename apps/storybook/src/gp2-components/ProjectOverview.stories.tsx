import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ProjectOverview } from '@asap-hub/gp2-components';
import { number, text } from './knobs';

const { createProjectResponse } = gp2Fixtures;
export default {
  title: 'GP2 / Templates / Projects / Overview',
  component: ProjectOverview,
};
const milestone = (id: number) => ({
  title: `Milestone ${id}`,
  description: 'Started trans-ethnic meta-analysis and fine mapping project',
  status: 'Active' as const,
  link: 'http://example.com/',
});
const project = createProjectResponse();

export const Normal = () => (
  <ProjectOverview
    {...project}
    milestones={Array.from({ length: number('Milestone count', 5) }, (_, i) =>
      milestone(i),
    )}
    pmEmail={text('PM Email', 'pm@example.com')}
    leadEmail={text('Lead Email', 'lead@example.com')}
    tags={project.tags}
  />
);

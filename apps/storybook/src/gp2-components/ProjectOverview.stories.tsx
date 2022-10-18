import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ProjectOverview } from '@asap-hub/gp2-components';
import { number, text } from '@storybook/addon-knobs';

const { createProjectResponse } = gp2Fixtures;
export default {
  title: 'GP2 / Templates / Project Overview',
  component: ProjectOverview,
};
const milestone = (id: number) => ({
  title: `Milestone ${id}`,
  description: 'Started trans-ethnic meta-analysis and fine mapping project',
  status: 'Active' as const,
  link: 'http://example.com/',
});

export const Normal = () => (
  <ProjectOverview
    {...createProjectResponse()}
    milestones={Array.from({ length: number('Milestone count', 5) }, (_, i) =>
      milestone(i),
    )}
    pmEmail={text('PM Email', 'pm@example.com')}
    leadEmail={text('Lead Email', 'lead@example.com')}
  />
);

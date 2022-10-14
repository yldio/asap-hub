import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ProjectOverview } from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import { number } from '@storybook/addon-knobs';

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

const props: gp2Model.ProjectResponse = {
  ...createProjectResponse(),
  keywords: ['R', 'Bash', 'Diversity', 'Data Science'],
  pmEmail: 'pm@example.com',
  leadEmail: 'lead@example.com',
  milestones: Array.from({ length: number('Milestone count', 5) }, (_, i) =>
    milestone(i),
  ),
};
export const Normal = () => <ProjectOverview {...props} />;

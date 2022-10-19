import { ProjectMilestone } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms / Project Milestone',
  component: ProjectMilestone,
};

const milestone = (id: number) => ({
  title: `Milestone ${id}`,
  description: 'Started trans-ethnic meta-analysis and fine mapping project',
  status: 'Active' as const,
  link: 'http://example.com/',
});

export const Normal = () => <ProjectMilestone milestone={milestone(1)} />;

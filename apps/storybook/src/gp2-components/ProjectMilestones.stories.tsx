import { ProjectMilestones } from '@asap-hub/gp2-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Organisms / Project Milestones',
  component: ProjectMilestones,
};

const milestone = (id: number) => ({
  title: `Milestone ${id}`,
  description: 'Started trans-ethnic meta-analysis and fine mapping project',
  status: 'Active' as const,
  link: 'http://example.com/',
});

export const Normal = () => (
  <ProjectMilestones
    milestones={Array.from({ length: number('Milestone count', 5) }, (_, i) =>
      milestone(i),
    )}
  />
);

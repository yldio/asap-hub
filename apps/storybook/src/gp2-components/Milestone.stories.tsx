import { Milestone } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms / Milestone',
  component: Milestone,
};

const milestone = (id: number) => ({
  title: `Milestone ${id}`,
  description: 'Started trans-ethnic meta-analysis and fine mapping project',
  status: 'Active' as const,
  link: 'http://example.com/',
});

export const Normal = () => <Milestone milestone={milestone(1)} />;

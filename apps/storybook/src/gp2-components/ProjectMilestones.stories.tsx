import { Milestones } from '@asap-hub/gp2-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Organisms / Project / Milestones',
  component: Milestones,
};

const milestone = (id: number) => ({
  title: `Milestone ${id}`,
  description: 'Started trans-ethnic meta-analysis and fine mapping project',
  status: 'Active' as const,
  link: 'http://example.com/',
});

export const Normal = () => (
  <Milestones
    milestones={Array.from({ length: number('Milestone count', 5) }, (_, i) =>
      milestone(i),
    )}
    title="Project Milestones"
    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut
      aliquip ex ea commodo consequat"
  />
);

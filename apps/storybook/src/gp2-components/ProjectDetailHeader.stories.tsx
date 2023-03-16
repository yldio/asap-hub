import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ProjectDetailHeader } from '@asap-hub/gp2-components';
import { boolean } from '@storybook/addon-knobs';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Organisms / Project / Detail Header',
  component: ProjectDetailHeader,
};

const props: ComponentProps<typeof ProjectDetailHeader> = {
  ...gp2Fixtures.createProjectResponse(),
  isProjectMember: false,
  isAdministrator: boolean('is admin', false),
  outputsTotal: 1,
  upcomingTotal: 2,
  pastTotal: 4,
};

export const Normal = () => <ProjectDetailHeader {...props} />;

export const WithResources = () => (
  <ProjectDetailHeader {...props} isProjectMember={true} />
);

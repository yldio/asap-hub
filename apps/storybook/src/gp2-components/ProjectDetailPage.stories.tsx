import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ProjectDetailPage } from '@asap-hub/gp2-components';
import { boolean } from '@storybook/addon-knobs';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Templates / Projects / Detail Page',
  component: ProjectDetailPage,
};

const props: ComponentProps<typeof ProjectDetailPage> = {
  ...gp2Fixtures.createProjectResponse(),
  isProjectMember: false,
  isAdministrator: boolean('is admin', false),
  outputsTotal: 1,
  upcomingTotal: 2,
  pastTotal: 4,
};

export const Normal = () => <ProjectDetailPage {...props} />;

export const WithResources = () => (
  <ProjectDetailPage {...props} isProjectMember={true} />
);

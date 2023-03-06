import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ProjectDetailPage } from '@asap-hub/gp2-components';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Templates / Projects / Detail Page',
  component: ProjectDetailPage,
};

const props = {
  ...gp2Fixtures.createProjectResponse(),
  backHref: '/',
  isProjectMember: false,
  isAdministrator: boolean('is admin', false),
};

export const Normal = () => <ProjectDetailPage {...props} />;

export const WithResources = () => (
  <ProjectDetailPage {...props} isProjectMember={true} />
);

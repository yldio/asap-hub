import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ProjectDetailHeader } from '@asap-hub/gp2-components';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Organisms / Project / Detail Header',
  component: ProjectDetailHeader,
};

const props = {
  ...gp2Fixtures.createProjectResponse(),
  backHref: '/',
  isProjectMember: false,
  isAdministrator: boolean('is admin', false),
};

export const Normal = () => <ProjectDetailHeader {...props} />;

export const WithResources = () => (
  <ProjectDetailHeader {...props} isProjectMember={true} />
);

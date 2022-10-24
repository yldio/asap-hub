import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ProjectDetailHeader } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms / Project / Detail Header',
  component: ProjectDetailHeader,
};

const props = {
  ...gp2Fixtures.createProjectResponse(),
  backHref: '/',
  isProjectMember: false,
};

export const Normal = () => <ProjectDetailHeader {...props} />;

export const WithResources = () => (
  <ProjectDetailHeader {...props} isProjectMember={true} />
);

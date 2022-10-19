import { ProjectDetailHeader } from '@asap-hub/gp2-components';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

export default {
  title: 'GP2 / Organisms / Project Detail Header',
  component: ProjectDetailHeader,
};

const item = {
  ...gp2Fixtures.createProjectResponse(),
  backHref: '/',
};

export const Normal = () => <ProjectDetailHeader {...item} />;

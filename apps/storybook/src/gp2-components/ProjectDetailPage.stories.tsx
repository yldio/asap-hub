import { ProjectDetailPage } from '@asap-hub/gp2-components';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

export default {
  title: 'GP2 / Templates / Project Detail Page',
  component: ProjectDetailPage,
};

const item = {
  ...gp2Fixtures.createProjectResponse(),
  backHref: '/',
};

export const Normal = () => <ProjectDetailPage {...item} />;

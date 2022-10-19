import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ProjectSummaryFooter } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms / Project Summary Footer',
  component: ProjectSummaryFooter,
};

const item = gp2Fixtures.createProjectResponse();

export const Normal = () => <ProjectSummaryFooter {...item} />;

import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ProjectSummaryHeader } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms / Project / Summary Header',
  component: ProjectSummaryHeader,
};

const item = gp2Fixtures.createProjectResponse();

export const Normal = () => <ProjectSummaryHeader {...item} />;

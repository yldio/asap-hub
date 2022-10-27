import { ProjectCard } from '@asap-hub/gp2-components';

import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

export default {
  title: 'GP2 / Organisms / Project / Card',
  component: ProjectCard,
};

const item = gp2Fixtures.createProjectResponse();

export const Normal = () => <ProjectCard {...item} />;

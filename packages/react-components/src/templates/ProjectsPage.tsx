import { ComponentProps } from 'react';

import ProjectsPageHeader from './ProjectsPageHeader';
import PageConstraints from './PageConstraints';

const ProjectsPage: React.FC<ComponentProps<typeof ProjectsPageHeader>> = ({
  children,
  ...props
}) => (
  <article>
    <ProjectsPageHeader {...props} />
    <PageConstraints as="main">{children}</PageConstraints>
  </article>
);

export default ProjectsPage;

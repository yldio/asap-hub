import { ComponentProps } from 'react';

import ProjectsPageHeader from './ProjectsPageHeader';
import PageContraints from './PageConstraints';

const ProjectsPage: React.FC<ComponentProps<typeof ProjectsPageHeader>> = ({
  children,
  ...props
}) => (
  <article>
    <ProjectsPageHeader {...props} />
    <PageContraints as="main">{children}</PageContraints>
  </article>
);

export default ProjectsPage;

import { ComponentProps } from 'react';

import ProjectDetailHeader from '../organisms/ProjectDetailHeader';

type ProjectDetailPageProps = ComponentProps<typeof ProjectDetailHeader>;

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  children,
  ...headerProps
}) => (
  <article>
    <ProjectDetailHeader {...headerProps} />
    <main>{children}</main>
  </article>
);

export default ProjectDetailPage;

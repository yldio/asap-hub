import { ProjectDetail } from '@asap-hub/model';
import ProjectDetailHeader from './ProjectDetailHeader';
import PageConstraints from './PageConstraints';

type ProjectDetailPageProps = ProjectDetail & {
  readonly pointOfContactEmail?: string;
  readonly aboutHref: string;
};

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  children,
  aboutHref,
  pointOfContactEmail,
  ...project
}) => (
  <article>
    <ProjectDetailHeader
      {...project}
      pointOfContactEmail={pointOfContactEmail}
      aboutHref={aboutHref}
    />
    <PageConstraints as="main">{children}</PageConstraints>
  </article>
);

export default ProjectDetailPage;

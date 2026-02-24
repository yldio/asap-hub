import { ProjectDetail } from '@asap-hub/model';
import ProjectDetailHeader from './ProjectDetailHeader';
import PageConstraints from './PageConstraints';

type ProjectDetailPageProps = ProjectDetail & {
  readonly pointOfContactEmail?: string;
  readonly aboutHref: string;
  readonly workspaceHref?: string;
  readonly children?: React.ReactNode;
};

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  children,
  aboutHref,
  workspaceHref,
  pointOfContactEmail,
  ...project
}) => (
  <article>
    <ProjectDetailHeader
      {...project}
      pointOfContactEmail={pointOfContactEmail}
      aboutHref={aboutHref}
      workspaceHref={workspaceHref}
    />
    <PageConstraints as="main">{children}</PageConstraints>
  </article>
);

export default ProjectDetailPage;

import { ProjectDetail } from '@asap-hub/model';
import ProjectDetailHeader from './ProjectDetailHeader';
import PageConstraints from './PageConstraints';

type ProjectDetailPageProps = ProjectDetail & {
  readonly pointOfContactEmail?: string;
  readonly aboutHref: string;
  readonly workspaceHref?: string;
  readonly milestonesHref: string;
  readonly children?: React.ReactNode;
};

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  children,
  aboutHref,
  workspaceHref,
  pointOfContactEmail,
  milestonesHref,
  ...project
}) => (
  <article>
    <ProjectDetailHeader
      {...project}
      pointOfContactEmail={pointOfContactEmail}
      aboutHref={aboutHref}
      workspaceHref={workspaceHref}
      milestonesHref={milestonesHref}
    />
    <PageConstraints as="main">{children}</PageConstraints>
  </article>
);

export default ProjectDetailPage;

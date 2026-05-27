import { ProjectDetail } from '@asap-hub/model';
import ProjectDetailHeader from './ProjectDetailHeader';
import PageConstraints from './PageConstraints';

type ProjectDetailPageProps = ProjectDetail & {
  readonly pointOfContactEmail?: string;
  readonly aboutHref: string;
  readonly workspaceHref?: string;
  readonly milestonesHref: string;
  readonly outputsHref?: string;
  readonly draftOutputsHref?: string;
  readonly outputsCount?: number;
  readonly draftOutputsCount?: number;
  readonly children?: React.ReactNode;
};

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  children,
  aboutHref,
  workspaceHref,
  pointOfContactEmail,
  milestonesHref,
  outputsHref,
  draftOutputsHref,
  outputsCount,
  draftOutputsCount,
  ...project
}) => (
  <article>
    <ProjectDetailHeader
      {...project}
      pointOfContactEmail={pointOfContactEmail}
      aboutHref={aboutHref}
      workspaceHref={workspaceHref}
      milestonesHref={milestonesHref}
      outputsHref={outputsHref}
      draftOutputsHref={draftOutputsHref}
      outputsCount={outputsCount}
      draftOutputsCount={draftOutputsCount}
    />
    <PageConstraints as="main">{children}</PageConstraints>
  </article>
);

export default ProjectDetailPage;

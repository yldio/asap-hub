import { ProjectDetail } from '@asap-hub/model';
import ProjectDetailHeader from './ProjectDetailHeader';
import PageConstraints from './PageConstraints';

type ProjectDetailPageProps = ProjectDetail & {
  readonly pointOfContactEmail?: string;
  readonly aboutHref: string;
  readonly workspaceHref?: string;
  readonly milestonesHref: string;
  readonly complianceHref?: string;
  readonly outputsHref?: string;
  readonly draftOutputsHref?: string;
  readonly manuscriptsCount?: number;
  readonly outputsCount?: number;
  readonly draftOutputsCount?: number;
  readonly canShareOutput?: boolean;
  readonly children?: React.ReactNode;
};

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  children,
  aboutHref,
  workspaceHref,
  pointOfContactEmail,
  milestonesHref,
  complianceHref,
  outputsHref,
  draftOutputsHref,
  manuscriptsCount,
  outputsCount,
  draftOutputsCount,
  canShareOutput,
  ...project
}) => (
  <article>
    <ProjectDetailHeader
      {...project}
      pointOfContactEmail={pointOfContactEmail}
      aboutHref={aboutHref}
      workspaceHref={workspaceHref}
      milestonesHref={milestonesHref}
      complianceHref={complianceHref}
      outputsHref={outputsHref}
      draftOutputsHref={draftOutputsHref}
      manuscriptsCount={manuscriptsCount}
      outputsCount={outputsCount}
      draftOutputsCount={draftOutputsCount}
      canShareOutput={canShareOutput}
    />
    <PageConstraints as="main">{children}</PageConstraints>
  </article>
);

export default ProjectDetailPage;

import { ProjectDetail } from '@asap-hub/model';
import { css } from '@emotion/react';
import ProjectDetailHeader from './ProjectDetailHeader';
import { steel } from '../colors';
import { networkPageLayoutPaddingStyle } from '../layout';

const contentStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  padding: networkPageLayoutPaddingStyle,
  backgroundColor: '#fff',
});

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
    <main css={contentStyles}>{children}</main>
  </article>
);

export default ProjectDetailPage;

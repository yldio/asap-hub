import { pixels } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { mainStyles } from '../layout';

import ProjectDetailHeader from '../organisms/ProjectDetailHeader';

type ProjectDetailPageProps = ComponentProps<typeof ProjectDetailHeader>;

const { rem } = pixels;

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  children,
  ...headerProps
}) => (
  <article>
    <ProjectDetailHeader {...headerProps} />
    <main css={[mainStyles, { padding: `${rem(32)} 0` }]}>{children}</main>
  </article>
);

export default ProjectDetailPage;

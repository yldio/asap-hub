import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import ProjectsPageHeader from './ProjectsPageHeader';
import { networkPageLayoutPaddingStyle } from '../layout';

const mainStyles = css({
  padding: networkPageLayoutPaddingStyle,
});

const ProjectsPage: React.FC<ComponentProps<typeof ProjectsPageHeader>> = ({
  children,
  ...props
}) => (
  <article>
    <ProjectsPageHeader {...props} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default ProjectsPage;

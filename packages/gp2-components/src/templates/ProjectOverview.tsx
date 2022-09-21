import { ProjectResponse } from '@asap-hub/model/src/gp2';
import { pixels } from '@asap-hub/react-components';

import { css } from '@emotion/react';

type ProjectOverviewProps = Pick<ProjectResponse, 'members'>;

const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
  padding: `${rem(32)} 0 ${rem(48)}`,
});

const ProjectOverview: React.FC<ProjectOverviewProps> = () => (
  <div css={containerStyles}>
    <p>Test...</p>
  </div>
);

export default ProjectOverview;

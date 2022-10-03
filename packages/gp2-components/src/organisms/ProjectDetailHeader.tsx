import { gp2 as gp2Model } from '@asap-hub/model';
import {
  BackLink,
  drawerQuery,
  pixels,
  Subtitle,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';

import { projectsImage } from '../images';
import CardWithBackground from '../molecules/CardWithBackground';
import ProjectSummaryHeader from './ProjectSummaryHeader';
import ProjectSummaryFooter from './ProjectSummaryFooter';

const { rem } = pixels;

type ProjectDetailHeaderProps = Pick<
  gp2Model.ProjectResponse,
  | 'title'
  | 'status'
  | 'startDate'
  | 'endDate'
  | 'members'
  | 'projectProposalUrl'
> & {
  backHref: string;
};

const infoContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  gap: rem(32),
  [drawerQuery]: {
    display: 'unset',
  },
});

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({
  title,
  status,
  startDate,
  endDate,
  members,
  projectProposalUrl,
  backHref,
}) => (
  <header>
    <BackLink href={backHref} />
    <CardWithBackground image={projectsImage}>
      <ProjectSummaryHeader
        projectProposalUrl={projectProposalUrl}
        status={status}
      />
      <Subtitle>Project</Subtitle>
      <h2>{title}</h2>
      <div css={infoContainerStyles}>
        <ProjectSummaryFooter
          members={members}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </CardWithBackground>
  </header>
);
export default ProjectDetailHeader;

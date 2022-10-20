import { gp2 as gp2Model } from '@asap-hub/model';
import {
  BackLink,
  drawerQuery,
  pixels,
  Subtitle,
  TabLink,
  TabNav,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';

import { css } from '@emotion/react';

import { projectsImage } from '../images';
import CardWithBackground from '../molecules/CardWithBackground';
import ProjectSummaryFooter from './ProjectSummaryFooter';
import ProjectSummaryHeader from './ProjectSummaryHeader';

const { rem } = pixels;

type ProjectDetailHeaderProps = Pick<
  gp2Model.ProjectResponse,
  | 'id'
  | 'title'
  | 'status'
  | 'startDate'
  | 'endDate'
  | 'members'
  | 'projectProposalUrl'
> & {
  backHref: string;
  isProjectMember: boolean;
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
  id,
  title,
  status,
  startDate,
  endDate,
  members,
  projectProposalUrl,
  backHref,
  isProjectMember,
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
    <TabNav>
      <TabLink
        href={gp2Routing.projects({}).project({ projectId: id }).overview({}).$}
      >
        Overview
      </TabLink>
      {isProjectMember && (
        <TabLink
          href={
            gp2Routing.projects({}).project({ projectId: id }).resources({}).$
          }
        >
          Resources
        </TabLink>
      )}
    </TabNav>
  </header>
);
export default ProjectDetailHeader;

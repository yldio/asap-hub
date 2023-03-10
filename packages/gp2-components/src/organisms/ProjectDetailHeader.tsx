import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Card,
  drawerQuery,
  externalLinkIcon,
  informationIcon,
  Link,
  Paragraph,
  pixels,
  Subtitle,
  TabLink,
  TabNav,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';

import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { projectsImage } from '../images';
import { detailHeaderStyles } from '../layout';
import CardWithBackground from '../molecules/CardWithBackground';
import ShareOutputButton from '../molecules/ShareOutputButton';

import ProjectSummaryFooter from './ProjectSummaryFooter';
import ProjectSummaryHeader from './ProjectSummaryHeader';

const { rem } = pixels;

type ProjectDetailHeaderProps = ComponentProps<typeof ProjectSummaryHeader> &
  Pick<
    gp2Model.ProjectResponse,
    'id' | 'title' | 'startDate' | 'endDate' | 'members' | 'opportunitiesLink'
  > & {
    isProjectMember: boolean;
    isAdministrator: boolean;
  };

const infoContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  gap: rem(32),
  [drawerQuery]: {
    display: 'unset',
  },
});
const opportunitiesCardStyles = css({
  display: 'flex',
  gap: rem(16),
  margin: `${rem(32)} ${rem(24)}`,
});
const cardTextContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
});

const infoIconStyles = css({
  display: 'inline-flex',
  svg: {
    stroke: 'currentcolor',
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
  isProjectMember,
  traineeProject,
  opportunitiesLink,
  isAdministrator,
}) => (
  <header css={detailHeaderStyles}>
    {opportunitiesLink && (
      <Card accent="information" padding={false}>
        <div css={opportunitiesCardStyles}>
          <div>{informationIcon}</div>
          <div css={cardTextContainerStyles}>
            <Subtitle noMargin>Opportunities Available</Subtitle>
            <Paragraph noMargin>
              This project is currently looking for additional team members.
            </Paragraph>
            <Link href={opportunitiesLink}>
              <span css={css({ display: 'inline-flex' })}>
                Read more <span css={infoIconStyles}>{externalLinkIcon}</span>
              </span>
            </Link>
          </div>
        </div>
      </Card>
    )}
    <CardWithBackground image={projectsImage}>
      <ProjectSummaryHeader
        projectProposalUrl={projectProposalUrl}
        status={status}
        traineeProject={traineeProject}
        opportunitiesLink={opportunitiesLink}
      />
      <Subtitle>Project</Subtitle>
      <h2>{title}</h2>
      <div css={infoContainerStyles}>
        <ProjectSummaryFooter
          members={members}
          startDate={startDate}
          endDate={endDate}
        />
        {isAdministrator && (
          <div css={css({ marginLeft: 'auto' })}>
            <ShareOutputButton id={id} entityType="project" />
          </div>
        )}
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

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
import CardWithBackground from '../molecules/CardWithBackground';

import ProjectSummaryFooter from './ProjectSummaryFooter';
import ProjectSummaryHeader from './ProjectSummaryHeader';

const { rem } = pixels;

type ProjectDetailHeaderProps = ComponentProps<typeof ProjectSummaryHeader> &
  Pick<
    gp2Model.ProjectResponse,
    'id' | 'title' | 'startDate' | 'endDate' | 'members'
  > & {
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
}) => (
  <header css={css({ display: 'flex', flexDirection: 'column', gap: '32px' })}>
    {opportunitiesLink && (
      <Card accent="information" padding={false}>
        <div
          css={css({
            display: 'flex',
            gap: '16px',
            margin: `${rem(32)} ${rem(24)}`,
          })}
        >
          <div>{informationIcon}</div>
          <div
            css={css({ display: 'flex', flexDirection: 'column', gap: '4px' })}
          >
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

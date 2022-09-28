import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Card,
  crossQuery,
  lead,
  LinkHeadline,
  pixels,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { css } from '@emotion/react';
import colors from '../templates/colors';
import ProjectSummaryFooter from './ProjectSummaryFooter';
import ProjectSummaryHeader from './ProjectSummaryHeader';

const { rem } = pixels;

type ProjectCardProps = Pick<
  gp2Model.ProjectResponse,
  | 'title'
  | 'status'
  | 'startDate'
  | 'endDate'
  | 'members'
  | 'id'
  | 'projectProposalUrl'
>;

const rowStyles = css({
  display: 'flex',
  flexDirection: 'column',
  [crossQuery]: {
    flexDirection: 'row',
  },
});

export const cardStyles: Record<
  gp2Model.ProjectResponse['status'],
  { color: string }
> = {
  Active: {
    color: colors.info500.rgba,
  },
  Completed: {
    color: colors.secondary500.rgba,
  },
  Inactive: {
    color: colors.warning500.rgba,
  },
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  status,
  startDate,
  endDate,
  members,
  id,
  projectProposalUrl,
}) => (
  <Card stroke strokeColor={cardStyles[status].color} strokeSize={9}>
    <ProjectSummaryHeader
      projectProposalUrl={projectProposalUrl}
      status={status}
    />
    <LinkHeadline
      href={
        gp2Routing.projects({}).project({
          projectId: id,
        }).$
      }
      level={3}
    >
      {title}
    </LinkHeadline>
    <div
      css={[
        rowStyles,
        css({
          [crossQuery]: {
            gap: rem(32),
          },
          color: lead.rgb,
        }),
      ]}
    >
      <ProjectSummaryFooter
        members={members}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  </Card>
);

export default ProjectCard;

import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { format, formatDistanceStrict as formatDistance } from 'date-fns';
import {
  Card,
  crossQuery,
  ExternalLink,
  lead,
  LinkHeadline,
  pixels,
  utils,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import dateIcon from '../icons/date-icon';
import usersIcon from '../icons/users-icon';
import IconWithLabel from '../molecules/IconWithLabel';
import ProjectStatus, { statusStyles } from '../molecules/ProjectStatus';
import colors from '../templates/colors';

const { getCounterString } = utils;
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

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  status,
  startDate,
  endDate,
  members,
  id,
  projectProposalUrl,
}) => (
  <Card stroke strokeColor={statusStyles[status].color}>
    <div css={[rowStyles, css({ gap: rem(4) })]}>
      <div css={css({ display: 'inline-flex' })}>
        <ProjectStatus status={status} />
      </div>
      {projectProposalUrl && (
        <div
          css={css({
            [crossQuery]: {
              marginLeft: 'auto',
            },
          })}
        >
          <ExternalLink
            href={projectProposalUrl}
            label="View proposal"
            noMargin
            full
          />
        </div>
      )}
    </div>
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
      <IconWithLabel icon={usersIcon}>
        {getCounterString(members.length, 'Member')}
      </IconWithLabel>
      <IconWithLabel icon={dateIcon}>
        <span>
          {`${format(new Date(startDate), 'MMM yyyy')}${
            endDate ? ` - ${format(new Date(endDate), 'MMM yyyy')} · ` : ''
          }`}
          {endDate && (
            <span css={{ color: colors.neutral800.rgba }}>
              {`(${formatDistance(new Date(startDate), new Date(endDate), {
                unit: 'month',
              })})`}
            </span>
          )}
        </span>
      </IconWithLabel>
    </div>
  </Card>
);

export default ProjectCard;

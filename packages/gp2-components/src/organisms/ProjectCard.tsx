import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { format } from 'date-fns';
import {
  Card,
  ExternalLink,
  lead,
  LinkHeadline,
  utils,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import dateIcon from '../icons/date-icon';
import usersIcon from '../icons/users-icon';
import IconWithLabel from '../molecules/IconWithLabel';
import ProjectStatus, { statusStyles } from '../molecules/ProjectStatus';
import colors from '../templates/colors';

const { getCounterString } = utils;

type ProjectCardProps = Pick<
  gp2Model.ProjectResponse,
  'title' | 'status' | 'startDate' | 'endDate' | 'members' | 'id'
>;

const calcDuration = (start: string, end?: string) => {
  if (!end) return '';
  const startDate = new Date(start);
  const endDate = new Date(end);
  console.log(startDate, endDate);
  const monthDuration =
    12 * (endDate.getFullYear() - startDate.getFullYear()) +
    (endDate.getMonth() - startDate.getMonth());
  return `(${monthDuration} mos)`;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  status,
  startDate,
  endDate,
  members,
  id,
}) => (
  <Card stroke strokeColor={statusStyles[status].color}>
    <div css={css({ display: 'flex', flexDirection: 'row', gap: '8px' })}>
      <ProjectStatus status={status} />
      <div css={css({ marginLeft: 'auto' })}>
        <ExternalLink href="google.com" label="View proposal" />
      </div>
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
      css={css({
        display: 'flex',
        flexDirection: 'row',
        gap: '32px',
        color: lead.rgb,
      })}
    >
      <IconWithLabel icon={usersIcon}>
        {getCounterString(members.length, 'Member')}
      </IconWithLabel>
      <IconWithLabel icon={dateIcon}>
        <span>
          {`${format(new Date(startDate), 'MMM yyyy')}${
            endDate && ` - ${format(new Date(endDate), 'MMM yyyy')} · `
          }`}
          <span css={{ color: colors.neutral800.rgba }}>
            {calcDuration(startDate, endDate)}
          </span>
        </span>
      </IconWithLabel>
    </div>
  </Card>
);

export default ProjectCard;

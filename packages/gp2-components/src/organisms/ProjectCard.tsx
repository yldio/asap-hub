import { gp2 } from '@asap-hub/model';
import { format } from 'date-fns';
import {
  Card,
  ExternalLink,
  Headline3,
  lead,
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
  gp2.ProjectResponse,
  'title' | 'status' | 'startDate' | 'endDate' | 'members'
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
}) => (
  <Card stroke strokeColor={statusStyles[status].color}>
    <div css={css({ display: 'flex', flexDirection: 'row', gap: '8px' })}>
      <ProjectStatus status={status} />
      <div css={css({ marginLeft: 'auto' })}>
        <ExternalLink href="google.com" label="View proposal" />
      </div>
    </div>
    <Headline3>{title}</Headline3>
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

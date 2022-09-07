import {
  Card,
  ExternalLink,
  Headline3,
  utils,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import dateIcon from '../icons/date-icon';
import usersIcon from '../icons/users-icon';
import IconWithLabel from '../molecules/IconWithLabel';
import ProjectStatus from '../molecules/ProjectStatus';

const { getCounterString } = utils;

type ProjectCardProps = {
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  members: string[];
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  status,
  startDate,
  endDate,
  members,
}) => (
  <Card stroke>
    <div css={css({ display: 'flex', flexDirection: 'row', gap: '8px' })}>
      <ProjectStatus status={status} />
      <div css={css({ marginLeft: 'auto' })}>
        <ExternalLink href="google.com" label="View proposal" />
      </div>
    </div>
    <Headline3>{title}</Headline3>
    <div css={css({ display: 'flex', flexDirection: 'row', gap: '32px' })}>
      <IconWithLabel icon={usersIcon}>
        {getCounterString(members.length, 'Member')}
      </IconWithLabel>
      <IconWithLabel icon={dateIcon}>
        {`${startDate} - ${endDate} · ${'(6 mos)'}`}
      </IconWithLabel>
    </div>
  </Card>
);

export default ProjectCard;

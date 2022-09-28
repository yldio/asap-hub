import { gp2 as gp2Model } from '@asap-hub/model';
import {
  BackLink,
  drawerQuery,
  pixels,
  Subtitle,
  utils,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';

import { format, formatDistanceStrict as formatDistance } from 'date-fns';
import colors from '../templates/colors';

import usersIcon from '../icons/users-icon';
import dateIcon from '../icons/date-icon';
import { projectsImage } from '../images';
import CardWithBackground from '../molecules/CardWithBackground';
import IconWithLabel from '../molecules/IconWithLabel';
import ProjectSummary from './ProjectSummary';

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

const { getCounterString } = utils;

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
      <ProjectSummary projectProposalUrl={projectProposalUrl} status={status} />
      <Subtitle>Project</Subtitle>
      <h2>{title}</h2>
      <div css={infoContainerStyles}>
        <IconWithLabel icon={usersIcon}>
          {getCounterString(members.length, 'member')}
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
    </CardWithBackground>
  </header>
);
export default ProjectDetailHeader;

import { gp2 as gp2Model } from '@asap-hub/model';
import { Link, neutral900, pixels } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { projectIcon, workingGroupIcon } from '../icons';

const { rem } = pixels;
const WorkingGroupIcon = () => workingGroupIcon;
const ProjectIcon = () => projectIcon;

const { projects, workingGroups } = gp2Routing;
const listItemStyles = css({
  padding: `${rem(7.5)} 0`,
  color: neutral900.rgb,
  whiteSpace: 'break-spaces',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: rem(17),
  display: 'flex',
});

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  width: rem(24),
  height: rem(24),
  paddingRight: rem(9),
});

const EventOwner: React.FC<
  Pick<gp2Model.EventResponse, 'project' | 'workingGroup'>
> = ({ project, workingGroup }) => (
  <div css={listItemStyles}>
    {project ? (
      <Link href={projects({}).project({ projectId: project.id }).$}>
        <span css={iconStyles}>
          <ProjectIcon />
        </span>
        {project.title}
      </Link>
    ) : workingGroup ? (
      <Link
        href={
          workingGroups({}).workingGroup({ workingGroupId: workingGroup.id }).$
        }
      >
        <span css={iconStyles}>
          <WorkingGroupIcon />
        </span>
        {workingGroup.title}
      </Link>
    ) : (
      <>
        <span css={iconStyles}>
          <WorkingGroupIcon />
        </span>
        GP2 Event
      </>
    )}
  </div>
);

export default EventOwner;

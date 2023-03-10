import { gp2 as gp2Model } from '@asap-hub/model';
import { Link, neutral900, pixels } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { projectIcon, workingGroupIcon } from '../icons';
import IconWithLabel from './IconWithLabel';

const { rem } = pixels;

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

type EventOwnerProps = Pick<gp2Model.EventResponse, 'project' | 'workingGroup'>;
const getProperties = ({ project, workingGroup }: EventOwnerProps) => {
  if (workingGroup) {
    return {
      ...workingGroup,
      href: workingGroups({}).workingGroup({
        workingGroupId: workingGroup.id,
      }).$,
    };
  }
  return (
    project && {
      ...project,
      href: projects({}).project({ projectId: project.id }).$,
    }
  );
};

const EventOwner: React.FC<EventOwnerProps> = ({ project, workingGroup }) => {
  const icon = workingGroup || !project ? workingGroupIcon : projectIcon;
  const { title, href } = getProperties({ project, workingGroup }) || {
    title: 'GP2 Hub',
  };

  return (
    <div css={listItemStyles}>
      <IconWithLabel noMargin icon={icon}>
        {href ? <Link href={href}>{title}</Link> : title}
      </IconWithLabel>
    </div>
  );
};

export default EventOwner;

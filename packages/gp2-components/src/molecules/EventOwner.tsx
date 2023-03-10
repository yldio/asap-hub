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

const EventOwner: React.FC<
  Pick<gp2Model.EventResponse, 'project' | 'workingGroup'>
> = ({ project, workingGroup }) => {
  const icon = workingGroup || !project ? workingGroupIcon : projectIcon;
  const { title } = workingGroup || project || { title: 'GP2 Hub' };

  return (
    <div css={listItemStyles}>
      <IconWithLabel noMargin icon={icon}>
        {workingGroup || project ? (
          <Link
            href={
              workingGroup
                ? workingGroups({}).workingGroup({
                    workingGroupId: workingGroup.id,
                  }).$
                : projects({}).project({ projectId: project!.id }).$
            }
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </IconWithLabel>
    </div>
  );
};

export default EventOwner;

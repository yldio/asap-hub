import { EventResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';

import { Link } from '../atoms';
import { neutral900 } from '../colors';
import {
  InterestGroupsIcon,
  inactiveBadgeIcon,
  WorkingGroupsIcon,
} from '../icons';
import { rem } from '../pixels';

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

const inactiveBadgeStyles = {
  lineHeight: rem(18),
  verticalAlign: 'middle',
  marginLeft: rem(8),
};

const EventOwner: React.FC<Pick<EventResponse, 'group' | 'workingGroup'>> = ({
  group,
  workingGroup,
}) => (
  <div css={listItemStyles}>
    {group ? (
      <Link href={network({}).groups({}).group({ groupId: group.id }).$}>
        <span css={iconStyles}>
          <InterestGroupsIcon />
        </span>
        {group.name}
        {!group.active && (
          <span css={inactiveBadgeStyles}>{inactiveBadgeIcon}</span>
        )}
      </Link>
    ) : workingGroup ? (
      <Link
        href={
          network({})
            .workingGroups({})
            .workingGroup({ workingGroupId: workingGroup.id }).$
        }
      >
        <span css={iconStyles}>
          <WorkingGroupsIcon />
        </span>
        {workingGroup.title}
      </Link>
    ) : (
      <>
        <span css={iconStyles}>
          <InterestGroupsIcon />
        </span>
        ASAP Event
      </>
    )}
  </div>
);

export default EventOwner;
